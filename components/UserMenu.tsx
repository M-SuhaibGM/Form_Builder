"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { authClient } from "@/lib/auth-client";

function Avatar({ name, image, size = "h-9 w-9" }: { name?: string; image?: string | null; size?: string }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name ?? "User"}
        referrerPolicy="no-referrer"
        className={`${size} rounded-full object-cover ring-2 ring-white`}
      />
    );
  }
  return (
    <div
      className={`${size} flex items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white ring-2 ring-white`}
    >
      {name?.[0]?.toUpperCase() ?? "U"}
    </div>
  );
}

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click or Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (isPending) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />;
  }
  if (!session) return null;

  const user = (session as unknown as { user: { name: string; email: string; image?: string | null } }).user;

  const signOut = async () => {
    setSigningOut(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out");
          router.push("/login");
        },
        onError: () => {
          toast.error("Could not sign out");
          setSigningOut(false);
        },
      },
    });
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full p-1 pr-2 transition hover:bg-gray-100"
      >
        <Avatar name={user.name} image={user.image} />

        <p>{user.name}</p>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border bg-white shadow-xl"
        >
          <div className="flex items-center gap-3 border-b bg-gray-50 p-4">
            <Avatar name={user.name} image={user.image} size="h-11 w-11" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
              <p className="truncate text-xs text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="p-1.5">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LayoutDashboard className="h-4 w-4 text-gray-500" />
              My forms
            </Link>
            <button
              onClick={signOut}
              disabled={signingOut}
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { Avatar };