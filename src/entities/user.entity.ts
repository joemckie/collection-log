import { AccountType } from '@/schemas/user.schema';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import type { CollectionLogEntity } from './collection-log.entity';

@Entity('user')
export class UserEntity {
  @PrimaryColumn('numeric')
  accountHash: string;

  @Column()
  username: string;

  @Column('enum', {
    enum: AccountType.options,
  })
  accountType: AccountType;

  @Column()
  isFemale: boolean;

  @Column('enum', {
    enum: AccountType.options,
  })
  displayRank: AccountType;

  @Column()
  showQuantity: boolean;

  @OneToOne('CollectionLogEntity')
  @JoinColumn()
  collectionLog: CollectionLogEntity;
}
