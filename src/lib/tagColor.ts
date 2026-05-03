function yiq(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/** Returns '#1a1a2e' or '#ffffff' — whichever reads better on top of the given hex colour. */
export function contrastText(hex: string): string {
  return yiq(hex) >= 145 ? '#1a1a2e' : '#ffffff';
}

/**
 * Adjusts a tag colour so it stays readable as text on the current surface.
 * - Dark mode: proportionally lightens colours that are too dark for a dark surface (yiq < 130)
 * - Light mode: proportionally darkens colours that are too light for a white surface (yiq > 185)
 */
export function adaptiveTagColor(hex: string, darkMode: boolean): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const br = yiq(hex);
  if (darkMode && br < 130) {
    const s = 130 / br;
    return `rgb(${Math.min(255, Math.round(r * s))} ${Math.min(255, Math.round(g * s))} ${Math.min(255, Math.round(b * s))})`;
  }
  if (!darkMode && br > 185) {
    const s = 185 / br;
    return `rgb(${Math.round(r * s)} ${Math.round(g * s)} ${Math.round(b * s)})`;
  }
  return hex;
}
