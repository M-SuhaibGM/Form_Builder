"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, Plus, Menu, X, Loader2, LayoutDashboard, LogOut } from "lucide-react";
import { api } from "@/lib/axios";
import { authClient } from "@/lib/auth-client";
import { Form } from "@/types/form";
import UserMenu, { Avatar } from "./UserMenu";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const currentSession = session as unknown as
    | { user: { name: string; image?: string | null; email: string } }
    | null;
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // close the mobile menu when the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const createForm = async () => {
    setCreating(true);
    try {
      const form = await api.post<unknown, Form>("/forms", {
        title: "Untitled form",
        fields: [],
      });
      toast.success("Form created");
      setOpen(false);
      router.push(`/builder/${form.id}`);
    } catch {
      // interceptor already toasted the error
    } finally {
      setCreating(false);
    }
  };

  const signOut = () =>
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out");
          router.push("/login");
        },
      },
    });

  const isActive = (href: string) =>
    pathname === href || (href === "/dashboard" && pathname.startsWith("/builder"));

  const linkClass = (href: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive(href)
      ? "bg-blue-50 text-blue-700"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  const NewFormButton = ({ full = false }: { full?: boolean }) => (
    <button
      onClick={createForm}
      disabled={creating}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 ${full ? "w-full" : ""
        }`}
    >
      {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      New form
    </button>
  );

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-gray-200/80 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/25">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-gray-900">
            Form<span className="text-blue-600">Builder</span>
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-1 md:flex">

          <div className="ml-3">
            <UserMenu />
          </div>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute inset-x-0 top-16 border-b bg-white shadow-lg md:hidden">
          <div className="space-y-2 p-4">
            {currentSession && (
              <div className="mb-2 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                <Avatar name={currentSession.user.name} image={currentSession.user.image} size="h-10 w-10" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {currentSession.user.name}
                  </p>
                  <p className="truncate text-xs text-gray-500">{currentSession.user.email}</p>
                </div>
              </div>
            )}

            <Link
              href="/dashboard"
              className={`flex items-center gap-2 ${linkClass("/dashboard")}`}
            >
              <LayoutDashboard className="h-4 w-4" /> My Forms
            </Link>

            <NewFormButton full />

            {currentSession && (
              <button
                onClick={signOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}