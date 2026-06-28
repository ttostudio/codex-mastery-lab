import { getComments } from "@/lib/mocks/adapter";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");
  if (!videoId) {
    return NextResponse.json({ message: "videoId が必要です" }, { status: 400 });
  }
  return NextResponse.json({ comments: await getComments(videoId) });
}
