export function formatPriceCents(cents, currency = 'USD', locale = navigator.language) {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format((cents || 0) / 100)
  } catch {
    return `$${((cents || 0) / 100).toFixed(2)}`
  }
}
