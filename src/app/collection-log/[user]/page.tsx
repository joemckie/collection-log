import { redis } from '@/redis';
import {
  CollectionLog,
  collectionLogPageMap,
  CollectionLogTab,
} from '@/schemas/collection-log.schema';
import { Container, Flex, Heading, Separator, Tabs } from '@radix-ui/themes';
import { Metadata } from 'next';
import { CollectionLogCategory } from './components/collection-log-category';
import { Username } from '@/schemas/user.schema';

interface Props {
  params: Promise<{ user: Username }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { user } = await params;

  return {
    title: `Collection Log - ${user}`,
  };
}

export default async function UserCollectionLogPage({ params }: Props) {
  const { user } = await params;

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

  return (
    <Container>
      <Tabs.Root defaultValue={CollectionLogTab.enum.Bosses}>
        <Flex direction="column" gap="4">
          <Heading align="center">
            Collection Log - {collectionLog.uniqueObtained}/
            {collectionLog.uniqueItems}
          </Heading>
          <Separator size="4" />
          <Tabs.List>
            {Object.keys(collectionLogPageMap).map((tab) => (
              <Tabs.Trigger value={tab} key={tab}>
                {tab}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {Object.keys(collectionLogPageMap).map((tab) => (
            <Tabs.Content value={tab} key={tab}>
              <CollectionLogCategory
                collectionLog={collectionLog}
                currentTab={CollectionLogTab.parse(tab)}
              />
            </Tabs.Content>
          ))}
        </Flex>
      </Tabs.Root>
    </Container>
  );
}
