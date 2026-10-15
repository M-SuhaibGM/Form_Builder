"use client";
import { useRef } from "react";
import { toast } from "sonner";
import { UploadCloud, X, FileText, Loader2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { FormField, UploadedFile } from "@/types/form";

interface Props {
  field: FormField;
  value: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
}

const ENDPOINT = {
  image: "imageUploader",
  document: "documentUploader",
  any: "anyUploader",
} as const;

const ACCEPT_ATTR = {
  image: "image/*",
  document: ".pdf,.txt,.doc,.docx",
  any: undefined,
} as const;

const HINT = {
  image: "Images up to 4MB, max 3 files",
  document: "PDF, TXT, DOC, DOCX up to 8MB, max 3 files",
  any: "Any file up to 8MB, max 3 files",
} as const;

export default function FileUpload({ field, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const kind = field.accept ?? "any";

  const { startUpload, isUploading } = useUploadThing(ENDPOINT[kind], {
    onUploadError: (e) => {
      toast.error(e.message);
    },
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const res = await startUpload(Array.from(files));
    if (inputRef.current) inputRef.current.value = "";
    if (!res) return;

    const uploaded: UploadedFile[] = res.map((f) => ({
      name: f.name,
      url: f.ufsUrl,
      size: f.size,
      type: f.type,
    }));
    onChange([...value, ...uploaded]);
    toast.success(`${uploaded.length} file${uploaded.length > 1 ? "s" : ""} uploaded`);
  };

  const remove = (url: string) => onChange(value.filter((f) => f.url !== url));

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center gap-1 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50 disabled:opacity-60"
      >
        {isUploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        ) : (
          <UploadCloud className="h-6 w-6 text-gray-500" />
        )}
        <span className="text-sm font-medium text-gray-700">
          {isUploading ? "Uploading..." : "Click to upload"}
        </span>
        <span className="text-xs text-gray-500">{HINT[kind]}</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        accept={ACCEPT_ATTR[kind]}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((f) => (
            <li
              key={f.url}
              className="flex items-center gap-3 rounded-lg border bg-white p-2"
            >
              {f.type.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.url} alt={f.name} className="h-10 w-10 rounded object-cover" />
              ) : (
                <div className="rounded bg-blue-50 p-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-gray-800">{f.name}</p>
                <p className="text-xs text-gray-500">{(f.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                type="button"
                onClick={() => remove(f.url)}
                className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}