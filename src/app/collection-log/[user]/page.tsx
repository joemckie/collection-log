import { redis } from '@/redis';
import {
  CollectionLog,
  collectionLogPageMap,
  CollectionLogTab,
  CollectionLogTabContents,
  CollectionLogTabEntry,
} from '@/schemas/collection-log.schema';
import {
  Box,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  ScrollArea,
  Separator,
} from '@radix-ui/themes';
import { Metadata } from 'next';
import { CollectionLogPage } from './components/collection-log-page';
import { CollectionLogCategories } from './components/collection-log-categories';
import { CollectionLogPageList } from './components/collection-log-page-list';
import { Username } from '@/schemas/user.schema';

interface Props {
  params: Promise<{ user: Username }>;
  searchParams: Promise<{
    tab: CollectionLogTab;
    page: CollectionLogTabEntry;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { user } = await params;

  return {
    title: `Collection Log - ${user}`,
  };
}

export default async function UserCollectionLogPage({
  params,
  searchParams,
}: Props) {
  const { user } = await params;
  const {
    tab: currentTab = CollectionLogTab.enum.Bosses,
    page: currentPage = collectionLogPageMap[currentTab].options[0],
  } = await searchParams;

  const accountHash = await redis.get<string>(`user:${user}:account-hash`);

  if (!accountHash) {
    throw new Error(`No account hash found for user ${user}`);
  }

  const collectionLog = await redis.json.get<CollectionLog>(
    `collection-log:${accountHash}`,
  );

  if (!collectionLog) {
    throw new Error(`No collection log found for user ${user}`);
  }

  const currentTabContents = (
    collectionLog.tabs[currentTab] as Record<string, CollectionLogTabContents>
  )[currentPage];

  const currentTabObtained = currentTabContents.items.filter(
    (item) => item.obtained,
  ).length;

  const currentTabTotal = currentTabContents.items.length;

  return (
    <Container>
      <Flex direction="column" gap="4">
        <Heading align="center">
          Collection Log - {collectionLog.uniqueObtained}/
          {collectionLog.uniqueItems}
        </Heading>
        <Separator size="4" />
        <CollectionLogCategories user={user} currentTab={currentTab} />
        <Flex gap="4">
          <Box asChild flexBasis="300px">
            <ScrollArea style={{ maxHeight: 700 }}>
              <CollectionLogPageList
                collectionLog={collectionLog}
                currentPage={currentPage}
                currentTab={currentTab}
                user={user}
              />
            </ScrollArea>
          </Box>
          <Flex flexBasis="100%" direction="column">
            <Card>
              <Grid gap="4">
                <CollectionLogPage
                  obtained={currentTabObtained}
                  page={currentTabContents}
                  title={currentPage}
                  total={currentTabTotal}
                />
              </Grid>
            </Card>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
}
