import { clientConstants } from '@/config/constants.client';

export const formatWikiImageUrl = (entityName: string) => {
  const imageName = encodeURIComponent(entityName.replaceAll(' ', '_'));
  const size = 80; // Request 2x the size to ensure high quality on retina displays

  return `${clientConstants.wiki.baseUrl}/images/thumb/${imageName}.png/${size}px-${imageName}.png`;
};
