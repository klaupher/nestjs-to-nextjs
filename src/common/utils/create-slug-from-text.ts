import { slugify } from './slugify';

export function CreateSlugFromText(text: string) {
  return slugify(text);
}
