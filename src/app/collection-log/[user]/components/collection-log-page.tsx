import { Box, Flex, Grid, ScrollArea, Separator, Text } from '@radix-ui/themes';
import { EntityImage } from '../../components/entity-image';
import { formatWikiImageUrl } from '@/app/utils/format-wiki-url';
import {
  CollectionLogTabContents,
  CollectionLogTabEntry,
} from '@/schemas/collection-log.schema';
import { formatCollectionLogIndicatorColor } from '@/app/utils/format-collection-log-indicator-color';

interface CollectionLogPageProps {
  title: CollectionLogTabEntry;
  obtained: number;
  total: number;
  page: CollectionLogTabContents;
}

export function CollectionLogPage({
  title,
  obtained,
  total,
  page,
}: CollectionLogPageProps) {
  return (
    <>
      <Flex direction="column">
        <Text size="4" weight="medium">
          {title}
        </Text>
        <Text>
          Obtained:{' '}
          <Text
            color={formatCollectionLogIndicatorColor(obtained, total, 'yellow')}
            weight="medium"
          >
            {obtained}/{total}
          </Text>
        </Text>
        {page.killCounts.map((killCount) => (
          <Text key={killCount.name}>
            {killCount.name}: <Text weight="medium">{killCount.amount}</Text>
          </Text>
        ))}
      </Flex>
      <Separator size="4" />
      <ScrollArea style={{ maxHeight: 700 }}>
        <Grid columns="6" gap="6" pt="2">
          {page.items.map((item) => (
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
    </>
  );
}
