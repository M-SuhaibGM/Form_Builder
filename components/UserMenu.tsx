"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  if (!session) return null;

  const signOut = () =>
    authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/login") },
    });

  return (
    <div className="flex items-center gap-3">
      {session?.user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={session.user.image}
          alt={session.user.name}
          referrerPolicy="no-referrer"
          className="h-8 w-8 rounded-full"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
          {session.user.name?.[0]?.toUpperCase()}
        </div>
      )}
      <span className="hidden text-sm text-gray-700 lg:block">{session.user.name}</span>
      <button
        onClick={signOut}
        title="Sign out"
        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}