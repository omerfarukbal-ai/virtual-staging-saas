import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Replicate from "replicate";
import fs from "fs";
import path from "path";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "mock_token",
});

export const maxDuration = 60; // 1 minute timeout for Vercel

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, originalImage, theme, customPrompt, projectId } = await req.json();

    if (!name || !originalImage || !projectId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let room;
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user || user.credits < 1) {
        return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
      }

      // Verify the user owns the project before creating a room
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId: session.user.id }
      });

      if (!project) {
        return NextResponse.json({ error: "Proje bulunamadı veya yetkiniz yok" }, { status: 403 });
      }

      room = await prisma.room.create({
        data: {
          name,
          originalImage,
          theme,
          customPrompt,
          projectId,
          status: "PROCESSING",
        },
      });

      await prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: 1 } },
      });
    } catch (dbError) {
       console.log("DB fallback in rooms create");
       room = { id: `mock-room-${Date.now()}`, name, originalImage, theme, status: "PROCESSING", projectId };
    }

    const prompt = customPrompt || `A beautiful ${theme || 'modern'} style living room interior, highly detailed, photorealistic`;

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("Replicate API anahtarı eksik.");
    }

    const output = await replicate.run(
      "rocketdigitalai/interior-design-sdxl:a3c091059a25590ce2d5ea13651fab63f447f21760e50c358d4b850e844f59ee",
      {
        input: {
          image: originalImage, // Directly passing Base64 Data URI from frontend
          prompt: prompt,
          negative_prompt: "lowres, watermark, banner, logo, watermark, contactinfo, text, deformed, blurry, blur, out of focus, out of frame, surreal, extra, ugly, poorly drawn, poorly lit, bad anatomy",
          num_inference_steps: 50,
          promax_strength: 0.8,
          depth_strength: 0.8
        }
      }
    );

    const stagedImage = Array.isArray(output) ? output[1] || output[0] : output;

    try {
      await prisma.room.update({
        where: { id: room.id },
        data: {
          stagedImage: stagedImage as string,
          status: "COMPLETED",
        },
      });
      const updatedRoom = await prisma.room.findUnique({ where: { id: room.id }});
      return NextResponse.json(updatedRoom);
    } catch (e) {
       // if room was a mock object, Prisma update will fail. Return the mock object instead.
      return NextResponse.json({ ...room, status: "COMPLETED", stagedImage: stagedImage as string });
    }

  } catch (error) {
    console.error("Room processing error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Oda eşyalandırılamadı" }, { status: 500 });
  }
}
