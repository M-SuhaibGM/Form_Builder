import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FormField } from "@/types/form";
import { validateForm } from "@/lib/validate";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const form = await prisma.form.findUnique({ where: { id } });
  if (!form) return NextResponse.json({ message: "Form not found" }, { status: 404 });
  if (!form.published) {
    return NextResponse.json({ message: "This form is not accepting responses" }, { status: 403 });
  }

  const body = await req.json();
  const fields = form.fields as unknown as FormField[];

  const errors = validateForm(fields, body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ message: "Please check your answers", errors }, { status: 400 });
  }

  // keep only answers that belong to this form's fields
  const data: Record<string, unknown> = {};
  for (const field of fields) {
    if (body[field.id] !== undefined) data[field.id] = body[field.id];
  }

  const submission = await prisma.submission.create({
    data: { formId: id, data: data as any },
  });
  return NextResponse.json({ id: submission.id }, { status: 201 });
}