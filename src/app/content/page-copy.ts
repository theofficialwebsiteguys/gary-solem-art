/**
 * Interface copy and featured-image choices for each page.
 *
 * Text here is editorial summary written for the site, grounded in Gary's statements. It is
 * never shown in quotation marks or attributed to Gary. His verbatim words live in site-text.ts.
 */

export interface HeroSlideConfig {
  artworkId: string;
  /** object-position for wide screens (image fills the hero behind the heading). */
  focal: string;
  /** object-position for phones (image sits below the heading at 4:3). */
  mobileFocal: string;
}

export interface FeatureImage {
  artworkId: string;
  /** 'cover' crops (single photographs only); 'contain' always shows the whole piece. */
  fit: 'cover' | 'contain';
  focal?: string;
}

export const HOME = {
  hero: {
    title: 'A day at the beach.',
    lead: 'Art, photography, and the rhythm of the tide.',
    // The first slide is the strongest single photograph of beach artwork. Only single
    // photographs are used here, because the hero crops to fill the screen.
    slides: [
      { artworkId: 'intro-images/1-arrivaor', focal: '50% 90%', mobileFocal: '80% 60%' },
      { artworkId: 'lips/1a-splash-dragon-edit', focal: '60% 55%', mobileFocal: '62% 50%' },
      { artworkId: 'lips/5-bubblehat', focal: '55% 45%', mobileFocal: '50% 40%' },
    ] satisfies HeroSlideConfig[],
  },
  explore: {
    heading: 'Explore the work',
    items: [
      {
        label: 'My Art',
        path: '/my-art',
        description: 'Beach mandalas and collages, made with sand and the ocean tides.',
        image: { artworkId: 'intro-images/6-furry', fit: 'contain' },
      },
      {
        label: 'Direct Photography',
        path: '/direct-photography',
        description: 'Finding Reasons: quiet discoveries in the sand.',
        image: { artworkId: 'finding-reasons/4-connected', fit: 'cover', focal: '4% 50%' },
      },
      {
        label: 'Wave Photography',
        path: '/wave-photography',
        description: 'Lips: the crest of a wave, caught as it breaks.',
        image: { artworkId: 'lips/2-buble-fish-edit', fit: 'cover', focal: '50% 6%' },
      },
    ] satisfies { label: string; path: string; description: string; image: FeatureImage }[],
  },
  markInTheSand: {
    marker: '01',
    heading: 'A mark in the sand',
    body: [
      'Gary’s mandalas are designs made on the beach with the sand and ocean tides. Some last up to twelve hours; others are swept away within seconds of a line drawn with a shell or a bucket of dry sand spilled into a shape.',
      'Each design is made spontaneously, inspired by the rhythms of the beach on that day.',
    ],
    link: { label: 'Explore My Art', path: '/my-art' },
    image: { artworkId: 'collage-pieces/flower-it', fit: 'contain' } satisfies FeatureImage,
  },
  tideReturns: {
    marker: '02',
    heading: 'The tide returns',
    body: [
      'In Wave Photography, Gary turns to the lip of the wave — the surfers’ word for the crest as it descends toward the water while the wave breaks. Most photographs are paired with a short poem of his own.',
    ],
    link: { label: 'Explore Wave Photography', path: '/wave-photography' },
    image: { artworkId: 'lips/4-segootadit', fit: 'cover', focal: '70% 50%' } satisfies FeatureImage,
  },
  perspective: {
    heading: 'Gary’s perspective',
    image: { artworkId: 'finding-reasons/5-sandwalk2', fit: 'contain' } satisfies FeatureImage,
    link: { label: 'Explore Direct Photography', path: '/direct-photography' },
    /**
     * Extension point: Gary may share a personal story about his connection to the beach.
     * No details have been supplied, so nothing is rendered while this is null. When the story
     * arrives, set it here as an array of paragraphs, e.g. ['First paragraph…', 'Second…'].
     */
    story: null as readonly string[] | null,
  },
  contact: {
    heading: 'Get in touch',
    body: 'To ask about Gary’s work, or to share your thoughts on it, please visit the contact page.',
    link: { label: 'Contact Me', path: '/contact-me' },
  },
} as const;

export const MY_ART = {
  title: 'My Art',
  lead: 'Beach mandalas are temporary designs made with sand and the ocean tides. Gary photographs them as they are made and as the water returns — sometimes in a single image, sometimes in collages of several photographs from the same day.',
  mandalas: {
    eyebrow: 'Introduction images',
    heading: 'Beach Mandalas',
    intro: 'Each photograph is paired with Gary’s own notes on how the mandalas are made.',
  },
  collages: {
    eyebrow: 'Collage pieces',
    heading: 'Collage Pieces',
  },
} as const;

export const DIRECT_PHOTOGRAPHY = {
  title: 'Direct Photography',
  eyebrow: 'Finding Reasons',
  lead: 'Quiet discoveries, details and observations from the sand.',
} as const;

export const WAVE_PHOTOGRAPHY = {
  title: 'Wave Photography',
  eyebrow: 'Lips',
  lead: 'Photographs of the lip of the wave in the moment it breaks, most of them paired with a short poem by Gary.',
} as const;

export const CONTACT_PAGE = {
  title: 'Contact Me',
  lead: 'Gary welcomes conversations about his work — the beach mandalas, the photographs, and the stories behind them.',
  pending: 'Contact details will be available here soon.',
  image: { artworkId: 'finding-reasons/1', fit: 'contain' } satisfies FeatureImage,
} as const;

export const NOT_FOUND = {
  title: 'This page has washed away',
  body: 'The page you were looking for isn’t here. It may have moved, or the link may be mistyped.',
} as const;

/** SEO descriptions per route. Factual; no credentials, awards or locations. */
export const META = {
  home: 'Gary Solem’s beach mandalas — temporary designs made with sand and the ocean tides — and his photography of the beach and its waves.',
  myArt: 'Beach mandalas and collages by Gary Solem: temporary designs made on the beach with sand and the ocean tides, photographed before the water returns.',
  direct: 'Finding Reasons: quiet discoveries and details from the beach, photographed by Gary Solem.',
  wave: 'Lips: photographs of the crest of a breaking wave by Gary Solem, paired with his short poems.',
  contact: 'Contact Gary Solem about his beach mandalas and photography.',
  notFound: 'This page could not be found on Gary Solem Art.',
} as const;
