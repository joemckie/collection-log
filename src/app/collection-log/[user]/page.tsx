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
  Heading,
  ScrollArea,
  Separator,
  TabNav,
  Text,
} from '@radix-ui/themes';
import Link from 'next/link';
import { EntityImage } from '../components/entity-image';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ user: string }>;
  searchParams: Promise<{
    tab: CollectionLogTab;
    page:
      | RaidsTabEntry
      | BossesTabEntry
      | CluesTabEntry
      | MinigamesTabEntry
      | OtherTabEntry;
  }>;
}

function formatCurrentTabCountColour(
  currentTabObtained: number,
  currentTabTotal: number,
  inProgressColor: 'yellow' | 'orange',
) {
  if (currentTabObtained === currentTabTotal) {
    return 'green';
  }

  if (currentTabObtained === 0) {
    return 'red';
  }

  return inProgressColor;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { user } = await params;

  return {
    title: `Collection Log - ${user}`,
  };
}

export default async function CollectionLogPage({
  params,
  searchParams,
}: Props) {
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
        <TabNav.Root>
          {Object.keys(collectionLogPageMap).map((tab) => (
            <TabNav.Link asChild active={tab === currentTab} key={tab}>
              <Link href={`/collection-log/${user}?tab=${tab}`}>{tab}</Link>
            </TabNav.Link>
          ))}
        </TabNav.Root>
        <Flex gap="2">
          <Box asChild flexBasis="300px">
            <ScrollArea style={{ maxHeight: 700 }}>
              <NavigationMenu.Root
                defaultValue={currentPage}
                className="NavigationMenuRoot"
                orientation="vertical"
              >
                <NavigationMenu.List className="NavigationMenuList">
                  {collectionLogPageMap[currentTab].options.map((page) => {
                    const obtained = (
                      collectionLog.tabs[currentTab] as Record<
                        string,
                        CollectionLogTabContents
                      >
                    )[page].items.filter((item) => item.obtained).length;

                    const total = (
                      collectionLog.tabs[currentTab] as Record<
                        string,
                        CollectionLogTabContents
                      >
                    )[page].items.length;

                    const tabColor = formatCurrentTabCountColour(
                      obtained,
                      total,
                      'orange',
                    );

                    return (
                      <NavigationMenu.Item key={page} className="rt-TabNavItem">
                        <NavigationMenu.Link
                          asChild
                          active={page === currentPage}
                          className="rt-reset rt-BaseTabListTrigger rt-TabNavLink"
                        >
                          <Text color={tabColor}>
                            <Box asChild py="1">
                              <Link
                                href={`/collection-log/${user}?tab=${currentTab}&page=${page}`}
                              >
                                <Text color={tabColor}>{page}</Text>
                              </Link>
                            </Box>
                          </Text>
                        </NavigationMenu.Link>
                      </NavigationMenu.Item>
                    );
                  })}
                </NavigationMenu.List>
              </NavigationMenu.Root>
            </ScrollArea>
          </Box>
          <Flex flexBasis="100%" direction="column">
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
                        'yellow',
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
                <ScrollArea style={{ maxHeight: 700 }}>
                  <Grid columns="6" gap="6" pt="2">
                    {currentTabContents.items.map((item) => (
                      <Flex
                        key={item.id}
                        align="center"
                        direction="column"
                        gap="4"
                        justify="center"
                        style={{
                          opacity: item.quantity === 0 ? 0.5 : 1,
                        }}
                      >
                        <Box position="relative">
                          <EntityImage
                            alt={`${item.name} icon`}
                            src={formatWikiImageUrl(item.name)}
                            fallback="?"
                            size="3"
                          />
                          {item.quantity > 0 && (
                            <Box position="absolute" top="-12px" left="-12px">
                              <Text color="yellow" size="2" weight="medium">
                                {item.quantity}
                              </Text>
                            </Box>
                          )}
                        </Box>
                        <Text align="center" size="2">
                          {item.name}
                        </Text>
                      </Flex>
                    ))}
                  </Grid>
                </ScrollArea>
              </Grid>
            </Card>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
}
