import {
  createTRPCReact,
  CreateTRPCReact,
  httpBatchLink,
} from "@trpc/react-query";
import { AppRouter } from "@repo/trpc/server";
import { QueryClient } from "@tanstack/react-query";

export const trpc: CreateTRPCReact<AppRouter, object> = createTRPCReact<
  AppRouter,
  object
>();

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_TRPC_URL!,
    }),
  ],
});
