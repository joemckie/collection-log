import {
  Box,
  Card,
  Flex,
  Grid,
  ScrollArea,
  Tabs,
  Text,
} from '@radix-ui/themes';
import {
  CollectionLog,
  collectionLogPageMap,
  CollectionLogTab,
  CollectionLogTabContents,
  CollectionLogTabEntry,
} from '@/schemas/collection-log.schema';
import { formatCollectionLogIndicatorColor } from '@/app/utils/format-collection-log-indicator-color';
import { CollectionLogPage } from './collection-log-page';

interface CollectionLogCategoryProps {
  currentTab: CollectionLogTab;
  collectionLog: CollectionLog;
}

export function CollectionLogCategory({
  collectionLog,
  currentTab,
}: CollectionLogCategoryProps) {
  return (
    <Tabs.Root
      defaultValue={collectionLogPageMap[currentTab].options[0]}
      orientation="vertical"
    >
      <Flex gap="4">
        <Box asChild flexBasis="300px">
          <Tabs.List>
            <ScrollArea style={{ maxHeight: 700 }}>
              {Object.keys(collectionLog.tabs[currentTab])
                .sort()
                .map((page) => {
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

                  const tabColor = formatCollectionLogIndicatorColor(
                    obtained,
                    total,
                    'orange',
                  );

                  return (
                    <Text color={tabColor} asChild key={page}>
                      <Tabs.Trigger value={page}>
                        <Text color={tabColor} weight="medium">{page}</Text>
                      </Tabs.Trigger>
                    </Text>
                  );
                })}
            </ScrollArea>
          </Tabs.List>
        </Box>
        <Flex flexBasis="100%" direction="column">
          <Card>
            <Grid gap="4">
              {Object.entries(
                collectionLog.tabs[CollectionLogTab.parse(currentTab)],
              ).map(([page, contents]) => (
                <Tabs.Content value={page} key={page}>
                  <CollectionLogPage
                    page={contents}
                    title={CollectionLogTabEntry.parse(page)}
                  />
                </Tabs.Content>
              ))}
            </Grid>
          </Card>
        </Flex>
      </Flex>
    </Tabs.Root>
  );
}
