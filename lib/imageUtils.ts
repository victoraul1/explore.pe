import { IImage } from '@/models/Guide';

// Normalize images to the new format (with captions)
export function normalizeImages(images: (string | IImage)[] | undefined): IImage[] {
  if (!images) return [];
  
  return images.map(img => {
    if (typeof img === 'string') {
      return { url: img, caption: '' };
    }
    return img;
  });
}

// Get image URL from either string or object format
export function getImageUrl(image: string | IImage): string {
  if (typeof image === 'string') {
    return image;
  }
  return image.url;
}

// Get image caption from either string or object format
export function getImageCaption(image: string | IImage): string {
  if (typeof image === 'string') {
    return '';
  }
  return image.caption || '';
}