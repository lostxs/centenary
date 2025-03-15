"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { useModalStore } from "~/app/_providers";
import { useTRPC } from "~/shared/lib/trpc/client";
import { ResponsiveModal } from "~/shared/ui/responsive-modal";
import { TrackUploader } from "./track-uploader";

export function UploadTrackModal() {
  const modalStore = useModalStore((state) => state);
  const trpc = useTRPC();
  const isModalOpen = modalStore.type === "upload-track" && modalStore.isOpen;
  const { uploadUrl, uploadId } = modalStore.data as {
    uploadUrl: string;
    uploadId: string;
  };

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
      {modalStore.isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        <TrackUploader
          endpoint={uploadUrl}
          onSuccess={() => {
            createTrack({
              uploadId,
            });
          }}
          onError={() => resetCreateTrack()}
        />
      )}
    </ResponsiveModal>
  );
}
