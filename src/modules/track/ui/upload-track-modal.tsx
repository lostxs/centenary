"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { useModalStore } from "~/app/_providers";
import { useTRPC } from "~/shared/lib/trpc/client";
import { ResponsiveModal } from "~/shared/ui/responsive-modal";
import { TrackUploader } from "./track-uploader";

export function UploadTrackModal() {
  const modalStore = useModalStore((state) => state);
  const trpc = useTRPC();
  const isModalOpen = modalStore.type === "upload-track" && modalStore.isOpen;

  const { data: upload, isLoading: isUploadLoading } = useQuery(
    trpc.tracks.createUpload.queryOptions(undefined, {
      enabled: isModalOpen,
    }),
  );

  const { mutate: createTrack, reset: resetCreateTrack } = useMutation(
    trpc.tracks.create.mutationOptions({
      onError: (error) => {
        console.error(error);
      },
      onSuccess: () => {
        modalStore.close();
      },
    }),
  );

  return (
    <ResponsiveModal
      title="Upload Track"
      open={isModalOpen}
      onOpenChange={() => modalStore.close()}
    >
      {isUploadLoading ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        upload && (
          <TrackUploader
            endpoint={upload.url}
            onSuccess={() => {
              createTrack({
                uploadId: upload.id,
              });
            }}
            onError={() => resetCreateTrack()}
          />
        )
      )}
    </ResponsiveModal>
  );
}
