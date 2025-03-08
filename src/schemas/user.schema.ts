import { z } from 'zod';

const AccountType = z.enum([
  'NORMAL',
  'IRONMAN',
  'ULTIMATE_IRONMAN',
  'HARDCORE_IRONMAN',
  'GROUP_IRONMAN',
  'HARDCORE_GROUP_IRONMAN',
  'UNRANKED_GROUP_IRONMAN',
  'ALL',
]);

export const User = z.object({
  username: z.string().min(1).max(12),
  accountType: AccountType,
  isFemale: z.boolean(),
  accountHash: z.string().min(1),
  userSettings: z.object({
    displayRank: AccountType,
    showQuantity: z.boolean(),
  }),
});
