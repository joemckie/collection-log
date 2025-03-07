import { z } from 'zod';

const AccountType = z.enum([
  'Normal',
  'Ironman',
  'Ultimate_Ironman',
  'Hardcore_Ironman',
  'Group_Ironman',
  'Hardcore_Group_Ironman',
  'Unranked_Group_Ironman',
  'All',
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
