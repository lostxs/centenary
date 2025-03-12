"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/shared/lib/trpc/client";

export default function Home() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.healthcheck.queryOptions());

  return (
    <div className="h-[1500px]">
      <h1>Hello World</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
