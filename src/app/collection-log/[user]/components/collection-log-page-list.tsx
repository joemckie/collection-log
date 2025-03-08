import { Box, Flex, Text } from '@radix-ui/themes';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import {
  CollectionLog,
  collectionLogPageMap,
  CollectionLogTab,
  CollectionLogTabContents,
} from '@/schemas/collection-log.schema';
import Link from 'next/link';
import { formatCollectionLogIndicatorColor } from '@/app/utils/format-collection-log-indicator-color';

interface CollectionLogPageListProps {
  currentTab: CollectionLogTab;
  currentPage: string;
  user: string;
  collectionLog: CollectionLog;
}

export function CollectionLogPageList({
  collectionLog,
  currentPage,
  currentTab,
  user,
}: CollectionLogPageListProps) {
  return (
    <NavigationMenu.Root orientation="vertical">
      <NavigationMenu.List>
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

          const tabColor = formatCollectionLogIndicatorColor(
            obtained,
            total,
            'orange',
          );

          return (
            <NavigationMenu.Item key={page} className="rt-TabNavItem">
              <Box asChild display="block" width="100%">
                <NavigationMenu.Link
                  asChild
                  active={page === currentPage}
                  className="rt-reset rt-BaseTabListTrigger rt-TabNavLink"
                >
                  <Text align="left" color={tabColor}>
                    <Box asChild py="1">
                      <Link
                        href={`/collection-log/${user}?tab=${currentTab}&page=${page}`}
                      >
                        <Flex asChild justify="start" width="100%">
                          <Text
                            align="left"
                            as="span"
                            color={tabColor}
                            className="rt-BaseTabListTriggerInner rt-TabNavLinkInner"
                          >
                            {page}
                          </Text>
                        </Flex>
                        <Text
                          as="span"
                          className="rt-BaseTabListTriggerInnerHidden rt-TabNavLinkInnerHidden"
                        >
                          {page}
                        </Text>
                      </Link>
                    </Box>
                  </Text>
                </NavigationMenu.Link>
              </Box>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
