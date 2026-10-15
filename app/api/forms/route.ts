import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Please sign in" }, { status: 401 });

  const forms = await prisma.form.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(forms);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Please sign in" }, { status: 401 });

  const body = await req.json();
  const form = await prisma.form.create({
    data: {
      title: body.title,
      description: body.description,
      fields: body.fields ?? [],
      userId: session.user.id,
    },
  });
  return NextResponse.json(form, { status: 201 });
}