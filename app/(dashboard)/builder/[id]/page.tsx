"use client";
import { Suspense, useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
    ArrowLeft,
    Type,
    AlignLeft,
    Mail,
    Hash,
    List,
    CircleDot,
    CheckSquare,
    UploadCloud,
    Plus,
    Copy,
    Trash2,
    ChevronUp,
    ChevronDown,
    GripVertical,
    Save,
    Eye,
    BarChart3,
    Loader2,
    MousePointerClick,
    CheckCircle2,
    Circle,
    type LucideIcon,
} from "lucide-react";
import { api } from "@/lib/axios";
import { Form, FormField, FieldType } from "@/types/form";
import FieldRenderer from "@/components/FieldRenderer";
import FieldSettings from "@/components/builder/FieldSettings";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import SortableFieldCard from "@/components/builder/SortableFieldCard";

/* ---------- field type metadata ---------- */

const FIELD_META: Record<FieldType, { label: string; icon: LucideIcon; tile: string }> = {
    text: { label: "Short text", icon: Type, tile: "bg-blue-100 text-blue-600" },
    textarea: { label: "Long text", icon: AlignLeft, tile: "bg-indigo-100 text-indigo-600" },
    email: { label: "Email", icon: Mail, tile: "bg-rose-100 text-rose-600" },
    number: { label: "Number", icon: Hash, tile: "bg-amber-100 text-amber-600" },
    select: { label: "Dropdown", icon: List, tile: "bg-violet-100 text-violet-600" },
    radio: { label: "Radio", icon: CircleDot, tile: "bg-emerald-100 text-emerald-600" },
    checkbox: { label: "Checkbox", icon: CheckSquare, tile: "bg-teal-100 text-teal-600" },
    file: { label: "File upload", icon: UploadCloud, tile: "bg-orange-100 text-orange-600" },
};

const FIELD_GROUPS: { title: string; types: FieldType[] }[] = [
    { title: "Text", types: ["text", "textarea", "email", "number"] },
    { title: "Choice", types: ["select", "radio", "checkbox"] },
    { title: "Media", types: ["file"] },
];


/* ---------- small pieces ---------- */

