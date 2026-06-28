import { getBillingState } from "@/lib/mocks/adapter";
import { billingLabels } from "@/lib/mocks/display";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const state = getBillingState(searchParams.get("state"));
  return NextResponse.json({ state, label: billingLabels[state] });
}
