import { FormField } from "@/types/form";

export function isEmpty(field: FormField, value: any) {
  if (field.type === "checkbox") return value !== true;
  if (field.type === "file") return !Array.isArray(value) || value.length === 0;
  return value === undefined || value === null || String(value).trim() === "";
}

export function validateField(field: FormField, value: any): string | undefined {
  if (isEmpty(field, value)) {
    return field.required ? "This field is required" : undefined;
  }
  if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
    return "Enter a valid email address";
  }
  if (field.type === "number" && Number.isNaN(Number(value))) {
    return "Enter a valid number";
  }
  if ((field.type === "select" || field.type === "radio") && !field.options?.includes(value)) {
    return "Choose one of the available options";
  }
  return undefined;
}

export function validateForm(fields: FormField[], data: Record<string, any>) {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const error = validateField(field, data[field.id]);
    if (error) errors[field.id] = error;
  }
  return errors;
}