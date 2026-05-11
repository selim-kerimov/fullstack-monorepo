"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/shared/trpc/client";
import { getErrorMessage } from "@/shared/trpc/error";

export default function Home() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.replace("/login");
    } else {
      setAuthed(true);
    }
  }, [router]);

  const utils = trpc.useUtils();
  const { data: users, isLoading } = trpc.users.getAll.useQuery();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const createUser = trpc.users.create.useMutation({
    onSuccess: () => {
      utils.users.getAll.invalidate();
      setFullName("");
      setEmail("");
      setPassword("");
    },
  });

  const updateUser = trpc.users.update.useMutation({
    onSuccess: () => {
      utils.users.getAll.invalidate();
      setEditingId(null);
    },
  });

  const deleteUser = trpc.users.delete.useMutation({
    onSuccess: () => utils.users.getAll.invalidate(),
  });

  const error = createUser.error || updateUser.error || deleteUser.error;

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.replace("/login");
  };

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Users</h1>
          <button
            onClick={logout}
            className="text-sm text-zinc-400 hover:text-white"
          >
            Log out
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400">{getErrorMessage(error)}</p>
        )}

        <div className="space-y-2">
          <h2 className="text-sm font-medium text-zinc-400">Create user</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="flex-1 rounded bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-zinc-600"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-zinc-600"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 rounded bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-zinc-600"
            />
            <button
              onClick={() =>
                createUser.mutate({
                  id: crypto.randomUUID(),
                  fullName,
                  email,
                  password,
                })
              }
              disabled={createUser.isPending}
              className="rounded bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-zinc-500">Loading...</p>
        ) : !users?.length ? (
          <p className="text-sm text-zinc-500">No users yet.</p>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded bg-zinc-900 border border-zinc-800 px-4 py-3"
              >
                {editingId === user.id ? (
                  <>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-sm outline-none"
                    />
                    <input
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="flex-1 rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-sm outline-none"
                    />
                    <button
                      onClick={() =>
                        updateUser.mutate({
                          id: user.id,
                          data: { fullName: editName, email: editEmail },
                        })
                      }
                      className="text-sm text-green-400 hover:text-green-300"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-sm text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingId(user.id);
                        setEditName(user.fullName);
                        setEditEmail(user.email);
                      }}
                      className="text-sm text-zinc-400 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser.mutate({ id: user.id })}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
