"use client";
import { trpc } from "@/shared/trpc/client";

export default function Home() {
  const { data } = trpc.users.getAll.useQuery();

  console.log(JSON.stringify(data, null, 2));

  return <div></div>;
}
