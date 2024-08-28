export function formatAmountKsh(
  amount: number | string | Array<number | string>
): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(amount as number);
}
