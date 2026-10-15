
export interface FormField {
    id: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[]; // for select / radio
}

export interface Form {
    id: string;
    title: string;
    description?: string;
    fields: FormField[];
    published: boolean;
    createdAt?: string;
}
export type FieldType =
  | "text" | "email" | "number" | "textarea"
  | "select" | "checkbox" | "radio" | "file";

export type FileAccept = "image" | "document" | "any";

export interface UploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  accept?: FileAccept; // only for type "file"
}

export interface Submission {
  id: string;
  formId: string;
  data: Record<string, any>;
  createdAt: string;
}