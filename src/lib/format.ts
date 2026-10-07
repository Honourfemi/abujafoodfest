/** Format a number as Nigerian Naira (e.g. 25000 → ₦25,000) */
export function fmtNaira(n: number): string {
  return `₦${Math.round(n).toLocaleString("en-NG")}`;
}
