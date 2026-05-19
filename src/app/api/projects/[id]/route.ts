import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        rooms: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    // Mock fallback
    return NextResponse.json({
      id: params.id,
      name: "Örnek Proje (Demo)",
      rooms: [
        {
          id: "mock-room-1",
          name: "Salon",
          originalImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1024",
          stagedImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1024",
          theme: "Modern",
          status: "COMPLETED",
          videoUrl: null
        }
      ]
    });
  }
}
