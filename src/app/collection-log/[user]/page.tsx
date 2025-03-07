import { redis } from '@/redis';
import {
  BossesTabEntry,
  CluesTabEntry,
  CollectionLog,
  collectionLogPageMap,
  CollectionLogTab,
  MinigamesTabEntry,
  OtherTabEntry,
  RaidsTabEntry,
} from '@/schemas/collection-log.schema';
import { Card, Container, Flex, TabNav } from '@radix-ui/themes';
import Link from 'next/link';

type Params = Promise<{ user: string }>;

type SearchParams = Promise<{
  tab: CollectionLogTab;
  page:
    | RaidsTabEntry
    | BossesTabEntry
    | CluesTabEntry
    | MinigamesTabEntry
    | OtherTabEntry;
}>;

export default async function CollectionLogPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { user } = await params;
  const {
    tab: currentTab = CollectionLogTab.enum.Raids,
    page: currentPage = collectionLogPageMap[currentTab].options[0],
  } = await searchParams;
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
          {Object.keys(collectionLogPageMap).map((tab) => (
            <TabNav.Link asChild active={tab === currentTab} key={tab}>
              <Link href={`/collection-log/${user}?tab=${tab}`}>{tab}</Link>
            </TabNav.Link>
          ))}
        </TabNav.Root>
        <Flex direction="column" gap="2">
          <TabNav.Root wrap="wrap">
            {collectionLogPageMap[currentTab].options.map((page) => (
              <TabNav.Link asChild active={page === currentPage} key={page}>
                <Link
                  href={`/collection-log/${user}?tab=${currentTab}&page=${page}`}
                >
                  {page}
                </Link>
              </TabNav.Link>
            ))}
          </TabNav.Root>
          <Card>
            {/* @ts-expect-error dev */}
            <pre>{JSON.stringify(collectionLog.tabs[currentTab][currentPage], null, 2)}</pre>
          </Card>
        </Flex>
      </>
    </Container>
  );
}
