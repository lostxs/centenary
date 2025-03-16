import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { LibraryTracksView } from "~/modules/library/ui/views/library-tracks-view";
import { getQueryClient, trpc } from "~/shared/lib/trpc/server";

export default async function TracksPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.library.getTracks.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryTracksView />
    </HydrationBoundary>
  );
}
