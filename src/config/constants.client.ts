import { z } from 'zod';

const ClientConfigSchema = z.object({
  publicUrl: z.string(),
  wiki: z.object({
    baseUrl: z.literal('https://oldschool.runescape.wiki'),
  }),
});

export const clientConstants = ClientConfigSchema.parse({
  publicUrl: process.env.NEXT_PUBLIC_URL,
  wiki: {
    baseUrl: 'https://oldschool.runescape.wiki',
  },
});
