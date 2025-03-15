"use client";

import { UploadTrackModal } from "~/modules/track/ui/upload-track-modal";
import { useModalStore } from "../_providers";

export function Modals() {
  const modalType = useModalStore((state) => state.type);

  return <>{modalType === "upload-track" && <UploadTrackModal />}</>;
}
