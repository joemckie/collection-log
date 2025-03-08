import { CollectionLogTabEntry, BossesTabEntry,CluesTabEntry, CollectionLogTab, MinigamesTabEntry, OtherTabEntry, RaidsTabEntry, CollectionLogTabContents} from '@/schemas/collection-log.schema';

export function findPageCategory(page: CollectionLogTabEntry) {
  if (BossesTabEntry.safeParse(page).success) {
    return CollectionLogTab.enum.Bosses;
  }

  if (RaidsTabEntry.safeParse(page).success) {
    return CollectionLogTab.enum.Raids;
  }

  if (CluesTabEntry.safeParse(page).success) {
    return CollectionLogTab.enum.Clues;
  }

  if (MinigamesTabEntry.safeParse(page).success) {
    return CollectionLogTab.enum.Minigames;
  }

  if (OtherTabEntry.safeParse(page).success) {
    return CollectionLogTab.enum.Other;
  }

  throw new Error('Invalid page');
}
