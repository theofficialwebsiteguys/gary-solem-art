/**
 * Gary's contact details and form configuration.
 *
 * Fill in ONLY verified values supplied by Gary. While everything is null the Contact Me page
 * shows "Contact details will be available here soon." and no form is rendered.
 *
 * formEndpoint: a URL that accepts a POST with a JSON body { name, email, message } and returns
 * a 2xx status on success (for example a Formspree form URL, or your own serverless function).
 * See README.md → "Contact details and form".
 */
export interface ContactConfig {
  email: string | null;
  phone: string | null;
  formEndpoint: string | null;
}

export const CONTACT: ContactConfig = {
  email: null,
  phone: null,
  formEndpoint: null,
};

export function hasContactMethod(config: ContactConfig = CONTACT): boolean {
  return Boolean(config.email || config.phone || config.formEndpoint);
}
