"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  ExternalLink,
  BarChart3,
  Trash2,
  Link2,
  FileText,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/axios";
import { Form } from "@/types/form";

export default function Dashboard() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    api
      .get<unknown, Form[]>("/forms")
      .then(setForms)
      .catch(() => {}) // interceptor already shows the toast
      .finally(() => setLoading(false));
  }, []);

  const createForm = async () => {
    setCreating(true);
    try {
      const form = await api.post<unknown, Form>("/forms", {
        title: "Untitled form",
        fields: [],
      });
      toast.success("Form created");
      router.push(`/builder/${form.id}`);
    } catch {
      setCreating(false);
    }
  };

  const deleteForm = (form: Form) => {
    toast(`Delete "${form.title}"?`, {
      description: "This also deletes all of its responses.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await api.delete(`/forms/${form.id}`);
            setForms((prev) => prev.filter((f) => f.id !== form.id));
            toast.success("Form deleted");
          } catch {}
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const copyLink = async (id: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/f/${id}`);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Forms</h1>
            <p className="text-sm text-gray-500">
              {loading ? "Loading..." : `${forms.length} form${forms.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <button
            onClick={createForm}
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Create form
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Loading skeletons */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl border bg-white" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && forms.length === 0 && (
          <div className="flex flex-col items-center rounded-xl border-2 border-dashed bg-white py-16 text-center">
            <div className="mb-4 rounded-full bg-blue-50 p-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">No forms yet</h2>
            <p className="mb-6 mt-1 text-sm text-gray-500">
              Create your first form and start collecting responses.
            </p>
            <button
              onClick={createForm}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> Create form
            </button>
          </div>
        )}

        {/* Forms grid */}
        {!loading && forms.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <div
                key={form.id}
                className="group flex flex-col justify-between rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="rounded-lg bg-blue-50 p-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        form.published
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {form.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <h3 className="line-clamp-1 font-semibold text-gray-900">{form.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {form.fields.length} field{form.fields.length === 1 ? "" : "s"}
                    {form.createdAt && (
                      <> · {new Date(form.createdAt).toLocaleDateString()}</>
                    )}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t pt-3">
                  <div className="flex gap-1">
                    <Link
                      href={`/builder/${form.id}`}
                      title="Edit"
                      className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/builder/${form.id}/submissions`}
                      title="Responses"
                      className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-purple-600"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/f/${form.id}`}
                      target="_blank"
                      title="Open form"
                      className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-green-600"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => copyLink(form.id)}
                      title="Copy link"
                      className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Link2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => deleteForm(form)}
                    title="Delete"
                    className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}