function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse rounded-lg bg-gray-200/80 ${className}`} />;
}

function BuilderSkeleton() {
    return (
        <div className="flex h-[calc(100dvh-4rem)] flex-col bg-gray-50">
            {/* toolbar */}
            <div className="flex h-14 items-center justify-between border-b bg-white px-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-5 w-40" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-28" />
                </div>
            </div>

            <div className="flex min-h-0 flex-1">
                {/* palette */}
                <div className="hidden w-60 space-y-3 border-r bg-white p-4 md:block">
                    <Skeleton className="h-4 w-20" />
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 shrink-0" />
                            <Skeleton className="h-4 flex-1" />
                        </div>
                    ))}
                </div>

                {/* canvas */}
                <div className="flex-1 space-y-4 overflow-hidden p-6">
                    <div className="mx-auto max-w-2xl space-y-4">
                        <div className="space-y-3 rounded-2xl border bg-white p-6">
                            <Skeleton className="h-8 w-2/3" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="space-y-3 rounded-2xl border bg-white p-5">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* settings */}
                <div className="hidden w-80 space-y-4 border-l bg-white p-4 lg:block">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-6 w-32" />
                </div>
            </div>
        </div>
    );
}

function EmptyCanvas() {
    return (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/70 px-6 py-12 text-center">
            <svg viewBox="0 0 200 150" className="mb-4 h-32 w-44" aria-hidden="true">
                <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                </defs>
                <circle cx="100" cy="75" r="62" fill="#eef2ff" />
                <rect x="52" y="28" width="96" height="94" rx="10" fill="#ffffff" stroke="#c7d2fe" strokeWidth="2" />
                <rect x="52" y="28" width="96" height="14" rx="7" fill="url(#g1)" />
                <rect x="64" y="54" width="48" height="6" rx="3" fill="#c7d2fe" />
                <rect x="64" y="66" width="72" height="12" rx="4" fill="#f1f5f9" stroke="#e2e8f0" />
                <rect x="64" y="86" width="36" height="6" rx="3" fill="#c7d2fe" />
                <rect x="64" y="98" width="72" height="12" rx="4" fill="#f1f5f9" stroke="#e2e8f0" />
                <circle cx="158" cy="110" r="16" fill="url(#g1)" />
                <path d="M158 102v16M150 110h16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Your form is empty</h3>
            <p className="mt-1 max-w-xs text-sm text-gray-500">
                Pick a field from the left panel to add your first question.
            </p>
        </div>
    );
}

function NoSelection() {
    return (
        <div className="flex flex-col items-center px-4 py-10 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <MousePointerClick className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold text-gray-900">Nothing selected</p>
            <p className="mt-1 text-xs text-gray-500">Click a field on the canvas to edit its settings.</p>
        </div>
    );
}

/* ---------- main ---------- */

function BuilderContent() {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [fields, setFields] = useState<FormField[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedSnapshot, setSavedSnapshot] = useState("");

    const snapshot = useMemo(
        () => JSON.stringify({ title, description, fields }),
        [title, description, fields]
    );
    const dirty = !loading && snapshot !== savedSnapshot;

    useEffect(() => {
        api
            .get<unknown, Form>(`/forms/${id}`)
            .then((form) => {
                const d = form.description ?? "";
                setTitle(form.title);
                setDescription(d);
                setFields(form.fields);
                setSavedSnapshot(JSON.stringify({ title: form.title, description: d, fields: form.fields }));
            })
            .catch(() => { }) // interceptor already toasted
            .finally(() => setLoading(false));
    }, [id]);


    const sensors = useSensors(
        // distance: 6 means a plain click on the handle doesn't start a drag
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        setFields((prev) => {
            const oldIndex = prev.findIndex((f) => f.id === active.id);
            const newIndex = prev.findIndex((f) => f.id === over.id);
            if (oldIndex < 0 || newIndex < 0) return prev;
            return arrayMove(prev, oldIndex, newIndex);
        });
    };

    const save = useCallback(async () => {
        if (saving) return;
        setSaving(true);
        try {
            await api.put(`/forms/${id}`, { title, description, fields, published: true });
            setSavedSnapshot(JSON.stringify({ title, description, fields }));
            toast.success("Form saved");
        } catch {
            // interceptor already toasted
        } finally {
            setSaving(false);
        }
    }, [id, title, description, fields, saving]);

    // Ctrl/Cmd + S to save
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
                e.preventDefault();
                save();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [save]);

    // warn before leaving with unsaved changes
    useEffect(() => {
        if (!dirty) return;
        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, [dirty]);

    const addField = (type: FieldType) => {
        const field: FormField = {
            id: crypto.randomUUID(),
            type,
            label: "Untitled question",
            required: false,
            options: type === "select" || type === "radio" ? ["Option 1", "Option 2"] : undefined,
            accept: type === "file" ? "any" : undefined,
        };
        setFields((prev) => [...prev, field]);
        setSelectedId(field.id);
    };

    const updateField = (updated: FormField) =>
        setFields((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));

    const duplicateField = (index: number) => {
        const copy: FormField = { ...fields[index], id: crypto.randomUUID() };
        setFields((prev) => [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)]);
        setSelectedId(copy.id);
    };

    const removeField = (fid: string) => {
        setFields((prev) => prev.filter((f) => f.id !== fid));
        if (selectedId === fid) setSelectedId(null);
    };

    const moveField = (index: number, dir: -1 | 1) => {
        const target = index + dir;
        if (target < 0 || target >= fields.length) return;
        const copy = [...fields];
        [copy[index], copy[target]] = [copy[target], copy[index]];
        setFields(copy);
    };

    const selected = fields.find((f) => f.id === selectedId);

    if (loading) return <BuilderSkeleton />;

    return (
        <div className="flex h-[calc(100dvh-4rem)] flex-col bg-gray-50">
            {/* ---------- TOOLBAR ---------- */}
            <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-white px-3 sm:px-4">
                <div className="flex min-w-0 items-center gap-3">
                    <Link
                        href="/dashboard"
                        title="Back to dashboard"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">{title || "Untitled form"}</p>
                        <p className="flex items-center gap-1 text-xs">
                            {dirty ? (
                                <span className="flex items-center gap-1 text-amber-600">
                                    <Circle className="h-2.5 w-2.5 fill-amber-500 text-amber-500" /> Unsaved changes
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-emerald-600">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> All changes saved
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={`/builder/${id}/submissions`}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        <BarChart3 className="h-4 w-4 text-violet-600" />
                        <span className="hidden sm:inline">Responses</span>
                    </Link>
                    <Link
                        href={`/f/${id}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        <Eye className="h-4 w-4 text-emerald-600" />
                        <span className="hidden sm:inline">Preview</span>
                    </Link>
                    <button
                        onClick={save}
                        disabled={saving || !dirty}
                        className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>

            <div className="flex min-h-0 flex-1">
                {/* ---------- LEFT: PALETTE ---------- */}
                <aside className="hidden w-60 shrink-0 overflow-y-auto border-r bg-white p-4 md:block">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Add field
                    </h3>
                    <div className="space-y-5">
                        {FIELD_GROUPS.map((group) => (
                            <div key={group.title}>
                                <p className="mb-2 text-xs font-medium text-gray-500">{group.title}</p>
                                <div className="space-y-1.5">
                                    {group.types.map((type) => {
                                        const { label, icon: Icon, tile } = FIELD_META[type];
                                        return (
                                            <button
                                                key={type}
                                                onClick={() => addField(type)}
                                                className="group flex w-full items-center gap-3 rounded-xl border border-transparent p-2 text-left text-sm font-medium text-gray-700 transition hover:border-gray-200 hover:bg-gray-50"
                                            >
                                                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tile}`}>
                                                    <Icon className="h-4 w-4" />
                                                </span>
                                                <span className="flex-1">{label}</span>
                                                <Plus className="h-4 w-4 text-gray-300 transition group-hover:text-blue-600" />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* ---------- CENTER: CANVAS ---------- */}
                <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="mx-auto max-w-2xl space-y-4">
                        {/* mobile palette */}
                        <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
                            {(Object.keys(FIELD_META) as FieldType[]).map((type) => {
                                const { label, icon: Icon, tile } = FIELD_META[type];
                                return (
                                    <button
                                        key={type}
                                        onClick={() => addField(type)}
                                        className="flex shrink-0 items-center gap-2 rounded-full border bg-white py-1.5 pl-1.5 pr-3 text-xs font-medium text-gray-700"
                                    >
                                        <span className={`flex h-6 w-6 items-center justify-center rounded-full ${tile}`}>
                                            <Icon className="h-3.5 w-3.5" />
                                        </span>
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* form header */}
                        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                            <div className="h-2 bg-linear-to-r from-blue-500 via-indigo-500 to-violet-500" />
                            <div className="space-y-2 p-6">
                                <input
                                    className="w-full bg-transparent text-2xl font-bold text-gray-900 outline-none placeholder:text-gray-300"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Form title"
                                />
                                <input
                                    className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-400"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add a description for your respondents"
                                />
                            </div>
                        </div>

                        {fields.length === 0 && <EmptyCanvas />}

                        {/* fields */}
                        <DndContext
                            id="form-builder-dnd"
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            modifiers={[restrictToVerticalAxis]}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-4">
                                    {fields.map((field, i) => (
                                        <SortableFieldCard
                                            key={field.id}
                                            field={field}
                                            index={i}
                                            total={fields.length}
                                            active={selectedId === field.id}
                                            meta={FIELD_META[field.type]}
                                            onSelect={() => setSelectedId(field.id)}
                                            onMove={(dir) => moveField(i, dir)}
                                            onDuplicate={() => duplicateField(i)}
                                            onRemove={() => removeField(field.id)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                        {fields.length > 0 && (
                            <p className="pb-6 text-center text-xs text-gray-400">
                                Tip: press <kbd className="rounded border bg-white px-1.5 py-0.5 font-mono">Ctrl</kbd> +{" "}
                                <kbd className="rounded border bg-white px-1.5 py-0.5 font-mono">S</kbd> to save
                            </p>
                        )}

                        {/* settings on small screens */}
                        {selected && (
                            <div className="rounded-2xl border bg-white p-4 shadow-sm lg:hidden">
                                <FieldSettings field={selected} onChange={updateField} />
                            </div>
                        )}
                    </div>
                </main>

                {/* ---------- RIGHT: SETTINGS ---------- */}
                <aside className="hidden w-80 shrink-0 overflow-y-auto border-l bg-white p-4 lg:block">
                    {selected ? <FieldSettings field={selected} onChange={updateField} /> : <NoSelection />}
                </aside>
            </div>
        </div>
    );
}

export default function BuilderPage() {
    return (
        <Suspense fallback={<BuilderSkeleton />}>
            <BuilderContent />
        </Suspense>
    );
}