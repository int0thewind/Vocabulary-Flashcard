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
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/**
 * Check whether string contains valid email address.
 *
 * @param str the string to check.
 * @returns true if the string has a valid email address
 */
export function validateEmail(str?: string | null): boolean {
  if (!str) return false;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(str);
}
