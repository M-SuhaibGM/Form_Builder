import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Please sign in" }, { status: 401 });

  const { id } = await params;
  const owned = await prisma.form.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });
  if (!owned) return NextResponse.json({ message: "Form not found" }, { status: 404 });

  const submissions = await prisma.submission.findMany({
    where: { formId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(submissions);
}