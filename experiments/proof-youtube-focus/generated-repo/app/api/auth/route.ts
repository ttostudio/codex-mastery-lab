import { getAuthState } from "@/lib/mocks/adapter";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  return NextResponse.json({ state: getAuthState(searchParams.get("state")) });
}
