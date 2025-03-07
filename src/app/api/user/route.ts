import { redis } from '@/redis';
import { User } from '@/schemas/user.schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { accountHash, ...user } = User.parse(await request.json());
  const data = await redis.json.set(`user:${accountHash}`, '$', user);

  return NextResponse.json({ success: !!data });
}
