import { NextRequest, NextResponse } from 'next/server';
import { CollectionLog } from '@/schemas/collection-log.schema';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { redis } from '@/redis';
import { AppDataSource } from '@/database';
import { CollectionLogEntity } from '@/entities/collection-log.entity';
import { UserEntity } from '@/entities/user.entity';

type Params = Promise<{ user: string }>;

export async function GET(
  _request: NextRequest,
  { params }: { params: Params },
) {
  async function getCollectionLog() {
    'use cache';

    const { user } = await params;

    const accountHash = await redis.get<string>(`user:${user}:account-hash`);

    if (!accountHash) {
      return null;
    }

    cacheTag('collection-log', accountHash);

    return redis.json.get<CollectionLog>(`collection-log:${accountHash}`);
  }

  const data = await getCollectionLog();

  if (!data) {
    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { user: accountHash } = await params;
  const data = CollectionLog.parse(await request.json());
  const collectionLogRepository =
    AppDataSource.getRepository(CollectionLogEntity);
  const userRepository = AppDataSource.getRepository(UserEntity);

  await userRepository.findOneOrFail({
    where: { accountHash },
  });

  const collectionLog = await collectionLogRepository.save({
    accountHash,
    collectionLog: data,
  });

  await userRepository.save({
    accountHash,
    collectionLog,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params },
) {
  const { user } = await params;
  const accountHash = await redis.get<string>(`user:${user}:account-hash`);

  if (!accountHash) {
    return NextResponse.json(null, { status: 404 });
  }

  await redis.json.del(`collection-log:${accountHash}`);

  return NextResponse.json({ success: true });
}
