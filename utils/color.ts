const GOLDEN_ANGLE = 137.508;

export function nextHue(startingHue: number, i: number) {
  return (startingHue + i * GOLDEN_ANGLE) % 360;
}

type HSLOptions = {
  startingHue?: number;
  saturation?: string | number;
  lightness?: string | number;
};

export function nextHSL(i: number, options: HSLOptions = {}) {
  const { startingHue = 0, saturation = "75%", lightness = "50%" } = options;

  return `hsl(${nextHue(startingHue, i)}, ${saturation}, ${lightness})`;
}
