"use client";
import { PropsWithChildren } from "react";
import { queryClient, trpc, trpcClient } from "@/shared/trpc/client";
import { QueryClientProvider } from "@tanstack/react-query";

export const TrpcProvider = ({ children }: PropsWithChildren) => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
