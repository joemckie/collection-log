import { redis } from '@/redis';
import { User } from '@/schemas/user.schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { accountHash, ...user } = User.parse(await request.json());
  const data = await redis.json.set(`user:${accountHash}`, '$', user);

  if (!data) {
    throw new Error('Failed to save user data');
  }

  await redis.set(`user:${user.username}:accountHash`, accountHash);

  return NextResponse.json({ success: true });
}
