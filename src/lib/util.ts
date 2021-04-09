/* eslint-disable import/prefer-default-export */
export function getNameInitial(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0].toLocaleUpperCase())
    .join('');
}
