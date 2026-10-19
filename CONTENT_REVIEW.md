# Content review — for Gary to confirm

Nothing in this file appears on the website. It records the decisions made while building the site, so Gary can confirm or correct them. Each item points to the file to change.

## 1. Missing or pending content

| Item | Status | Where to fix |
| --- | --- | --- |
| Contact email, phone or form endpoint | **None supplied — launch blocker.** The Contact Me page says "Contact details will be available here soon." | `src/app/content/contact.config.ts` |
| Lips poem 8 (`8.traveling.png`) | Supplied as "…" only. The photograph is shown without text. | `LIP_POEMS` in `src/app/content/site-text.ts` |
| Lips poem 10 (`10.overthere.png`) | Supplied as "…" only. The photograph is shown without text. | same |
| Finding Reasons image 3 | The folder has files numbered 1, 2, 4 and 5. No file 3 was supplied. Was one left out? | add the file to `public/assets/finding-reasons/` |
| Gary's personal story about the beach | Mentioned as a possibility; no details supplied. Nothing is shown. | `HOME.perspective.story` in `src/app/content/page-copy.ts` |
| Artwork titles | None confirmed, so none are shown. Working titles from filenames are listed in section 4. | `title` in `src/app/content/artwork-details.ts` |
| Collage texts | Gary's note: "Some have text that is with the image – the others don't have text. For now." More texts may follow. | `transcript` or `textId` in `artwork-details.ts` |
| Approved light mockup | It wasn't included in the build conversation, so the site follows the written brief. Please compare the Home page with the mockup. | — |

## 2. Image ↔ text pairings

Text is paired only within its own folder, and only where the filename number matches the number of Gary's statement or poem.

### Introduction images (My Art → Beach Mandalas)

| # | File | Paired with | Confidence |
| --- | --- | --- | --- |
| 1 | `1.arrivaor.png` | Statement 1 ("My mandalas – designs made on the beach…") | Number match. Statement 1 also reads as a general introduction; please confirm it belongs with this image. |
| 2 | `2.shivarhythm.png` | Statement 2 ("…inspired by the rhythms of the beach…") | Strong: number, plus "rhythm" in the filename |
| 3 | `3.VenusofRockaway.png` | Statement 3 (watercolor, tone and saturation) | Number match |
| 4 | `4.closeopen.png` | Statement 4 (art work on / inseparable from the sand) | Number match |
| 5 | `5.arrival.png` | Statement 5 (fast shutter speed, water) | Strong: number, plus the splash caught in the left panel |
| 6 | `6.furry.png` | Statement 6 ("Rhythms of the ocean and beach remain the inspiration.") | Number match |
| 7 | `7.intheout.png` | Statement 7 (editing within the mask in Photoshop) | Strong: number, plus the drawn mask panels |

### Lips (Wave Photography)

| # | File | Paired with | Confidence |
| --- | --- | --- | --- |
| 1 | `1a.Splash dragon-Edit.png` | Poem 1 | Strong: "dragons" in the poem and filename. Prefix is "1a"; there is no "1b". |
| 2 | `2. buble fish-Edit.png` | Poem 2 | Strong: "transformed into a bubble" |
| 3 | `3. bubbling along.png` | Poem 3 | Number match, plus bubbles |
| 4 | `4. segootadit.png` | Poem 4 | Number match |
| 5 | `5. bubblehat.png` | Poem 5 | Strong: "a timeless sunset feel" matches the warm pink color |
| 6 | `6. crossdiviide.png` | Poem 6 | Number match |
| 7 | `7. flavor.png` | Poem 7 | Number match |
| 8 | `8.traveling.png` | Poem 8 — **pending** | — |
| 9 | `9. howthiniswaterinthe 15thdimesnion.png` | Poem 9 | Strong: "a different dimension" in the poem and filename |
| 10 | `10.overthere.png` | Poem 10 — **pending** | — |

Collage Pieces and Finding Reasons each have one collection-level statement. It is shown at the top of that section, not under individual images.

## 3. Text inside the artworks

These transcripts were read from the full-resolution originals. They appear under each piece and in the viewer, using the artwork's own spelling.

- **3.VenusofRockaway** — "She enters the frey, body blazing hot and sizzling. Ocean waters cover her. She takes flight, reminded that the earth was mother first."
- **bathing** — "One could search into the cascading hills of far away terrain, dip into the heart of a river's esturary, or fall over the granada of the most subtle bend of earth's pelvic bones; / once more, one could kiss the moment when a woman reaches the mouth of her feeding young. / One could do even more...and not find, the 'love that conquers all.'"
- **havesomegreen** — "She moved towards me in the middle of the night wearing a green dress. She covered me with her heart yet left before I could wake. Her dissapearance has never been explained; and yet, I know exactly the feeling of her not being next to me.."
- **our-Logan** — "Homage to Logan: we would all be so lucky to have a friend to help guide one's heart to the best of places."
- **2.shivarhythm** — the single word "shiva" is lettered on the right panel. It is included in the image description rather than shown as a transcript.

## 4. Suggested corrections (not applied)

Gary's text is used exactly as supplied. These are suggestions only.

**Supplied text** (`site-text.ts`):
- Collage statement: "and **a** sometimes I like more than one photograph" → "and sometimes I like…"
- Lips poem 3: "in the wake / **Of** water" → "of water"; "the sand rises **and / And** the waves crash" — "and" appears twice.
- Intro statement 1: dash styles are mixed ("– Some", "“beach mandala” - others"). Consider using en dashes throughout and a lowercase "some".
- Intro statement 4: "art work" → "artwork" (optional, a matter of style).

**Text inside the artworks** (needs a re-export of the image, so it is not changed on the site):
- Venus of Rockaway: "frey" → "fray"
- bathing: "esturary" → "estuary"; "granada" — please check the intended word
- havesomegreen: "dissapearance" → "disappearance"; "me.." ends with two periods

**Working titles from filenames** (not shown on the site until confirmed): arrivaor, shivarhythm, Venus of Rockaway (this names a place, so it is held back until confirmed), closeopen, arrival, furry, intheout; also too, bathing, belly mold, DNA, flower it, happening, have some green, magic of ordinary faces, moving about, our Logan; connected, sandwalk; Splash dragon, buble fish, bubbling along, segootadit, bubblehat, crossdiviide, flavor, traveling, how thin is water in the 15th dimension, over there.

## 5. Other decisions to review

- **Cropping.** Every collage, diptych, bordered or captioned piece is always shown whole. Only single photographs are ever cropped, and only for the Home hero, the Explore links, "The tide returns" band and the social sharing image. `2_.png` and `DNA_ .png` show blended seams, so they are treated as composites.
- **Image descriptions (alt text)** describe only what is visible. Please check them in `artwork-details.ts`, especially where Gary might name things differently.
- **Interface copy** (short introductions such as "Quiet discoveries, details and observations from the sand.") is editorial summary, never presented as a quotation. It is all in `page-copy.ts` for Gary to edit.
- **Hero selection**: `1.arrivaor` (first slide), `1a.Splash dragon`, `5. bubblehat`.
