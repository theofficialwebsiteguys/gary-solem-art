import { isDevMode } from '@angular/core';
import { ARTWORK_DETAILS } from './artwork-details';
import { ARTWORK_FILES } from './artwork-files.generated';
import type { Artwork, ArtworkFile, CollectionId, CollectionInfo } from './artwork.types';
import { sourceText } from './site-text';

export const COLLECTIONS: Readonly<Record<CollectionId, CollectionInfo>> = {
  'intro-images': { id: 'intro-images', label: 'Beach Mandalas', route: '/my-art', anchor: 'beach-mandalas' },
  'collage-pieces': { id: 'collage-pieces', label: 'Collage Pieces', route: '/my-art', anchor: 'collage-pieces' },
  'finding-reasons': { id: 'finding-reasons', label: 'Finding Reasons', route: '/direct-photography', anchor: 'finding-reasons' },
  lips: { id: 'lips', label: 'Lips', route: '/wave-photography', anchor: 'lips' },
};

function toArtwork(file: ArtworkFile): Artwork {
  const details = ARTWORK_DETAILS[file.id];
  if (!details && isDevMode()) {
    console.warn(`[artworks] No curated details for "${file.id}". Add an entry to artwork-details.ts.`);
  }
  const curated = details ?? {
    // Safe defaults for a newly added file: never cropped, generic description.
    format: 'composite' as const,
    alt: `Artwork by Gary Solem from the ${COLLECTIONS[file.collection].label} collection.`,
  };
  const paired = curated.textId ? sourceText(curated.textId) : undefined;
  if (paired && paired.collection !== file.collection) {
    throw new Error(`[artworks] ${file.id} is paired with text from another collection (${paired.id}).`);
  }
  return {
    ...file,
    ...curated,
    ratio: file.width / file.height,
    text: paired?.text ? paired : null,
  };
}

const LAST = Number.MAX_SAFE_INTEGER;

/** Curated order first, then the filename's numeric prefix, then the filename itself. */
function compare(a: Artwork, b: Artwork): number {
  const byOrder = (a.order ?? LAST) - (b.order ?? LAST);
  if (byOrder !== 0) return byOrder;
  const bySequence = (a.sequence ?? LAST) - (b.sequence ?? LAST);
  if (bySequence !== 0) return bySequence;
  return a.fileName.localeCompare(b.fileName, 'en', { numeric: true });
}

export const ARTWORKS: readonly Artwork[] = ARTWORK_FILES.map(toArtwork);

export function artworksIn(collection: CollectionId): readonly Artwork[] {
  return ARTWORKS.filter((a) => a.collection === collection).sort(compare);
}

/** Looks up an artwork by id. Returns undefined if the file has been removed. */
export function artworkById(id: string): Artwork | undefined {
  const found = ARTWORKS.find((a) => a.id === id);
  if (!found && isDevMode()) console.warn(`[artworks] Featured artwork "${id}" was not found.`);
  return found;
}

export function canCrop(artwork: Artwork): boolean {
  return artwork.format === 'single';
}
