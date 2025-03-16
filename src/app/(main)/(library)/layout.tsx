import type { PropsWithChildren } from "react";

import { LibraryLayout } from "~/modules/library/ui/layouts/library-layout";

export default function Layout({ children }: PropsWithChildren) {
  return <LibraryLayout>{children}</LibraryLayout>;
}
