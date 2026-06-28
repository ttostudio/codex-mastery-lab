import { searchVideos } from "@/lib/mocks/adapter";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  return NextResponse.json({ videos: await searchVideos(query), query });
}
