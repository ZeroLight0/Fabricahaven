export function calculatePrice(yardsNeeded: number, pricePerYard: number): number {
  return Math.round(yardsNeeded * pricePerYard);
}

export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}
