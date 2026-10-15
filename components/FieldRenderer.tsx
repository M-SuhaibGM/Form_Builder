"use client";
import { FormField } from "@/types/form";
import FileUpload from "@/components/FileUpload";

interface Props {
    field: FormField;
    value: any;
    onChange: (value: any) => void;
    error?: string;
}

const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function FieldRenderer({ field, value, onChange, error }: Props) {
    const renderInput = () => {
        switch (field.type) {
            case "textarea":
                return (
                    <textarea
                        className={inputClass}
                        rows={4}
                        placeholder={field.placeholder}
                        value={value ?? ""}
                        onChange={(e) => onChange(e.target.value)}
                    />
                );

            case "file":
                return <FileUpload field={field} value={value ?? []} onChange={onChange} />;
            case "select":
                return (
                    <select
                        className={inputClass}
                        value={value ?? ""}
                        onChange={(e) => onChange(e.target.value)}
                    >
                        <option value="">Select...</option>
                        {field.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                );

            case "radio":
                return (
                    <div className="space-y-1">
                        {field.options?.map((opt) => (
                            <label key={opt} className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name={field.id}
                                    checked={value === opt}
                                    onChange={() => onChange(opt)}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                );

            case "checkbox":
                return (
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={!!value}
                            onChange={(e) => onChange(e.target.checked)}
                        />
                        {field.placeholder || "Yes"}
                    </label>
                );

            default: // text, email, number
                return (
                    <input
                        type={field.type}
                        className={inputClass}
                        placeholder={field.placeholder}
                        value={value ?? ""}
                        onChange={(e) => onChange(e.target.value)}
                    />
                );
        }
    };

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
            </label>
            {renderInput()}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}