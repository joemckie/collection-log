import { redis } from "@/redis";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ user: string; category: string; tab: string }>;

export async function GET(_request: NextRequest, { params }: { params: Params }) {
  const { category, tab, user } = await params;

  const data = await redis.json.get(`collection-log:${user}`, {}, `$.tabs["${category}"]["${tab}"]`);

  return NextResponse.json(data)
}
