'use server';

import { findPageCategory } from '@/app/utils/find-page-category';
import { redis } from '@/redis';
import {
  CollectionLogTabEntry,
  CollectionLogTabContents,
} from '@/schemas/collection-log.schema';
import { NextRequest, NextResponse } from 'next/server';
import { unstable_cacheTag as cacheTag } from 'next/cache';

type Params = Promise<{ user: string; page: CollectionLogTabEntry }>;

export async function GET(
  _request: NextRequest,
  { params }: { params: Params },
) {
  'use cache';

  const { page, user } = await params;
  
  const category = findPageCategory(page);
  
  const accountHash = await redis.get<string>(`user:${user}:account-hash`);
  
  if (!accountHash) {
    return NextResponse.json(null, { status: 404 });
  }
  
  cacheTag('collection-log', accountHash, page);

  const data = await redis.json.get<[CollectionLogTabContents]>(
    `collection-log:${accountHash}`,
    {},
    `$.tabs["${category}"]["${page}"]`,
  );

  return NextResponse.json(data?.[0]);
}
