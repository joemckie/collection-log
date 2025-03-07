import { formatWikiImageUrl } from '@/app/utils/format-wiki-url';
import { redis } from '@/redis';
import {
  BossesTabEntry,
  CluesTabEntry,
  CollectionLog,
  collectionLogPageMap,
  CollectionLogTab,
  CollectionLogTabContents,
  MinigamesTabEntry,
  OtherTabEntry,
  RaidsTabEntry,
} from '@/schemas/collection-log.schema';
import {
  Box,
  Card,
  Container,
  Flex,
  Grid,
  Separator,
  TabNav,
  Text,
} from '@radix-ui/themes';
import Link from 'next/link';
import { EntityImage } from '../components/entity-image';

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

function formatCurrentTabCountColour(
  currentTabObtained: number,
  currentTabTotal: number,
) {
  if (currentTabObtained === currentTabTotal) {
    return 'green';
  }

  if (currentTabObtained === 0) {
    return 'red';
  }

  return 'yellow';
}

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

  const currentTabContents = CollectionLogTabContents.parse(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (collectionLog.tabs[currentTab] as any)[currentPage],
  );
  const currentTabObtained = currentTabContents.items.filter(
    (item) => item.obtained,
  ).length;
  const currentTabTotal = currentTabContents.items.length;

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
            <Grid gap="4">
              <Flex direction="column">
                <Text size="4" weight="medium">
                  {currentPage}
                </Text>
                <Text>
                  Obtained:{' '}
                  <Text
                    color={formatCurrentTabCountColour(
                      currentTabObtained,
                      currentTabTotal,
                    )}
                    weight="medium"
                  >
                    {currentTabObtained}/{currentTabTotal}
                  </Text>
                </Text>
                {currentTabContents.killCounts.map((killCount) => (
                  <Text key={killCount.name}>
                    {killCount.name}:{' '}
                    <Text weight="medium">{killCount.amount}</Text>
                  </Text>
                ))}
              </Flex>
              <Separator size="4" />
              <Grid columns="6" gap="4">
                {currentTabContents.items.map((item) => (
                  <Flex
                    key={item.id}
                    align="center"
                    direction="column"
                    gap="4"
                    justify="center"
                    position="relative"
                  >
                    <EntityImage
                      alt={`${item.name} icon`}
                      src={formatWikiImageUrl(item.name)}
                      fallback="?"
                    />
                    <Flex justify="between" gap="2">
                      <Text>{item.name}</Text>
                      {item.quantity > 0 && (
                        <Box position="absolute" top="0" left="0">
                          <Text color="yellow" size="2" weight="medium">
                            {item.quantity}
                          </Text>
                        </Box>
                      )}
                    </Flex>
                  </Flex>
                ))}
              </Grid>
            </Grid>
          </Card>
        </Flex>
      </>
    </Container>
  );
}
