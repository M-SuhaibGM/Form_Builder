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
  Search,
  Sparkles,
  LayoutGrid,
  List,
  ArrowUpRight,
  ClipboardList,
  Clock3,
  CheckCircle2,
  FilePlus2,
  Command,
  X,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { api } from "@/lib/axios";
import { Form } from "@/types/form";

type ViewMode = "grid" | "list";
type FilterMode = "all" | "published" | "draft";

export default function Dashboard() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [view, setView] = useState<ViewMode>("grid");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchForms = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await api.get<unknown, Form[]>("/forms");
      setForms(data);
    } catch {
      // The API interceptor already displays the error toast.
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchForms();
  }, []);

  const createForm = async () => {
    if (creating) return;

    setCreating(true);

    try {
      const form = await api.post<unknown, Form>("/forms", {
        title: "Untitled form",
        fields: [],
      });

      toast.success("Form created successfully");
      router.push(`/builder/${form.id}`);
    } catch {
      setCreating(false);
    }
  };

  const deleteForm = (form: Form) => {
    toast(`Delete "${form.title}"?`, {
      description: "This will also delete all of its responses.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await api.delete(`/forms/${form.id}`);
            setForms((prev) => prev.filter((f) => f.id !== form.id));
            toast.success("Form deleted successfully");
          } catch {
            // The API interceptor handles the error.
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => { },
      },
      duration: 10000,
    });
  };

  const copyLink = async (id: string) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/f/${id}`,
      );
      toast.success("Form link copied to clipboard");
    } catch {
      toast.error("Unable to copy link. Please try again.");
    }
  };

  const filteredForms = forms.filter((form) => {
    const matchesSearch = form.title
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    const matchesFilter =
      filter === "all" ||
      (filter === "published" && form.published) ||
      (filter === "draft" && !form.published);

    return matchesSearch && matchesFilter;
  });

  const publishedCount = forms.filter((form) => form.published).length;
  const draftCount = forms.length - publishedCount;
  const totalFields = forms.reduce(
    (total, form) => total + form.fields.length,
    0,
  );

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-900">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-72 bg-gradient-to-b from-blue-50/80 via-indigo-50/30 to-transparent" />

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Page heading */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Your workspace
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              My Forms<span className="text-blue-600">.</span>
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
              Create, organize, and manage your forms all in one place.
            </p>
          </div>

          <button
            onClick={createForm}
            disabled={creating}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {creating ? "Creating form..." : "Create new form"}
          </button>
        </section>

        {/* Stats */}
        <section className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total forms"
            value={forms.length}
            icon={FileText}
            description="Forms in your workspace"
            color="blue"
          />

          <StatCard
            label="Published forms"
            value={publishedCount}
            icon={CheckCircle2}
            description="Ready to collect responses"
            color="emerald"
          />

          <StatCard
            label="Draft forms"
            value={draftCount}
            icon={Clock3}
            description="Forms still in progress"
            color="violet"
          />

          <StatCard
            label="Total fields"
            value={totalFields}
            icon={ClipboardList}
            description="Fields across all forms"
            color="orange"
          />
        </section>

        {/* Getting started banner */}
        {!loading && forms.length === 0 && (
          <section className="relative mt-8 overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-sm sm:p-9">
            <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />
            <div className="absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-violet-100/50 blur-3xl" />

            <div className="relative flex flex-col items-start gap-7 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                  <FilePlus2 className="h-6 w-6" />
                </div>

                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Let&apos;s create your first form.
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
                  Start with a blank form, add your questions, and prepare
                  your form for sharing. Your workspace is ready when you are.
                </p>

                <button
                  onClick={createForm}
                  disabled={creating}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {creating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Create your first form
                </button>
              </div>

              <div className="hidden h-48 w-48 shrink-0 items-center justify-center rounded-3xl border border-white bg-gradient-to-br from-blue-50 to-indigo-100 shadow-inner md:flex">
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-xl shadow-blue-900/10">
                  <FileText className="h-14 w-14 text-blue-600" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Forms section */}
        <section className="mt-9">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Your forms
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Loading your workspace..."
                  : `${filteredForms.length} form${filteredForms.length === 1 ? "" : "s"} found`}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search your forms..."
                  aria-label="Search forms"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filter */}
              <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
                {(
                  [
                    ["all", "All"],
                    ["published", "Published"],
                    ["draft", "Drafts"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${filter === value
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-1 self-end rounded-xl border border-slate-200 bg-white p-1 sm:self-auto">
                <button
                  type="button"
                  title="Grid view"
                  aria-label="Grid view"
                  aria-pressed={view === "grid"}
                  onClick={() => setView("grid")}
                  className={`rounded-lg p-2 transition ${view === "grid"
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-400 hover:bg-slate-50"
                    }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  title="List view"
                  aria-label="List view"
                  aria-pressed={view === "list"}
                  onClick={() => setView("list")}
                  className={`rounded-lg p-2 transition ${view === "list"
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-400 hover:bg-slate-50"
                    }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => void fetchForms(true)}
                disabled={loading || refreshing}
                title="Refresh forms"
                aria-label="Refresh forms"
                className="flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 sm:self-auto"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""
                    }`}
                />
              </button>
            </div>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div
              className={
                view === "grid"
                  ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  : "space-y-3"
              }
            >
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className={`animate-pulse rounded-2xl border border-slate-200 bg-white ${view === "grid" ? "h-56" : "h-24"
                    }`}
                >
                  <div className="flex items-center gap-4 p-5">
                    <div className="h-11 w-11 rounded-xl bg-slate-100" />
                    <div className="flex-1">
                      <div className="h-4 w-2/3 rounded bg-slate-100" />
                      <div className="mt-3 h-3 w-1/3 rounded bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Forms grid */}
          {!loading && filteredForms.length > 0 && view === "grid" && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredForms.map((form, index) => (
                <article
                  key={form.id}
                  className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/[0.06]"
                >
                  <div
                    className={`h-1 w-full ${form.published
                        ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500"
                      }`}
                  />

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${index % 3 === 0
                            ? "bg-blue-50 text-blue-600"
                            : index % 3 === 1
                              ? "bg-violet-50 text-violet-600"
                              : "bg-indigo-50 text-indigo-600"
                          }`}
                      >
                        <FileText className="h-5 w-5" />
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${form.published
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                          }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${form.published
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                            }`}
                        />
                        {form.published ? "Published" : "Draft"}
                      </span>
                    </div>

                    <h3
                      title={form.title}
                      className="mt-5 truncate text-base font-bold text-slate-900 transition group-hover:text-blue-700"
                    >
                      {form.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <ClipboardList className="h-3.5 w-3.5" />
                        {form.fields.length} field
                        {form.fields.length === 1 ? "" : "s"}
                      </span>

                      {form.createdAt && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5" />
                          {new Date(form.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      )}
                    </div>

                    <div className="mt-6 flex flex-1 items-end">
                      <div className="grid w-full grid-cols-2 gap-2">
                        <Link
                          href={`/builder/${form.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit form
                        </Link>

                        <Link
                          href={`/builder/${form.id}/submissions`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                        >
                          <BarChart3 className="h-3.5 w-3.5" />
                          Responses
                        </Link>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/f/${form.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open form"
                          aria-label={`Open ${form.title}`}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => void copyLink(form.id)}
                          title="Copy form link"
                          aria-label={`Copy link for ${form.title}`}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Link2 className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteForm(form)}
                        title="Delete form"
                        aria-label={`Delete ${form.title}`}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Forms list */}
          {!loading && filteredForms.length > 0 && view === "list" && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="divide-y divide-slate-100">
                {filteredForms.map((form) => (
                  <div
                    key={form.id}
                    className="flex flex-col gap-4 p-4 transition hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FileText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-800">
                          {form.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {form.fields.length} field
                          {form.fields.length === 1 ? "" : "s"}
                          {form.createdAt &&
                            ` · ${new Date(form.createdAt).toLocaleDateString()}`}
                        </p>
                      </div>

                      <span
                        className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold sm:ml-3 ${form.published
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                          }`}
                      >
                        {form.published ? "Published" : "Draft"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 sm:justify-end">
                      <Link
                        href={`/builder/${form.id}`}
                        title="Edit form"
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Link>

                      <Link
                        href={`/builder/${form.id}/submissions`}
                        title="View responses"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-violet-50 hover:text-violet-600"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/f/${form.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open form"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => void copyLink(form.id)}
                        title="Copy form link"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Link2 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteForm(form)}
                        title="Delete form"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No search/filter matches */}
          {!loading && forms.length > 0 && filteredForms.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Search className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No matching forms found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Try a different search term or change your selected filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Bottom help banner */}
        <section className="mt-10 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Ready to build something great?
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Start a new form and turn your questions into something useful.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={createForm}
            disabled={creating}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            New form
            <ChevronRight className="h-4 w-4" />
          </button>
        </section>


      </main>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: number;
  description: string;
  icon: typeof FileText;
  color: "blue" | "emerald" | "violet" | "orange";
};

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  color,
}: StatCardProps) {
  const styles = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      accent: "bg-blue-500",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      accent: "bg-emerald-500",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      accent: "bg-violet-500",
    },
    orange: {
      icon: "bg-orange-50 text-orange-600",
      accent: "bg-orange-500",
    },
  };

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/[0.04] sm:p-6">
      <div
        className={`absolute inset-x-0 top-0 h-0.5 ${styles[color].accent} opacity-0 transition-opacity group-hover:opacity-100`}
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles[color].icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
        <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </article>
  );
}
