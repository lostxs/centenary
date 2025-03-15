import { TRPCError } from "@trpc/server";
import { ulid } from "ulid";
import { z } from "zod";

import { tracks_table as trackSchema } from "~/drizzle/schema";
import { protectedProcedure, router } from "~/server/trpc";
import { mux } from "~/shared/lib/mux/server";

export const tracksRouter = router({
  createUpload: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;

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
      timeout: 15 * 60,
    });

    return {
      uploadId: muxUpload.id,
      uploadUrl: muxUpload.url,
    };
  }),
  create: protectedProcedure
    .input(
      z.object({
        uploadId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const userId = ctx.user.id;

      const upload = await mux.video.uploads.retrieve(input.uploadId);

      if (upload.id !== input.uploadId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Upload ID does not match",
        });
      }

      const [createdTrack] = await db
        .insert(trackSchema)
        .values({
          id: ulid(),
          userId,
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
