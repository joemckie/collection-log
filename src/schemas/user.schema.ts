import { z } from 'zod';

export const AccountType = z.enum([
  'NORMAL',
  'IRONMAN',
  'ULTIMATE_IRONMAN',
  'HARDCORE_IRONMAN',
  'GROUP_IRONMAN',
  'HARDCORE_GROUP_IRONMAN',
  'UNRANKED_GROUP_IRONMAN',
  'ALL',
]);

export type AccountType = z.infer<typeof AccountType>;

export const Username = z.string().min(1).max(12);

export type Username = z.infer<typeof Username>;

export const User = z.object({
  accountHash: z.string().min(1),
  accountType: AccountType,
  isFemale: z.boolean(),
  username: Username,
  userSettings: z.object({
    displayRank: AccountType,
    showQuantity: z.boolean(),
  }),
});
