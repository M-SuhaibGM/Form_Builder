import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type Ctx = { params: Promise<{ id: string }> };

// Public: anyone can read a PUBLISHED form (needed for /f/[id]).
// Unpublished forms are only visible to their owner.
export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params;
  const form = await prisma.form.findUnique({ where: { id } });
  if (!form) return NextResponse.json({ message: "Not found" }, { status: 404 });

  if (!form.published) {
    const session = await getSession();
    if (!session || session.user.id !== form.userId) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
  }
  return NextResponse.json(form);
}

export async function PUT(req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Please sign in" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  // only allow these fields to be changed (never userId)
  const result = await prisma.form.updateMany({
    where: { id, userId: session.user.id },
    data: {
      title: body.title,
      description: body.description,
      fields: body.fields,
      published: body.published,
    },
  });
  if (result.count === 0) {
    return NextResponse.json({ message: "Form not found" }, { status: 404 });
  }
  const form = await prisma.form.findUnique({ where: { id } });
  return NextResponse.json(form);
}

export async function DELETE(_: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Please sign in" }, { status: 401 });

  const { id } = await params;
  const result = await prisma.form.deleteMany({ where: { id, userId: session.user.id } });
  if (result.count === 0) {
    return NextResponse.json({ message: "Form not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}