import { collectionLogPageMap } from '@/schemas/collection-log.schema';
import { TabNav } from '@radix-ui/themes';
import Link from 'next/link';

interface CollectionLogCategoriesProps {
  currentTab: string;
  user: string;
}

export function CollectionLogCategories({
  currentTab,
  user,
}: CollectionLogCategoriesProps) {
  return (
    <TabNav.Root>
      {Object.keys(collectionLogPageMap).map((tab) => (
        <TabNav.Link asChild active={tab === currentTab} key={tab}>
          <Link href={`/collection-log/${user}?tab=${tab}`}>{tab}</Link>
        </TabNav.Link>
      ))}
    </TabNav.Root>
  );
}
