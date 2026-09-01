/**
 * Helper utility for scaling recipe ingredient quantities, estimated cost, and calories.
 */

// Converts decimal numbers to user-friendly fraction representations if applicable
function formatQuantityNumber(val: number): string {
  if (isNaN(val) || val <= 0) return '0';

  // Round very close numbers
  const rounded = Math.round(val * 100) / 100;

  // Check for whole numbers
  if (Math.abs(rounded - Math.round(rounded)) < 0.05) {
    return Math.round(rounded).toLocaleString();
  }

  // Common fractions
  const wholePart = Math.floor(rounded);
  const remainder = rounded - wholePart;

  let fractionStr = '';
  if (Math.abs(remainder - 0.25) < 0.08) fractionStr = '1/4';
  else if (Math.abs(remainder - 0.33) < 0.08) fractionStr = '1/3';
  else if (Math.abs(remainder - 0.5) < 0.08) fractionStr = '1/2';
  else if (Math.abs(remainder - 0.67) < 0.08) fractionStr = '2/3';
  else if (Math.abs(remainder - 0.75) < 0.08) fractionStr = '3/4';

  if (fractionStr) {
    return wholePart > 0 ? `${wholePart} ${fractionStr}` : fractionStr;
  }

  // Fallback to max 1 decimal place
  return (Math.round(rounded * 10) / 10).toString();
}

/**
 * Parses and scales a single ingredient string
 * e.g., "Yam (3-4 round slices)" -> "Yam (6-8 round slices)"
 * e.g., "3 Eggs" -> "6 Eggs"
 * e.g., "1/2 cup Vegetable Oil" -> "1 cup Vegetable Oil"
 */
export function scaleIngredientQuantity(ingredient: string, factor: number): string {
  if (factor === 1 || !ingredient) return ingredient;

  // 1. Check for fraction patterns like "1/2", "3/4", "1 1/2"
  let processed = ingredient.replace(/(\d+)\s+(\d+)\/(\d+)/g, (_, whole, num, den) => {
    const val = parseFloat(whole) + parseFloat(num) / parseFloat(den);
    return formatQuantityNumber(val * factor);
  });

  processed = processed.replace(/(\d+)\/(\d+)/g, (_, num, den) => {
    const val = parseFloat(num) / parseFloat(den);
    return formatQuantityNumber(val * factor);
  });

  // 2. Check for ranges like "3-4" or "3 - 4"
  processed = processed.replace(/(\d+(?:\.\d+)?)\s*[-–—]\s*(\d+(?:\.\d+)?)/g, (_, minStr, maxStr) => {
    const minVal = parseFloat(minStr) * factor;
    const maxVal = parseFloat(maxStr) * factor;
    return `${formatQuantityNumber(minVal)} - ${formatQuantityNumber(maxVal)}`;
  });

  // 3. Match remaining numeric quantities like "3 Eggs", "500g Tomato", "2.5 tbsp"
  // Avoid replacing digits embedded in numbers already formatted or inside brackets without context
  processed = processed.replace(/(\b\d+(?:\.\d+)?)\b/g, (match) => {
    // Check if it's a standalone number that hasn't been handled
    const val = parseFloat(match);
    if (!isNaN(val) && val > 0) {
      return formatQuantityNumber(val * factor);
    }
    return match;
  });

  return processed;
}

/**
 * Scale estimated cost string (e.g. "₦2,800 - ₦3,500" -> "₦5,600 - ₦7,000")
 */
export function scaleEstimatedCost(costStr: string | undefined, factor: number): string {
  if (!costStr) return '₦2,500 - ₦4,000';
  if (factor === 1) return costStr;

  // Extract all numbers from cost string (ignoring commas)
  const numbers = costStr.match(/\d+(?:,\d+)*/g);
  if (!numbers || numbers.length === 0) return costStr;

  let scaledCost = costStr;
  for (const numStr of numbers) {
    const rawNum = parseInt(numStr.replace(/,/g, ''), 10);
    if (!isNaN(rawNum)) {
      const scaledVal = Math.round(rawNum * factor);
      scaledCost = scaledCost.replace(numStr, `₦${scaledVal.toLocaleString()}`);
    }
  }

  // Clean double currency symbols if any replaced
  return scaledCost.replace(/₦\s*₦/g, '₦');
}

/**
 * Scale calories approx
 */
export function scaleCalories(caloriesApprox: number | undefined, factor: number): number {
  if (!caloriesApprox) return Math.round(400 * factor);
  return Math.round(caloriesApprox * factor);
}
