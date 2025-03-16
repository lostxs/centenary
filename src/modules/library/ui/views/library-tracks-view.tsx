import { TracksSection } from "../sections/tracks-section";

export function LibraryTracksView() {
  return (
    <div className="mx-auto mb-10 flex max-w-(--content-max-width) flex-col px-(--content-spacing)">
      <TracksSection />
    </div>
  );
}
