export const locale = "ja-JP";
export const timeZone = "Asia/Tokyo";

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = hours > 0 ? String(minutes).padStart(2, "0") : String(minutes);
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone
  }).format(new Date(isoDate));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatViews(value: number): string {
  return `${formatNumber(value)} 回視聴`;
}

export function formatCurrency(value: number, currency = "JPY"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format(value);
}
