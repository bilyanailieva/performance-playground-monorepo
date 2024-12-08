const baseColors = [
  "#007ad9", // Primary color
  "#ff6f61", // Secondary color
  "#28a745", // Success color
  "#ffc107", // Warning color
  "#17a2b8", // Info color
  "#6610f2", // Purple accent
  "#dc3545", // Danger color
  "#2afa43", // Grey
];

export const generateColors = (cities: any[]) => {
  if (!cities.length) return [];
  const colors: string[] = [];
  const paletteSize = baseColors.length;

  cities.forEach((index: number) => {
    // Select base color
    const randIndex = Math.floor(index % paletteSize);
    let baseColor = baseColors[randIndex];
    let color = baseColor;
    if (randIndex >= baseColors.length) {
      // Apply slight variation based on the index
      let variation = Math.floor(index / paletteSize);
      color = adjustColor(baseColor, variation * 20);
    }

    if(color) {
      colors.push(color);
    }
  });

  return colors;
};

function adjustColor(color: string, amount: number) {
  // Remove the hash at the start if it's there
  let usePound = false;

  if (color.charAt(0) === "#") {
    color = color.slice(1);
    usePound = true;
  }

  // Convert the hex color to an integer
  let num = parseInt(color, 16);

  // Bitwise operation to extract and adjust the RGB components
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  // Clamp each component to the range [0, 255]
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  // Combine the adjusted RGB components back into a single hex color
  return (
    (usePound ? "#" : "") +
    ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")
  );
}
