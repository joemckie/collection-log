import { CollectionLog } from '@/schemas/collection-log.schema';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import type { UserEntity } from './user.entity';

@Entity('collection_log')
export class CollectionLogEntity {
  @PrimaryColumn('numeric')
  accountHash: string;

  @Column('jsonb')
  collectionLog: CollectionLog;

  @OneToOne('UserEntity')
  user: UserEntity;
}
