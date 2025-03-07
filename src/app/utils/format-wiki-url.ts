import { clientConstants } from '@/config/constants.client';

export const formatWikiImageUrl = (entityName: string) => {
  const imageName = encodeURIComponent(entityName.replaceAll(' ', '_'));
  const size = 64;

  return `${clientConstants.wiki.baseUrl}/images/thumb/${imageName}.png/${size}px-${imageName}.png`;
};
