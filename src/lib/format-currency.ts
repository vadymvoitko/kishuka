const formatter = new Intl.NumberFormat('sw-TZ', {
  style: 'currency',
  currency: 'TZS',
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  return formatter.format(amount);
}
