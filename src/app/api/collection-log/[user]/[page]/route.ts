import { findPageCategory } from '@/app/utils/find-page-category';
import { redis } from '@/redis';
import { CollectionLogTabEntry, CollectionLogTabContents } from '@/schemas/collection-log.schema';
import { NextRequest, NextResponse } from 'next/server';

type Params = Promise<{ user: string; page: CollectionLogTabEntry; }>;

export async function GET(
  _request: NextRequest,
  { params }: { params: Params },
) {
  const { page, user } = await params;
  const category = findPageCategory(page);

  const accountHash = await redis.get<string>(`user:${user}:accountHash`);

  if (!accountHash) {
    return NextResponse.error();
  }

  const data = await redis.json.get<[CollectionLogTabContents]>(
    `collection-log:${accountHash}`,
    {},
    `$.tabs["${category}"]["${page}"]`,
  );

  return NextResponse.json(data?.[0]);
}
