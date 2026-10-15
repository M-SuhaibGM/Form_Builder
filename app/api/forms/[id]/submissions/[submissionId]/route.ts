import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type Ctx = { params: Promise<{ id: string; submissionId: string }> };

export async function DELETE(_: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Please sign in" }, { status: 401 });

  const { id, submissionId } = await params;
  const owned = await prisma.form.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });
  if (!owned) return NextResponse.json({ message: "Form not found" }, { status: 404 });

  const result = await prisma.submission.deleteMany({
    where: { id: submissionId, formId: id },
  });
  if (result.count === 0) {
    return NextResponse.json({ message: "Response not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}