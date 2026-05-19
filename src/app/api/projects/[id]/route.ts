import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "mock_token",
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let project = await prisma.project.findFirst({
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

    // Check if any rooms are PROCESSING and have a predictionId
    let needsRefetch = false;
    for (const room of project.rooms) {
      if (room.status === "PROCESSING" && room.predictionId && process.env.REPLICATE_API_TOKEN) {
         try {
            const prediction = await replicate.predictions.get(room.predictionId);
            if (prediction.status === "succeeded") {
               const output = Array.isArray(prediction.output) ? prediction.output[prediction.output.length - 1] : prediction.output;

               // Check if this was a video processing task or an image staging task
               if (room.videoUrl === "PROCESSING") {
                 await prisma.room.update({
                    where: { id: room.id },
                    data: {
                       status: "COMPLETED",
                       videoUrl: output as string,
                       predictionId: null
                    }
                 });
               } else {
                 await prisma.room.update({
                    where: { id: room.id },
                    data: {
                       status: "COMPLETED",
                       stagedImage: output as string,
                       predictionId: null
                    }
                 });
               }
               needsRefetch = true;
            } else if (prediction.status === "failed" || prediction.status === "canceled") {
               await prisma.room.update({
                  where: { id: room.id },
                  data: {
                     status: "COMPLETED", // Revert back to completed so they can try again if video failed
                     videoUrl: room.videoUrl === "PROCESSING" ? null : room.videoUrl,
                     predictionId: null
                  }
               });
               needsRefetch = true;
            }
         } catch(e) {
           console.error("Polling error for prediction:", room.predictionId, e);
         }
      }
    }

    if (needsRefetch) {
       project = await prisma.project.findFirst({
          where: { id: params.id, userId: session.user.id },
          include: { rooms: { orderBy: { createdAt: "desc" } } }
       });
    }

    // Safety check to avoid blowing up Vercel payload limits if a user uploads a raw 10MB base64 image
    // Strip originalImage (Base64) from the response since the client doesn't need to download it again.
    if (project && project.rooms) {
       project.rooms = project.rooms.map(room => {
          if (room.originalImage && room.originalImage.length > 5000) {
             room.originalImage = "data:image/png;base64,stripped_for_bandwidth";
          }
          return room;
       });
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
