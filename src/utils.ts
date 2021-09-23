export function getCSSVariable(name: string): string | undefined {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`);
}
