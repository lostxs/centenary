import { TRPCError } from "@trpc/server";
import { ulid } from "ulid";
import { z } from "zod";

import { tracks_table as trackSchema } from "~/drizzle/schema";
import { protectedProcedure, router } from "~/server/trpc";
import { mux } from "~/shared/lib/mux/server";

export const tracksRouter = router({
  createUpload: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    const muxUpload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: user.id,
        playback_policy: ["public"],
        static_renditions: [
          {
            resolution: "audio-only",
          },
        ],
      },
      // TODO: Set cors origin to the real url
      cors_origin: "*",
    });

    return {
      id: muxUpload.id,
      url: muxUpload.url,
      timeout: muxUpload.timeout,
    };
  }),
  create: protectedProcedure
    .input(
      z.object({
        uploadId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user, db } = ctx;

      const muxUpload = await mux.video.uploads.retrieve(input.uploadId);
      if (muxUpload.new_asset_settings?.passthrough !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Upload does not belong to user",
        });
      }

      const [createdTrack] = await db
        .insert(trackSchema)
        .values({
          id: ulid(),
          userId: user.id,
          title: "Untitled",
          muxStatus: "waiting",
          muxUploadId: input.uploadId,
        })
        .returning();

      return {
        track: createdTrack,
      };
    }),
});
