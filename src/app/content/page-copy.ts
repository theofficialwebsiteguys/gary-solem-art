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
  /** Frame shape (width / height) for a cover crop. Defaults to the artwork's own shape. */
  ratio?: number;
}

/** Background of a Home section; each matches the opening of the page it leads to. */
export type Tone = 'ivory' | 'sand' | 'mist';

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
  /**
   * Each group of work appears once: title, image, phrase, then a line. `label` names the page
   * in "Continue exploring"; `title` is what Home shows above the image. The first group is
   * introduced by the section heading, so it has no title of its own.
   */
  explore: {
    heading: 'Explore the work',
    items: [
      {
        label: 'My Art',
        title: null,
        path: '/my-art',
        description: 'Beach mandalas are made with sand and the ocean tide’s rise and fall.',        image: { artworkId: 'intro-images/6-furry', fit: 'contain' },
        tone: 'ivory',
      },
      {
        label: 'Direct Photography',
        title: 'Direct Photography',
        path: '/direct-photography',
        description: 'Finding Reasons: quiet discoveries in the sand.',        image: { artworkId: 'finding-reasons/4-connected', fit: 'cover', focal: '4% 50%', ratio: 3 / 2 },
        tone: 'sand',
      },
      {
        label: 'Lips',
        title: 'Lips',
        path: '/lips',
        description: 'The crest of a wave, caught as it breaks.',        image: { artworkId: 'lips/2-buble-fish-edit', fit: 'contain' },
        tone: 'mist',
      },
    ] satisfies { label: string; title: string | null; path: string; description: string; image: FeatureImage; tone: Tone }[],
  },
  contact: {
    heading: 'Get in touch',
    body: 'To ask about Gary’s work, or to share your thoughts on it, please visit the contact page.',
    link: { label: 'Contact Me', path: '/contact-me' },
  },
} as const;

/*
 * Each collection page opens with the section that introduced it on Home. Gary's own words
 * carry the text from there, so nothing here restates them.
 */

export const MY_ART = {
  title: 'My Art',
  opening: {
    heading: 'A mark in the sand',
    image: { artworkId: 'collage-pieces/flower-it', fit: 'contain' } satisfies FeatureImage,
  },
  mandalas: {
    eyebrow: 'Introduction images',
    heading: 'Beach Mandalas',
    intro: 'Each photograph is paired with Gary’s own notes on how the mandalas are made.',
  },
  collages: {
    heading: 'Collage Pieces',
  },
} as const;

export const DIRECT_PHOTOGRAPHY = {
  title: 'Direct Photography',
  opening: {
    heading: 'Gary’s perspective',
    image: { artworkId: 'finding-reasons/5-sandwalk2', fit: 'contain' } satisfies FeatureImage,
    /**
     * Extension point: Gary may share a personal story about his connection to the beach.
     * No details have been supplied, so nothing is rendered while this is null. When the story
     * arrives, set it here as an array of paragraphs, e.g. ['First paragraph…', 'Second…'].
     */
    story: null as readonly string[] | null,
  },
} as const;

export const LIPS = {
  title: 'Lips',
  opening: {
    heading: 'The tide returns',
    image: { artworkId: 'lips/4-segootadit', fit: 'cover', focal: '70% 50%' } satisfies FeatureImage,
  },
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
  lips: 'Lips: photographs of the crest of a breaking wave by Gary Solem, paired with his short poems.',
  contact: 'Contact Gary Solem about his beach mandalas and photography.',
  notFound: 'This page could not be found on Gary Solem Art.',
} as const;
