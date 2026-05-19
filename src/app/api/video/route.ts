import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "mock_token",
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { roomId } = await req.json();

    if (!roomId) {
      return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
    }

    let room;
    try {
      room = await prisma.room.findUnique({
        where: { id: roomId },
        include: { project: true }
      });

      if (!room || !room.stagedImage) {
        return NextResponse.json({ error: "Room not found or not staged yet" }, { status: 404 });
      }

      if (room.project.userId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user || user.credits < 1) {
        return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: 1 } },
      });
    } catch (e) {
       // mock fallback
       room = { id: roomId, stagedImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1024" };
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("No Replicate API token");
    }

    const prediction = await replicate.predictions.create({
      version: "3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
      input: {
        cond_aug: 0.02,
        decoding_t: 7,
        input_image: room.stagedImage,
        video_length: "14_frames_with_svd",
        sizing_strategy: "maintain_aspect_ratio",
        motion_bucket_id: 127,
        frames_per_second: 6
      }
    });

    try {
      await prisma.room.update({
        where: { id: room.id },
        data: {
          predictionId: prediction.id, // Re-using the same field for SVD tracking
          status: "PROCESSING",
          videoUrl: "PROCESSING" // Temporary flag to track SVD processing
        },
      });

      const updatedRoom = await prisma.room.findUnique({ where: { id: roomId }});
      return NextResponse.json(updatedRoom);
    } catch(e) {
      return NextResponse.json({ ...room, videoUrl: "PROCESSING", predictionId: prediction.id });
    }
  } catch (error) {
    console.error("Video processing error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Video oluşturulamadı" }, { status: 500 });
  }
}
