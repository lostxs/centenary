import { TRPCError } from "@trpc/server";
import { ulid } from "ulid";
import { z } from "zod";

import { tracks_table as trackSchema } from "~/drizzle/schema";
import { protectedProcedure, router } from "~/server/trpc";
import { mux } from "~/shared/lib/mux/server";

const redisUploadSchema = z.object({
  uploadId: z.string().min(1),
  uploadUrl: z.string().min(1),
});

type RedisUpload = z.infer<typeof redisUploadSchema>;

export const tracksRouter = router({
  getUpload: protectedProcedure.query(async ({ ctx }) => {
    const { redis, user } = ctx;
    const userId = user.id;
    const redisKey = `mux:upload:${userId}`;
    const lockKey = `mux:upload:lock:${userId}`;
    const uploadTtl = 15 * 60;

    const rawRedisUpload = await redis.get<RedisUpload>(redisKey);
    if (rawRedisUpload) {
      try {
        const uploadData = redisUploadSchema.parse(rawRedisUpload);
        await mux.video.uploads.retrieve(uploadData.uploadId);
        return uploadData;
      } catch (error) {
        console.error("Mux upload check failed:", error);
        await redis.del(redisKey);
        return null;
      }
    }

    // Lock the upload to prevent race conditions
    const lock = await redis.set(lockKey, "1", { nx: true, ex: 15 });
    if (!lock) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Upload creation in progress",
      });
    }

    try {
      // Check if the upload was created while waiting for the lock
      const rawDataAfterLock = await redis.get(redisKey);
      if (rawDataAfterLock) {
        return redisUploadSchema.parse(rawDataAfterLock);
      }

      const muxUpload = await mux.video.uploads.create({
        new_asset_settings: {
          passthrough: userId,
          playback_policy: ["public"],
          static_renditions: [
            {
              resolution: "audio-only",
            },
          ],
        },
        // TODO: Set cors origin to the real url
        cors_origin: "*",
        timeout: uploadTtl,
      });

      const muxUploadData = {
        uploadId: muxUpload.id,
        uploadUrl: muxUpload.url,
      };

      await redis.setex(redisKey, uploadTtl, JSON.stringify(muxUploadData));

      return muxUploadData;
    } catch (error) {
      console.error("Mux upload creation failed:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get upload",
      });
    } finally {
      await redis.del(lockKey);
    }
  }),
  create: protectedProcedure
    .input(
      z.object({
        uploadId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, redis } = ctx;
      const userId = ctx.user.id;
      const redisKey = `mux:upload:${userId}`;

      const upload = await mux.video.uploads.retrieve(input.uploadId);
      if (upload.new_asset_settings?.passthrough !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Upload does not belong to user",
        });
      }

      const [createdTrack] = await db.transaction(async (tx) => {
        const [track] = await tx
          .insert(trackSchema)
          .values({
            id: ulid(),
            userId,
            title: "Untitled",
            muxStatus: "waiting",
            muxUploadId: input.uploadId,
          })
          .returning();

        await redis.del(redisKey);

        return [track];
      });

      return {
        track: createdTrack,
      };
    }),
});
