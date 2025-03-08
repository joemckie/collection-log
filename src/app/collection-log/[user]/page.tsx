import {
  CollectionLog,
  collectionLogPageMap,
  CollectionLogTab,
} from '@/schemas/collection-log.schema';
import { Container, Flex, Heading, Separator, Tabs } from '@radix-ui/themes';
import { CollectionLogCategory } from './components/collection-log-category';
import { Username } from '@/schemas/user.schema';
import { clientConstants } from '@/config/constants.client';

interface Props {
  params: Promise<{ user: Username }>;
}

export async function generateStaticParams() {
  return [];
}

async function fetchCollectionLog(user: Username) {
  'use cache';

  const response = await fetch(`${clientConstants.publicUrl}/api/collection-log/${user}`);

  if (response.status === 404) {
    throw new Error(`No collection log found for user ${user}`);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch collection log for user ${user}`);
  }

  return CollectionLog.parse(await response.json());
}

export default async function UserCollectionLogPage({ params }: Props) {
  const { user } = await params;
  const collectionLog = await fetchCollectionLog(user);

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
