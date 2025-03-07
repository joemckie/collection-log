import { redis } from '@/redis';
import { CollectionLogTabContents } from '@/schemas/collection-log.schema';
import { NextRequest, NextResponse } from 'next/server';

type Params = Promise<{ user: string; category: string; tab: string }>;

export async function GET(
  _request: NextRequest,
  { params }: { params: Params },
) {
  const { category, tab, user } = await params;

  const data = await redis.json.get<[CollectionLogTabContents]>(
    `collection-log:${user}`,
    {},
    `$.tabs["${category}"]["${tab}"]`,
  );

  return NextResponse.json(data?.[0]);
}
