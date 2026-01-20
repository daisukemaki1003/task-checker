function addDays_(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatYmd_(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isDateInRangeYmd_(ymd: string, startYmd: string, endYmd: string): boolean {
  if (!startYmd) return false;
  const end = endYmd || startYmd;
  return startYmd <= ymd && ymd <= end;
}
