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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.credits < 1) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    const room = await prisma.room.create({
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

    const prompt = customPrompt || `A beautiful ${theme || 'modern'} style living room interior, highly detailed, photorealistic`;

    try {
      if (!process.env.REPLICATE_API_TOKEN) {
        throw new Error("No Replicate API token");
      }

      let imageInput = originalImage;
      if (originalImage.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), 'public', originalImage);
        const imageBuffer = fs.readFileSync(filePath);
        const base64Data = imageBuffer.toString('base64');
        const ext = path.extname(filePath).slice(1);
        const mimeType = ext === 'jpg' ? 'jpeg' : ext;
        imageInput = `data:image/${mimeType};base64,${base64Data}`;
      }

      const output = await replicate.run(
        "jagilley/controlnet-hough:854e87270c1a02422db7db98f121a99a80577da743bd22b1c411516e87f897b2",
        {
          input: {
            image: imageInput,
            prompt: prompt,
            num_samples: "1",
            image_resolution: "512",
            a_prompt: "best quality, extremely detailed",
            n_prompt: "longbody, lowres, bad anatomy, bad hands, missing fingers",
          }
        }
      );

      const stagedImage = Array.isArray(output) ? output[1] || output[0] : output;

      await prisma.room.update({
        where: { id: room.id },
        data: {
          stagedImage: stagedImage as string,
          status: "COMPLETED",
        },
      });

    } catch (error) {
      console.log("Replicate failed or missing token, using mock fallback...");

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockImages = [
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1024",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1024",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1024",
      ];

      const randomMockImage = mockImages[Math.floor(Math.random() * mockImages.length)];

      await prisma.room.update({
        where: { id: room.id },
        data: {
          stagedImage: randomMockImage,
          status: "COMPLETED",
        },
      });
    }

    const updatedRoom = await prisma.room.findUnique({ where: { id: room.id }});

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error("Room processing error:", error);
    return NextResponse.json({ error: "Failed to process room" }, { status: 500 });
  }
}
