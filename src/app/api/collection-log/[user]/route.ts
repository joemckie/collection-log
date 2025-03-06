import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/redis';
import { CollectionLog } from '@/schemas/collection-log.schema';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ user: string }> },
) {
  const { user } = await params;

  const data = await redis.json.get(`collection-log:${user}`);

  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ user: string }> },
) {
  const { user } = await params;
  const data = CollectionLog.parse(await request.json());

  await redis.json.set(`collection-log:${user}`, '$', data);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ user: string }> },
) {
  const { user } = await params;

  await redis.json.del(`collection-log:${user}`);

  return NextResponse.json({ success: true });
}
