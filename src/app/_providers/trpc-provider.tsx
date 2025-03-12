"use client";

import type { QueryClient } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { createQueryClient } from "~/shared/lib/query-client";
import {
  createTRPCClient,
  TRPCProvider as TRPCProviderBase,
} from "~/shared/lib/trpc/client";

let browserQueryClient: QueryClient | undefined = undefined;
function getQueryClient() {
  if (typeof window === "undefined") {
    return createQueryClient();
  }

  if (!browserQueryClient) browserQueryClient = createQueryClient();

  return browserQueryClient;
}

export function TRPCProvider({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() => createTRPCClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProviderBase trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProviderBase>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
