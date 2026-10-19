import type { SourceText } from './artwork.types';

/**
 * Gary Solem's own words, exactly as supplied by the client.
 *
 * Do not "correct" wording, punctuation or line breaks here. Suggested typo fixes are
 * recorded in CONTENT_REVIEW.md for Gary to approve. Numbered statements belong only to
 * their own collection.
 */

// INTRODUCTION IMAGES — numbered statements, paired with intro-images 1–7.
export const INTRO_STATEMENTS: readonly SourceText[] = [
  {
    id: 'intro-1',
    collection: 'intro-images',
    number: 1,
    kind: 'statement',
    text: 'My mandalas – designs made on the beach with the sand and ocean tides – Some get swept away within 12 hours – the longest possible life span of a “beach mandala” - others scratch and fall within seconds as I make a line with a shell or spill a bucket of dry sand into a shape – only to get immediately swept away. All designs will return to their smooth state. This will happen without complaint nor desire to explain.',
  },
  {
    id: 'intro-2',
    collection: 'intro-images',
    number: 2,
    kind: 'statement',
    text: 'Designs are spontaneously generated and inspired by the rhythms of the beach on that given day.',
  },
  {
    id: 'intro-3',
    collection: 'intro-images',
    number: 3,
    kind: 'statement',
    text: 'In a watercolor painting colors vary in tone and saturation from varying degrees of water to pigment – the colors in these beach designs have different tones and levels of saturation for the same reason.',
  },
  {
    id: 'intro-4',
    collection: 'intro-images',
    number: 4,
    kind: 'statement',
    text: 'Some of these photos show art work on the sand; others show art work that is inseparable from the sand.',
  },
  {
    id: 'intro-5',
    collection: 'intro-images',
    number: 5,
    kind: 'statement',
    text: 'It is quite fun when a fast shutter speed allows one to catch water on the camera playing its role in the making of a mandala.',
  },
  {
    id: 'intro-6',
    collection: 'intro-images',
    number: 6,
    kind: 'statement',
    text: 'Rhythms of the ocean and beach remain the inspiration.',
  },
  {
    id: 'intro-7',
    collection: 'intro-images',
    number: 7,
    kind: 'statement',
    text: 'The process of editing photos within the mask in Photoshop produces drawings that echo the shapes and rhythms in the photo.',
  },
];

// COLLAGE PIECES — collection-level statement.
export const COLLAGE_STATEMENT: SourceText = {
  id: 'collage-statement',
  collection: 'collage-pieces',
  kind: 'statement',
  text: 'The forces of nature ebb and flow, and a sometimes I like more than one photograph to tell the story of that day at the beach.',
  notes:
    'Client production note (not public): "Some have text that is with the image – the others don\'t have text. For now."',
};

// FINDING REASONS — collection-level statement (Direct Photography).
export const FINDING_REASONS_STATEMENT: SourceText = {
  id: 'finding-reasons-statement',
  collection: 'finding-reasons',
  kind: 'statement',
  text: 'In being an artist, I don’t go to the beach to find inspiration. I go to the beach to feel human, and since I grew up on the beach in California, I will always find something interesting, even if it isn’t a mandala.',
};

// LIPS — definition plus numbered poems, paired with lips 1–10 (Wave Photography).
export const LIP_DEFINITION: SourceText = {
  id: 'lips-definition',
  collection: 'lips',
  kind: 'definition',
  text: 'A lip – term used by surfers for the crest of the wave as it is descending towards the water as a wave is breaking.',
};

export const LIP_POEMS: readonly SourceText[] = [
  {
    id: 'lips-1',
    collection: 'lips',
    number: 1,
    kind: 'poem',
    text: 'Electricity changes lanes inside our mind at synaptic junctures,\ndragons throw flames from their mouth, and waves collide.',
  },
  {
    id: 'lips-2',
    collection: 'lips',
    number: 2,
    kind: 'poem',
    text: 'At the right time, with a suitable size wave, with a soft enough wind,\nthe crest of a wave gets transformed into a bubble.',
  },
  {
    id: 'lips-3',
    collection: 'lips',
    number: 3,
    kind: 'poem',
    text: 'Bubbles take as many shapes as the heart can muster in the wake\nOf water touching the floor of the beach, the sand rises and\nAnd the waves crash to meet tender kisses.',
  },
  {
    id: 'lips-4',
    collection: 'lips',
    number: 4,
    kind: 'poem',
    text: 'Sometimes I wish that I were a wave, climbing – falling,\nnever giving up, always fluid, and always redefining\nthe self in just the right way.',
  },
  {
    id: 'lips-5',
    collection: 'lips',
    number: 5,
    kind: 'poem',
    text: 'This was a morning bubble, but I decided to give it\na timeless sunset feel - very ready to crash comfortably.',
  },
  {
    id: 'lips-6',
    collection: 'lips',
    number: 6,
    kind: 'poem',
    text: 'One of us is out of focus? And, you are so far away.',
  },
  {
    id: 'lips-7',
    collection: 'lips',
    number: 7,
    kind: 'poem',
    text: 'Rainbows are everywhere. We just can’t see them until light gets fractured.',
  },
  {
    id: 'lips-8',
    collection: 'lips',
    number: 8,
    kind: 'poem',
    text: null,
    notes: 'PENDING: client supplied only "…". Not a caption; the image is shown without text until copy arrives.',
  },
  {
    id: 'lips-9',
    collection: 'lips',
    number: 9,
    kind: 'poem',
    text: 'It must be a different dimension that brings energy from thousands of miles away. But, it really is just the right fetch of wind and the right marine conditions that does the trick.',
  },
  {
    id: 'lips-10',
    collection: 'lips',
    number: 10,
    kind: 'poem',
    text: null,
    notes: 'PENDING: client supplied only "…". Not a caption; the image is shown without text until copy arrives.',
  },
];

const ALL_TEXT: readonly SourceText[] = [
  ...INTRO_STATEMENTS,
  COLLAGE_STATEMENT,
  FINDING_REASONS_STATEMENT,
  LIP_DEFINITION,
  ...LIP_POEMS,
];

export function sourceText(id: string): SourceText | undefined {
  return ALL_TEXT.find((t) => t.id === id);
}

/** Short verbatim quotations used as pull quotes. Each is an exact excerpt of a passage above. */
export const QUOTES = {
  smoothState: 'All designs will return to their smooth state.',
  rhythms: 'Rhythms of the ocean and beach remain the inspiration.',
  feelHuman: 'I go to the beach to feel human.',
} as const;

export const ARTIST_NAME = 'Gary Solem';
