import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/redis';
import { CollectionLog } from '@/schemas/collection-log.schema';

type Params = Promise<{ user: string }>;

export async function GET(
  _request: NextRequest,
  { params }: { params: Params },
) {
  const { user } = await params;
  const accountHash = await redis.get<string>(`user:${user}:accountHash`);

  if (!accountHash) {
    return NextResponse.json(null, { status: 404 });
  }

  const data = await redis.json.get(`collection-log:${accountHash}`);

  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { user } = await params;
  const data = CollectionLog.parse(await request.json());
  const accountHash = await redis.get<string>(`user:${user}:accountHash`);

  if (!accountHash) {
    return NextResponse.json(null, { status: 404 });
  }

  await redis.json.set(`collection-log:${accountHash}`, '$', data);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params },
) {
  const { user } = await params;
  const accountHash = await redis.get<string>(`user:${user}:accountHash`);

  if (!accountHash) {
    return NextResponse.json(null, { status: 404 });
  }

  await redis.json.del(`collection-log:${accountHash}`);

  return NextResponse.json({ success: true });
}
