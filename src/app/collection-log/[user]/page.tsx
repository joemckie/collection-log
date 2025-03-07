import { redis } from '@/redis';
import {
  CollectionLog,
  CollectionLogTab,
} from '@/schemas/collection-log.schema';
import { Container, Flex, TabNav } from '@radix-ui/themes';
import Link from 'next/link';

type Params = Promise<{ user: string }>;

type SearchParams = Promise<{ tab: CollectionLogTab; page: string}>;

export default async function CollectionLogPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { user } = await params;
  const { tab: currentTab = CollectionLogTab.enum.Raids, page = '' } = await searchParams;
  const collectionLog = await redis.json.get<CollectionLog>(
    `collection-log:${user}`,
  );

  if (!collectionLog) {
    throw new Error(`No collection log found for user ${user}`);
  }

  return (
    <Container>
      <>
        <TabNav.Root>
          {Object.keys(collectionLog.tabs).map((tab) => (
            <TabNav.Link asChild active={tab === currentTab} key={tab}>
              <Link href={`/collection-log/${user}?tab=${tab}`}>{tab}</Link>
            </TabNav.Link>
          ))}
        </TabNav.Root>
        <Flex>
          <TabNav.Root wrap="wrap">
            {Object.keys(collectionLog.tabs[currentTab]).map((page) => (
              <TabNav.Link asChild key={page}>
                <Link href={`/collection-log/${user}?tab=${currentTab}&page=${page}`}>{page}</Link>
              </TabNav.Link>
            ))}
          </TabNav.Root>
        </Flex>
      </>
    </Container>
  );
}
