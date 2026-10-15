"use client";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Form, FormField, FieldType } from "@/types/form";
import FieldRenderer from "@/components/FieldRenderer";
import FieldSettings from "@/components/builder/FieldSettings";

const FIELD_TYPES: { type: FieldType; label: string }[] = [
    { type: "text", label: "Short text" },
    { type: "textarea", label: "Long text" },
    { type: "email", label: "Email" },
    { type: "number", label: "Number" },
    { type: "select", label: "Dropdown" },
    { type: "radio", label: "Radio" },
    { type: "checkbox", label: "Checkbox" },
    { type: "file", label: "File upload" },
];

function BuilderContent() {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [fields, setFields] = useState<FormField[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<unknown, Form>(`/forms/${id}`)
            .then((form) => {
                setTitle(form.title);
                setDescription(form.description ?? "");
                setFields(form.fields);
            })
            .catch(() => { }) // interceptor already shows the toast
            .finally(() => setLoading(false));
    }, [id]);

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

    const save = async () => {
        setSaving(true);
        try {
            await api.put(`/forms/${id}`, { title, description, fields, published: true });
            toast.success("Form saved");
        } catch {
            // interceptor already toasted the error
        } finally {
            setSaving(false);
        }
    };

    const selected = fields.find((f) => f.id === selectedId);

    if (loading) return <p className="p-8">Loading...</p>;

    return (
        <div className="flex h-screen">
            {/* LEFT: field types */}
            <aside className="w-56 space-y-2 border-r p-4">
                <h3 className="mb-2 font-semibold">Add field</h3>
                {FIELD_TYPES.map((ft) => (
                    <button
                        key={ft.type}
                        onClick={() => addField(ft.type)}
                        className="w-full rounded border px-3 py-2 text-left text-sm hover:bg-gray-50"
                    >
                        + {ft.label}
                    </button>
                ))}
            </aside>

            {/* CENTER: canvas */}
            <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
                <div className="mx-auto max-w-2xl space-y-4">
                    <div className="space-y-2 rounded-lg border bg-white p-6">
                        <input
                            className="w-full text-2xl font-bold outline-none"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Form title"
                        />
                        <input
                            className="w-full text-sm text-gray-600 outline-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Form description"
                        />
                    </div>

                    {fields.length === 0 && (
                        <p className="text-center text-gray-400">Add a field from the left panel</p>
                    )}

                    {fields.map((field, i) => (
                        <div
                            key={field.id}
                            onClick={() => setSelectedId(field.id)}
                            className={`cursor-pointer rounded-lg border bg-white p-4 ${selectedId === field.id ? "border-blue-500 ring-1 ring-blue-500" : ""
                                }`}
                        >
                            <div className="pointer-events-none">
                                <FieldRenderer field={field} value={undefined} onChange={() => { }} />
                            </div>
                            <div className="mt-3 flex gap-3 text-xs">
                                <button onClick={(e) => { e.stopPropagation(); moveField(i, -1); }}>↑ Up</button>
                                <button onClick={(e) => { e.stopPropagation(); moveField(i, 1); }}>↓ Down</button>
                                <button
                                    className="text-red-600"
                                    onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* RIGHT: settings */}
            <aside className="w-72 border-l p-4">
                <button
                    onClick={save}
                    disabled={saving}
                    className="mb-6 w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save form"}
                </button>
                {selected ? (
                    <FieldSettings field={selected} onChange={updateField} />
                ) : (
                    <p className="text-sm text-gray-400">Select a field to edit it</p>
                )}
            </aside>
        </div>
    );
}

export default function BuilderPage() {
    return (
        <Suspense fallback={<p className="p-8">Loading...</p>}>
            <BuilderContent />
        </Suspense>
    );
}