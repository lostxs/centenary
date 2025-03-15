import MuxUploader, {
  MuxUploaderDrop,
  MuxUploaderFileSelect,
  MuxUploaderProgress,
  MuxUploaderStatus,
} from "@mux/mux-uploader-react";
import { UploadIcon } from "lucide-react";

import { Button } from "~/shared/ui/button";

export function TrackUploader({
  endpoint,
  onSuccess,
  onError,
}: {
  endpoint?: string;
  onSuccess: () => void;
  onError: () => void;
}) {
  const UPLOADER_ID = "track-uploader";

  return (
    <>
      <MuxUploader
        id={UPLOADER_ID}
        endpoint={endpoint}
        onSuccess={onSuccess}
        onError={onError}
        className="group/uploader invisible hidden"
      />
      <MuxUploaderDrop muxUploader={UPLOADER_ID} className="group/drop">
        <div slot="heading" className="flex flex-col items-center gap-6">
          <div className="bg-muted flex size-32 items-center justify-center gap-2 rounded-full">
            <UploadIcon className="text-muted-foreground size-10 transition-all group-[&[active]]/drop:animate-bounce" />
          </div>
          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm font-medium">Drop your track here</p>
            {/* TODO: Add a privacy (public/private) toggle  */}
          </div>
          <MuxUploaderFileSelect muxUploader={UPLOADER_ID}>
            <Button type="button" className="rounded-full">
              Select file
            </Button>
          </MuxUploaderFileSelect>
        </div>
        <span slot="separator" className="hidden" />
        <MuxUploaderStatus muxUploader={UPLOADER_ID} className="text-sm" />
        <MuxUploaderProgress
          muxUploader={UPLOADER_ID}
          className="text-sm"
          type="percentage"
        />
        <MuxUploaderProgress muxUploader={UPLOADER_ID} type="bar" />
      </MuxUploaderDrop>
    </>
  );
}
