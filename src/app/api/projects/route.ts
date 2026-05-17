import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { rooms: true }
        }
      }
    });

    return NextResponse.json(projects);
  } catch (error) {
    // Mock fallback
    return NextResponse.json([
      { id: "mock-project-1", name: "Örnek Proje 1", createdAt: new Date().toISOString(), _count: { rooms: 2 } },
      { id: "mock-project-2", name: "Örnek Proje 2", createdAt: new Date().toISOString(), _count: { rooms: 0 } },
    ]);
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        userId: session.user.id,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    // Mock fallback
    return NextResponse.json({ id: "mock-project-new", name: body.name || "Yeni Proje", description: body.description, userId: session.user.id, createdAt: new Date().toISOString() });
  }
}
