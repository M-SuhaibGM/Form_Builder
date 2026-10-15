"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, Plus, Menu, X, Loader2 } from "lucide-react";
import { api } from "@/lib/axios";
import { Form } from "@/types/form";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

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

  const linkClass = (href: string) =>
    `rounded-md px-3 py-2 text-sm font-medium transition ${
      pathname === href
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <header className="sticky top-0 z-40 h-16 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-600 p-1.5">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">FormBuilder</span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-2 md:flex">
          <Link href="/" className={linkClass("/")}>
            My Forms
          </Link>
          <button
            onClick={createForm}
            disabled={creating}
            className="ml-2 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            New form
          </button>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute inset-x-0 top-16 space-y-2 border-b bg-white p-4 shadow-md md:hidden">
          <Link href="/" onClick={() => setOpen(false)} className={`block ${linkClass("/")}`}>
            My Forms
          </Link>
          <button
            onClick={createForm}
            disabled={creating}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> New form
          </button>
        </div>
      )}
    </header>
  );
}