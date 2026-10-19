import type { ArtworkDetails } from './artwork.types';

/**
 * Curated details for each artwork, keyed by the id in artwork-files.generated.ts
 * ("<collection>/<slug of filename>").
 *
 * - alt: what is visible in the image. No invented meaning or locations.
 * - format: 'composite' pieces (diptychs, collages, bordered or captioned pieces) are never cropped.
 * - title: confirmed titles only. Filename-derived working titles are listed in notes and CONTENT_REVIEW.md.
 * - textId: pairing with Gary's numbered text (site-text.ts). Only within the same collection,
 *   and only where the filename number gives a clear match.
 * - transcript: text embedded in the artwork, transcribed from the full-resolution original.
 * - notes: internal only, never rendered.
 *
 * A new image without an entry still appears on the site (as a composite, with a generic alt
 * text and a console warning in development) — add an entry here to describe it properly.
 */
export const ARTWORK_DETAILS: Readonly<Record<string, ArtworkDetails>> = {
  // ─── Intro images (My Art → Beach Mandalas) ────────────────────────────────
  'intro-images/1-arrivaor': {
    format: 'single',
    alt: 'A beach at low tide under a pale sunrise sky. In the foreground a large circle is drawn in the wet sand, with lines radiating inward to a mound of golden-orange sand at its center; a trail of shells and more orange sand leads back toward the waves.',
    textId: 'intro-1',
    focal: '78% 80%',
    notes: 'Working title from filename: "arrivaor". Paired with statement 1 by number; statement 1 also reads as a general introduction to the mandalas.',
  },
  'intro-images/2-shivarhythm': {
    format: 'composite',
    alt: 'Two photographs side by side. Left: a curving, feathered design pressed into pale sand at the water’s edge. Right: a dark ring of sand around a circle drawn on the wet beach, with smaller circles and mounds beyond, and the word “shiva” in orange lettering.',
    textId: 'intro-2',
    notes: 'The word "shiva" is lettered on the right panel; it is included in the alt text. Working title from filename: "shivarhythm". Pairing with statement 2 ("rhythms of the beach") supported by number and filename.',
  },
  'intro-images/3-venusofrockaway': {
    format: 'composite',
    alt: 'Four photographs in a row of a design in dark and rust-colored sand on the wet beach as foam and seawater wash over it, with a line of handwritten text beneath the images.',
    textId: 'intro-3',
    transcript:
      'She enters the frey, body blazing hot and sizzling. Ocean waters cover her.  She takes flight, reminded that the earth was mother first.',
    notes: 'Working title from filename: "Venus of Rockaway" (implies a location; not shown until confirmed). Paired with statement 3 by number.',
  },
  'intro-images/4-closeopen': {
    format: 'composite',
    alt: 'Two photographs side by side. Left: a ring of pebbles on reflective wet sand with a sweep of golden sand in the foreground. Right: a curving track drawn in pale sand with patches of golden and dark sand.',
    textId: 'intro-4',
    notes: 'Working title from filename: "closeopen". Paired with statement 4 by number.',
  },
  'intro-images/5-arrival': {
    format: 'composite',
    alt: 'Two photographs side by side. Left: sunlight rippling through clear shallow water over pebbles as a small wave splashes in at the right. Right: lines drawn in dark wet sand curving around a mound of orange sand, with foam along the lower edge.',
    textId: 'intro-5',
    notes: 'Working title from filename: "arrival". Pairing with statement 5 (fast shutter speed, water) supported by number and the splash in the left panel.',
  },
  'intro-images/6-furry': {
    format: 'composite',
    alt: 'Two tall photographs side by side. Left: a dark, roughly circular sand design under a thin layer of water with patches of foam. Right: a dark sand design on the beach with the ocean and blue sky beyond and a pale curved line in the sand in the foreground.',
    textId: 'intro-6',
    notes: 'Working title from filename: "furry". Paired with statement 6 by number.',
  },
  'intro-images/7-intheout': {
    format: 'composite',
    alt: 'Four vertical panels: two black-and-white abstract drawings with gestural strokes at the outer edges, framing two photographs — a feathered pattern of ridges in wet sand leading toward the water, and a trail of shells and pebbles below a fan of golden sand.',
    textId: 'intro-7',
    notes: 'Working title from filename: "intheout". Pairing with statement 7 (drawings made within the Photoshop mask) supported by number and the drawn panels.',
  },

  // ─── Collage pieces (My Art → Collage Pieces) ──────────────────────────────
  'collage-pieces/magicofordinaryfaces': {
    format: 'composite',
    order: 1,
    alt: 'Five photographs in a row of mounds of sand shaped into face-like forms, ringed with pale sand and curving drawn lines, with surf at the top of some images.',
    notes: 'Working title from filename: "magic of ordinary faces".',
  },
  'collage-pieces/also-too-edit': {
    format: 'composite',
    order: 2,
    alt: 'Two photographs side by side in a gray frame, forming a near-mirrored pair: each shows a disc of orange sand set in a curving channel drawn in pale sand, with foam and shell fragments washing across dark wet sand.',
    notes: 'Working title from filename: "also too".',
  },
  'collage-pieces/happening': {
    format: 'composite',
    order: 3,
    alt: 'Four photographs stacked vertically: foam and shell fragments on wet sand, ripples over sand in shallow water, a dark patch in the sand under clear water, and a looping line drawn in sand near the waterline.',
    notes: 'Very tall piece (about 1:5). Working title from filename: "happening".',
  },
  'collage-pieces/belly-mold': {
    format: 'composite',
    order: 4,
    alt: 'Six photographs arranged on white: tall views of designs made with pebbles, golden sand and swirled lines on reflective wet sand at the shoreline, a close view of grooves in gray sand, and three close details of pebbles, shells and golden sand.',
    notes: 'Working title from filename: "belly mold".',
  },
  'collage-pieces/flower-it': {
    format: 'composite',
    order: 5,
    alt: 'Four photographs in a grid of a flower-like design and a winding line drawn in sand, as foamy waves wash in and gradually cover it.',
    notes: 'Working title from filename: "flower it". Used on the Home page, "A mark in the sand".',
  },
  'collage-pieces/havesomegreen': {
    format: 'composite',
    order: 6,
    alt: 'Three photographs of foamy seawater spreading over sand and seaweed, with a handwritten line of text beneath the images.',
    transcript:
      'She moved towards me in the middle of the night wearing a green dress. She covered me with her heart yet left before I could wake.  Her dissapearance has never been explained; and yet, I know exactly the feeling of her not being next to me..',
    notes: 'Working title from filename: "have some green".',
  },
  'collage-pieces/moving-about': {
    format: 'composite',
    order: 7,
    alt: 'Five photographs in a row of large swirling designs in sand, combining dark purple-gray sand, golden grains and long curving grooves, with a small cluster of stones and shells in the last image.',
    notes: 'Working title from filename: "moving about".',
  },
  'collage-pieces/dna': {
    format: 'composite',
    order: 8,
    alt: 'A wide view of beach sand with circles swirled into gray sand, streaks of orange sand, and a dense band of pebbles, shells and twigs running through the middle.',
    notes: 'Filename "DNA_ .png" (with a space). Appears to be several photographs blended into one panorama, so it is treated as a composite and never cropped.',
  },
  'collage-pieces/bathing': {
    format: 'composite',
    order: 9,
    alt: 'Four photographs in a row of dark sand patterns and shallow water on the beach, including a pale streak curving through wet sand, with three lines of italic text beneath the images.',
    transcript:
      'One could search into the cascading hills of far away terrain, dip into the heart of a river’s esturary, or fall over the granada of the most subtle bend of earth’s pelvic bones;\nonce more, one could kiss the moment when a woman reaches the mouth of her feeding young.\nOne could do even more...and not find, the ‘love that conquers all.’',
    notes: 'Working title from filename: "bathing".',
  },
  'collage-pieces/our-logan': {
    format: 'composite',
    order: 10,
    alt: 'Three photographs of large paw-print shapes outlined in the sand near the water’s edge, with a line of text beneath the images.',
    transcript: 'Homage to Logan: we would all be so lucky to have a friend to help guide one’s heart to the best of places.',
    notes: 'Working title from filename: "our Logan".',
  },

  // ─── Finding Reasons (Direct Photography) ──────────────────────────────────
  'finding-reasons/1': {
    format: 'composite',
    alt: 'Shells resting in fine gray sand marked with soft streaks and small holes: a glossy brown spiral shell beside a blue-striped fragment at the left, and a blue and white shell at the right. The photograph is set within a white border.',
    notes: 'Filename "1_.png". Presented with a white border, so treated as a finished piece.',
  },
  'finding-reasons/2': {
    format: 'composite',
    alt: 'A burst of orange sand scattered across smooth gray sand, with a curved groove at the left and faint footprints at the right.',
    notes: 'Filename "2_.png". A blended seam is visible near the left edge, so it is treated as a composite.',
  },
  'finding-reasons/4-connected': {
    format: 'single',
    alt: 'Two stones in smooth gray sand some distance apart — a pale yellow-orange stone at the left and a dark gray stone at the right — with streaks in the sand flowing between them.',
    focal: '4% 50%',
    notes: 'Working title from filename: "connected". No file numbered 3 was supplied in this folder.',
  },
  'finding-reasons/5-sandwalk2': {
    format: 'composite',
    alt: 'Footprints in pale gray sand: a blue stone and a deep footprint at the left, and two shallow bare footprints softened by water at the right.',
    notes: 'Working title from filename: "sandwalk2". Two photographs joined side by side.',
  },

  // ─── Lips (Wave Photography) ───────────────────────────────────────────────
  'lips/1a-splash-dragon-edit': {
    format: 'single',
    alt: 'A breaking wave seen up close against a blue sky with clouds, its clear water thrown up into twisting, splashing shapes and droplets.',
    textId: 'lips-1',
    focal: '55% 50%',
    notes: 'Working title from filename: "Splash dragon". Filename prefix "1a" (no 1b supplied). Pairing with poem 1 supported by number and "dragons" in the poem.',
  },
  'lips/2-buble-fish-edit': {
    format: 'single',
    alt: 'A clear, rounded bubble of water rising from the crest of a breaking wave, with deep blue water behind it.',
    textId: 'lips-2',
    focal: '50% 6%',
    notes: 'Working title from filename: "buble fish". Pairing with poem 2 ("transformed into a bubble") supported by number and content.',
  },
  'lips/3-bubbling-along': {
    format: 'single',
    alt: 'The lip of a green wave curling over, with clear splashes and a small bubble forming along its crest against a pale sky.',
    textId: 'lips-3',
    notes: 'Working title from filename: "bubbling along". Paired with poem 3 by number.',
  },
  'lips/4-segootadit': {
    format: 'single',
    alt: 'A low wave seen at water level, its crest frothing with bubbles and spray against a pale blue sky.',
    textId: 'lips-4',
    focal: '70% 50%',
    notes: 'Working title from filename: "segootadit". Paired with poem 4 by number. Used on the Home page, "The tide returns".',
  },
  'lips/5-bubblehat': {
    format: 'single',
    alt: 'A transparent bubble of water rising from a wave, in warm pink and coral tones.',
    textId: 'lips-5',
    focal: '50% 40%',
    notes: 'Working title from filename: "bubblehat". Pairing with poem 5 ("timeless sunset feel") supported by number and the warm color.',
  },
  'lips/6-crossdiviide': {
    format: 'single',
    alt: 'A gray-green wave breaking toward the camera, with clear curls of water, a bubble at the right and another wave behind it.',
    textId: 'lips-6',
    notes: 'Working title from filename: "crossdiviide". Paired with poem 6 by number.',
  },
  'lips/7-flavor': {
    format: 'single',
    alt: 'A small wave with a bubble-filled crest, lit by shafts of sunlight through green water, with blue water beyond.',
    textId: 'lips-7',
    notes: 'Working title from filename: "flavor". Paired with poem 7 by number.',
  },
  'lips/8-traveling': {
    format: 'single',
    alt: 'A wide, low view of a clear green wave with small peaks along its crest and a splash rising at the right, against blue water.',
    textId: 'lips-8',
    focal: '100% 50%',
    notes: 'Working title from filename: "traveling". Poem 8 is pending (client supplied only "…").',
  },
  'lips/9-howthiniswaterinthe-15thdimesnion': {
    format: 'single',
    alt: 'A wide view of a thin, clear wave crest with clusters of bubbles beneath it, in soft purple and gray-blue light.',
    textId: 'lips-9',
    notes: 'Working title from filename: "how thin is water in the 15th dimension". Pairing with poem 9 ("a different dimension") supported by number and filename.',
  },
  'lips/10-overthere': {
    format: 'single',
    alt: 'A dark gray-green wave at water level, with clear water spilling from its crest at the left and a splash at the right, under a pale sky.',
    textId: 'lips-10',
    notes: 'Working title from filename: "over there". Poem 10 is pending (client supplied only "…").',
  },
};
