'use server';

import { User } from '@/schemas/user.schema';
import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { UserEntity } from '@/entities/user.entity';
import { AppDataSource } from '@/database';

export async function POST(request: NextRequest) {
  const { userSettings, ...data } = User.parse(await request.json());
  const userRepository = AppDataSource.getRepository(UserEntity);

  try {
    await userRepository.upsert(
      {
        ...data,
        displayRank: userSettings.displayRank,
        showQuantity: userSettings.showQuantity,
      },
      ['accountHash'],
    );
  } catch (e) {
    Sentry.captureException(e);

    return NextResponse.json(null, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
