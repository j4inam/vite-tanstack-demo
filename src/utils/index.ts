import { DogSearchParams } from '@/hooks/Dogs';

export const parseSearchParams = (url?: string): DogSearchParams => {
  if (!url) {
    return {};
  }

  const searchParams = new URLSearchParams(url.split('?')[1]);

  // Get all breeds params (handles breeds[0], breeds[1], etc.)
  const breeds: string[] = [];
  searchParams.forEach((value, key) => {
    if (key.startsWith('breeds[')) {
      breeds.push(decodeURIComponent(value));
    }
  });

  // Get from and size params
  const from = searchParams.get('from');
  const size = searchParams.get('size');
  const sort = searchParams.get('sort');

  return {
    breeds,
    from: from ? parseInt(from) : undefined,
    size: size ? parseInt(size) : undefined,
    sort: sort || undefined
  };
};
