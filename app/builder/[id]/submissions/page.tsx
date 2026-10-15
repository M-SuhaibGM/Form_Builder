"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  Trash2,
  Inbox,
  Loader2,
  Paperclip,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/axios";
import { Form, FormField, Submission, UploadedFile } from "@/types/form";

/* ---------- helpers ---------- */

// plain-text version of a value (used for CSV)
function toText(field: FormField, value: any): string {
  if (value === undefined || value === null) return "";
  if (field.type === "checkbox") return value ? "Yes" : "No";
  if (field.type === "file") {
    return Array.isArray(value) ? value.map((f: UploadedFile) => f.url).join("\n") : "";
  }
  return String(value);
}

function csvEscape(text: string) {
  return `"${text.replace(/"/g, '""')}"`;
}

// visual version of a value (used in the table)
function Cell({ field, value }: { field: FormField; value: any }) {
  if (value === undefined || value === null || value === "") {
    return <span className="text-gray-300">—</span>;
  }

  if (field.type === "checkbox") {
    return (
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          value ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
        }`}
      >
        {value ? "Yes" : "No"}
      </span>
    );
  }

  if (field.type === "file" && Array.isArray(value)) {
    return (
      <ul className="space-y-1">
        {value.map((f: UploadedFile) => (
          <li key={f.url}>
            <a
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-[220px] items-center gap-1 text-blue-600 hover:underline"
              title={f.name}
            >
              <Paperclip className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{f.name}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </li>
        ))}
      </ul>
    );
  }

  if (field.type === "textarea") {
    return (
      <p className="max-w-xs whitespace-pre-line line-clamp-3 text-gray-800" title={String(value)}>
        {String(value)}
      </p>
    );
  }

  if (field.type === "email") {
    return (
      <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
        {String(value)}
      </a>
    );
  }

  return <span className="text-gray-800">{String(value)}</span>;
}

/* ---------- page ---------- */

function SubmissionsContent() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      api.get<unknown, Form>(`/forms/${id}`),
      api.get<unknown, Submission[]>(`/forms/${id}/submissions`),
    ])
      .then(([f, s]) => {
        setForm(f);
        setSubmissions(s);
      })
      .catch(() => {}) // interceptor already toasted
      .finally(() => setLoading(false));
  }, [id]);

  // simple search across every answer
  const filtered = useMemo(() => {
    if (!form || !search.trim()) return submissions;
    const q = search.toLowerCase();
    return submissions.filter((s) =>
      form.fields.some((f) => toText(f, s.data[f.id]).toLowerCase().includes(q))
    );
  }, [submissions, search, form]);

  const deleteSubmission = (submission: Submission) => {
    toast("Delete this response?", {
      description: "This can't be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await api.delete(`/forms/${id}/submissions/${submission.id}`);
            setSubmissions((prev) => prev.filter((s) => s.id !== submission.id));
            toast.success("Response deleted");
          } catch {}
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const exportCsv = () => {
    if (!form || filtered.length === 0) return;

    const header = ["Submitted at", ...form.fields.map((f) => f.label)];
    const rows = filtered.map((s) => [
      new Date(s.createdAt).toLocaleString(),
      ...form.fields.map((f) => toText(f, s.data[f.id])),
    ]);

    const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");

    // "\uFEFF" lets Excel read UTF-8 correctly
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title.replace(/[^\w-]+/g, "_") || "responses"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50 text-gray-500">
        Form not found.
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <Link
          href={`/builder/${id}`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to builder
        </Link>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
            <p className="text-sm text-gray-500">
              {submissions.length} response{submissions.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search responses..."
              className="w-56 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={exportCsv}
              disabled={filtered.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Empty state */}
        {submissions.length === 0 && (
          <div className="flex flex-col items-center rounded-xl border-2 border-dashed bg-white py-16 text-center">
            <div className="mb-4 rounded-full bg-blue-50 p-4">
              <Inbox className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">No responses yet</h2>
            <p className="mt-1 text-sm text-gray-500">
              Share your form link and responses will show up here.
            </p>
            <Link
              href={`/f/${id}`}
              target="_blank"
              className="mt-5 text-sm font-medium text-blue-600 hover:underline"
            >
              Open the form
            </Link>
          </div>
        )}

        {/* No search matches */}
        {submissions.length > 0 && filtered.length === 0 && (
          <p className="rounded-xl border bg-white py-10 text-center text-sm text-gray-500">
            No responses match "{search}".
          </p>
        )}

        {/* Table */}
        {filtered.length > 0 && (
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="whitespace-nowrap px-4 py-3">Submitted</th>
                  {form.fields.map((f) => (
                    <th key={f.id} className="whitespace-nowrap px-4 py-3">
                      {f.label}
                    </th>
                  ))}
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((s, i) => (
                  <tr key={s.id} className="align-top hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">{filtered.length - i}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {new Date(s.createdAt).toLocaleString()}
                    </td>
                    {form.fields.map((f) => (
                      <td key={f.id} className="px-4 py-3">
                        <Cell field={f} value={s.data[f.id]} />
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteSubmission(s)}
                        title="Delete response"
                        className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SubmissionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <SubmissionsContent />
    </Suspense>
  );
}