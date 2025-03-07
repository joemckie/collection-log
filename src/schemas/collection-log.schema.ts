import { z } from 'zod';

export const CollectionLogTab = z.enum([
  'Bosses',
  'Clues',
  'Minigames',
  'Other',
  'Raids',
]);

export type CollectionLogTab = z.infer<typeof CollectionLogTab>;

const RaidsTabEntry = z.enum([
  'Chambers of Xeric',
  'Theatre of Blood',
  'Tombs of Amascut',
]);

export type RaidsTabEntry = z.infer<typeof RaidsTabEntry>;

const BossesTabEntry = z.enum([
  'Abyssal Sire',
  'Alchemical Hydra',
  'Amoxliatl',
  'Araxxor',
  'Barrows Chests',
  'Bryophyta',
  'Callisto and Artio',
  'Cerberus',
  'Chaos Elemental',
  'Chaos Fanatic',
  'Commander Zilyana',
  'Corporeal Beast',
  'Crazy Archaeologist',
  'Dagannoth Kings',
  'Duke Sucellus',
  'Fortis Colosseum',
  'General Graardor',
  'Giant Mole',
  'Grotesque Guardians',
  'Hespori',
  'King Black Dragon',
  'Kalphite Queen',
  'Kraken',
  "Kree'arra",
  "K'ril Tsutsaroth",
  'Moons of Peril',
  'Nex',
  'Obor',
  'Phantom Muspah',
  'Royal Titans',
  'Sarachnis',
  'Scorpia',
  'Scurrius',
  'Skotizo',
  'Tempoross',
  'The Fight Caves',
  'The Gauntlet',
  'The Hueycoatl',
  'The Inferno',
  'The Leviathan',
  'The Nightmare',
  'The Whisperer',
  'Thermonuclear Smoke Devil',
  'Vardorvis',
  'Venenatis and Spindel',
  "Vet'ion and Calvar'ion",
  'Vorkath',
  'Wintertodt',
  'Zalcano',
  'Zulrah',
]);

export type BossesTabEntry = z.infer<typeof BossesTabEntry>;

const CluesTabEntry = z.enum([
  'Beginner Treasure Trails',
  'Easy Treasure Trails',
  'Elite Treasure Trails',
  'Elite Treasure Trails (Rare)',
  'Hard Treasure Trails',
  'Hard Treasure Trails (Rare)',
  'Master Treasure Trails',
  'Master Treasure Trails (Rare)',
  'Medium Treasure Trails',
  'Shared Treasure Trail Rewards',
]);

export type CluesTabEntry = z.infer<typeof CluesTabEntry>;

const MinigamesTabEntry = z.enum([
  'Barbarian Assault',
  'Brimhaven Agility Arena',
  'Castle Wars',
  'Fishing Trawler',
  "Giants' Foundry",
  'Gnome Restaurant',
  'Guardians of the Rift',
  'Hallowed Sepulchre',
  'Last Man Standing',
  'Magic Training Arena',
  'Mahogany Homes',
  'Mastering Mixology',
  'Pest Control',
  "Rogues' Den",
  "Shades of Mort'ton",
  'Soul Wars',
  'Temple Trekking',
  'Tithe Farm',
  'Trouble Brewing',
  'Volcanic Mine',
]);

export type MinigamesTabEntry = z.infer<typeof MinigamesTabEntry>;

const OtherTabEntry = z.enum([
  'Aerial Fishing',
  'All Pets',
  'Camdozaal',
  "Champion's Challenge",
  'Chompy Bird Hunting',
  'Colossal Wyrm Agility',
  'Creature Creation',
  'Cyclopes',
  'Elder Chaos Druids',
  'Fossil Island Notes',
  'Forestry',
  "Glough's Experiments",
  'Hunter Guild',
  'Miscellaneous',
  'Monkey Backpacks',
  'Motherlode Mine',
  'My Notes',
  'Random Events',
  'Revenants',
  'Rooftop Agility',
  'Shayzien Armour',
  'Shooting Stars',
  'Skilling Pets',
  'Slayer',
  'Tormented Demons',
  'TzHaar',
]);

export type OtherTabEntry = z.infer<typeof OtherTabEntry>;

export const CollectionLogTabContents = z.object({
  items: z
    .array(
      z.object({
        id: z.number().nonnegative(),
        name: z.string().min(1),
        quantity: z.number().nonnegative(),
        obtained: z.boolean(),
        sequence: z.number().nonnegative(),
      }),
    )
    .nonempty(),
  killCounts: z.array(
    z.object({
      name: z.string().min(1),
      amount: z.number().nonnegative(),
      sequence: z.number().nonnegative(),
    })
  ),
});

export type CollectionLogTabContents = z.infer<typeof CollectionLogTabContents>;

export const CollectionLog = z.object({
  totalObtained: z.number().nonnegative(),
  totalItems: z.number().nonnegative(),
  uniqueObtained: z.number().nonnegative(),
  uniqueItems: z.number().nonnegative(),
  tabs: z.object({
    [CollectionLogTab.enum.Raids]: z.record(
      RaidsTabEntry,
      CollectionLogTabContents,
    ),
    [CollectionLogTab.enum.Bosses]: z.record(
      BossesTabEntry,
      CollectionLogTabContents,
    ),
    [CollectionLogTab.enum.Clues]: z.record(
      CluesTabEntry,
      CollectionLogTabContents,
    ),
    [CollectionLogTab.enum.Minigames]: z.record(
      MinigamesTabEntry,
      CollectionLogTabContents,
    ),
    [CollectionLogTab.enum.Other]: z.record(
      OtherTabEntry,
      CollectionLogTabContents,
    ),
  }),
});

export type CollectionLog = z.infer<typeof CollectionLog>;

export const collectionLogPageMap = {
  [CollectionLogTab.enum.Raids]: RaidsTabEntry,
  [CollectionLogTab.enum.Bosses]: BossesTabEntry,
  [CollectionLogTab.enum.Clues]: CluesTabEntry,
  [CollectionLogTab.enum.Minigames]: MinigamesTabEntry,
  [CollectionLogTab.enum.Other]: OtherTabEntry,
};
