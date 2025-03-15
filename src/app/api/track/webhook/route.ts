import type {
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks.mjs";
import type { NextRequest } from "next/server";
import { headers as nextHeaders } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { tracks_table } from "~/drizzle/schema";
import { env } from "~/env";
import { db } from "~/shared/lib/db";
import { mux } from "~/shared/lib/mux/server";

const SIGNING_SECRET = env.MUX_WEBHOOK_SECRET;

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetTrackReadyWebhookEvent;

export const POST = async (request: NextRequest) => {
  const headers = await nextHeaders();

  const signature = headers.get("mux-signature");
  if (!signature) return new NextResponse("Missing signature", { status: 401 });

  const payload = (await request.json()) as WebhookEvent;
  const body = JSON.stringify(payload);

  mux.webhooks.verifySignature(
    body,
    {
      "mux-signature": signature,
    },
    SIGNING_SECRET,
  );

  switch (payload.type) {
    case "video.asset.created": {
      const data = payload.data;
      if (!data.upload_id) {
        return new NextResponse("Missing upload_id", { status: 400 });
      }

      await db
        .update(tracks_table)
        .set({
          muxAssetId: data.id,
          muxStatus: data.status,
        })
        .where(eq(tracks_table.muxUploadId, data.upload_id));
      break;
    }
    case "video.asset.ready": {
      const data = payload.data;
      if (!data.upload_id) {
        return new NextResponse("Missing upload_id", { status: 400 });
      }

      const playbackId = data.playback_ids?.[0].id;
      if (!playbackId) {
        return new NextResponse("Missing playback_id", { status: 400 });
      }

      const thumbnail = `https://image.mux.com/${playbackId}/thumbnail.jpg`;

      await db
        .update(tracks_table)
        .set({
          muxStatus: data.status,
          muxPlaybackId: playbackId,
          muxAssetId: data.id,
          thumbnail,
        })
        .where(eq(tracks_table.muxUploadId, data.upload_id));
      break;
    }
  }

  return new NextResponse("OK", { status: 200 });
};
