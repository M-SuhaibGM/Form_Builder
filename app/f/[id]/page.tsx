"use client";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, FileX, Loader2 } from "lucide-react";
import { api } from "@/lib/axios";
import { Form } from "@/types/form";
import FieldRenderer from "@/components/FieldRenderer";
import { validateForm } from "@/lib/validate";

function PublicForm() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api
      .get<unknown, Form>(`/forms/${id}`)
      .then((data) => {
        // remove blank options left over from the builder textarea
        const fields = data.fields.map((f) =>
          f.options ? { ...f, options: f.options.filter((o) => o.trim() !== "") } : f
        );
        setForm({ ...data, fields });
      })
      .catch(() => {}) // interceptor already toasted
      .finally(() => setLoading(false));
  }, [id]);

  const setValue = (fieldId: string, value: any) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const found = validateForm(form.fields, values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast.error("Please fix the highlighted fields");
      document
        .getElementById(`field-${Object.keys(found)[0]}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/forms/${id}/submit`, values);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // interceptor already toasted the error
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setValues({});
    setErrors({});
    setSubmitted(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!form || !form.published) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-sm text-center">
          <FileX className="mx-auto mb-3 h-10 w-10 text-gray-400" />
          <h1 className="text-lg font-semibold text-gray-900">Form not available</h1>
          <p className="mt-1 text-sm text-gray-500">
            {form
              ? "This form isn't published yet. Open it in the builder and click Save form."
              : "This form doesn't exist or was deleted."}
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-500" />
          <h1 className="text-xl font-bold text-gray-900">Thank you!</h1>
          <p className="mt-2 text-sm text-gray-600">Your response has been recorded.</p>
          <button
            onClick={reset}
            className="mt-6 text-sm font-medium text-blue-600 hover:underline"
          >
            Submit another response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-xl border-t-8 border-t-blue-600 border-x border-b bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
          {form.description && (
            <p className="mt-2 whitespace-pre-line text-sm text-gray-600">{form.description}</p>
          )}
          <p className="mt-4 text-xs text-red-500">* Required</p>
        </div>

        {form.fields.map((field) => (
          <div
            key={field.id}
            id={`field-${field.id}`}
            className={`rounded-xl border bg-white p-5 shadow-sm ${
              errors[field.id] ? "border-red-400" : ""
            }`}
          >
            <FieldRenderer
              field={field}
              value={values[field.id]}
              onChange={(v) => setValue(field.id, v)}
              error={errors[field.id]}
            />
          </div>
        ))}

        {form.fields.length === 0 ? (
          <p className="text-center text-sm text-gray-500">This form has no questions yet.</p>
        ) : (
          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              Clear form
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default function PublicFormPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <PublicForm />
    </Suspense>
  );
}