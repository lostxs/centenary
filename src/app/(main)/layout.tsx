import type { PropsWithChildren } from "react";
import { cookies, headers } from "next/headers";

import { MainLayout } from "~/modules/main/ui/main-layout";
import { auth } from "~/shared/lib/auth/server";

export default async function Layout({ children }: PropsWithChildren) {
  // TODO: Prefetch session via react query
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <MainLayout defaultOpen={defaultOpen} session={session}>
      {children}
    </MainLayout>
  );
}
