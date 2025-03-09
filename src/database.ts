import 'server-only';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { serverConstants } from './config/constants.server';
import { UserEntity } from './entities/user.entity';
import { CollectionLogEntity } from './entities/collection-log.entity';

const BaseDataSource = new DataSource({
  type: 'postgres',
  url: serverConstants.postgres.databaseUrl,
  ssl: true,
  entities: [UserEntity, CollectionLogEntity],
  synchronize: true,
});

export const AppDataSource = await BaseDataSource.initialize();
