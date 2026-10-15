"use client";
import { FileAccept, FormField } from "@/types/form";

interface Props {
    field: FormField;
    onChange: (updated: FormField) => void;
}

export default function FieldSettings({ field, onChange }: Props) {
    const needsOptions = field.type === "select" || field.type === "radio";
    const set = (patch: Partial<FormField>) => onChange({ ...field, ...patch });

    return (
        <div className="space-y-4">
            <h3 className="font-semibold">Field settings</h3>

            <div>
                <label className="text-sm font-medium">Label</label>
                <input
                    className="mt-1 w-full rounded border px-2 py-1 text-sm"
                    value={field.label}
                    onChange={(e) => set({ label: e.target.value })}
                />
            </div>

            <div>
                <label className="text-sm font-medium">
                    {field.type === "checkbox" ? "Checkbox text" : "Placeholder"}
                </label>
                <input
                    className="mt-1 w-full rounded border px-2 py-1 text-sm"
                    value={field.placeholder ?? ""}
                    onChange={(e) => set({ placeholder: e.target.value })}
                />
            </div>

            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => set({ required: e.target.checked })}
                />
                Required
            </label>

            {needsOptions && (
                <div>
                    <label className="text-sm font-medium">Options (one per line)</label>
                    <textarea
                        rows={5}
                        className="mt-1 w-full rounded border px-2 py-1 text-sm"
                        value={(field.options ?? []).join("\n")}
                        onChange={(e) => set({ options: e.target.value.split("\n") })}
                    />
                </div>


            )}
            {field.type === "file" && (
                <div>
                    <label className="text-sm font-medium text-gray-800">Allowed files</label>
                    <select
                        className="mt-1 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
                        value={field.accept ?? "any"}
                        onChange={(e) => set({ accept: e.target.value as FileAccept })}
                    >
                        <option value="any">Any file</option>
                        <option value="image">Images only</option>
                        <option value="document">Documents (PDF, Word, TXT)</option>
                    </select>
                </div>
            )}

        </div>
    );
}