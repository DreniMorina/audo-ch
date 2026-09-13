export const formatCHF = (n: number) =>
  new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 0,
  }).format(n);

// Backwards-compatible alias (the project is Swiss-focused; prices are CHF).
export const formatEUR = formatCHF;

export const formatKm = (n: number) => `${new Intl.NumberFormat("de-CH").format(n)} km`;
