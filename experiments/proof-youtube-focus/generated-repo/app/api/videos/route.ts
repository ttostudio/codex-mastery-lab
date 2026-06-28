import { getRelatedVideos, getVideo, listVideos } from "@/lib/mocks/adapter";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const relatedTo = searchParams.get("relatedTo");

  if (id) {
    const video = await getVideo(id);
    return video ? NextResponse.json({ video }) : NextResponse.json({ message: "動画が見つかりません" }, { status: 404 });
  }

  if (relatedTo) {
    return NextResponse.json({ videos: await getRelatedVideos(relatedTo) });
  }

  return NextResponse.json({ videos: await listVideos() });
}
