/** Date / number / string formatting helpers (Spanish UI locale). */

const MS_PER_DAY = 86_400_000;

/** ISO (yyyy-mm-dd) date `n` days from `from` (default today). */
export function addDays(n: number, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Whole days from today until an ISO date (negative = in the past). */
export function daysTo(iso: string): number {
  const target = new Date(iso + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / MS_PER_DAY);
}

/** "15 jun 2026" — short Spanish date. */
export function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** "8 – 11 jun 2026" — event date range. */
export function formatDateRange(startIso: string, endIso: string): string {
  if (!startIso) return '—';
  if (!endIso || startIso === endIso) return formatDate(startIso);
  return `${formatDate(startIso)} – ${formatDate(endIso)}`;
}

/** "$84,200" — USD, no decimals. */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

/** "JM" from a first/last name pair. */
export function initialsOf(first?: string, last?: string): string {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
}
