/* eslint-disable import/prefer-default-export */
/**
 * Extract a name's capitalized initial letter of each sub-words.
 * @example
 * // returns I
 * getNameInitial('Ian')
 * // returns KA
 * getNameInitial('Ken Adam')
 * // returns ZK
 * getNameInitial('Zsfljk K32lksnd')
 * // returns ''
 * getNameInitial(null)
 *
 * @param name the name to get initials
 * @returns a
 */
export function getNameInitial(name?: string | null): string {
  if (!name) return '';
  return name.split(' ').map((s) => s[0]).join('').toLocaleUpperCase();
}

/**
 * Check whether string contains valid email address.
 *
 * @param str the string to check.
 * @returns true if the string has a valid email address
 */
export function validateEmailAddress(str?: string | null): boolean {
  if (!str) return false;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(str);
}

/**
 * Parse a query of multiple words to a trimmed string array.
 *
 * @param query the series of words.
 * @returns a parsed string array.
 */
export function parseMultipleWords(query?: string | null): string[] {
  if (!query) return [];
  return query.split(',').map((s) => s.trim());
}
