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

function isStartOrEndOnDateYmd_(ymd: string, startYmd: string, endYmd: string): boolean {
  if (!startYmd) return false;
  const end = endYmd || startYmd;
  return ymd === startYmd || ymd === end;
}

function formatMdJp_(ymd: string): string {
  if (!ymd) return "";
  const parts = ymd.split("-");
  if (parts.length < 3) return ymd;
  const m = String(Number(parts[1]));
  const d = String(Number(parts[2]));
  return `${m}月${d}日`;
}

function formatYmdLongJp_(ymd: string): string {
  if (!ymd) return "";
  const parts = ymd.split("-");
  if (parts.length < 3) return ymd;
  const y = parts[0];
  const m = String(Number(parts[1]));
  const d = String(Number(parts[2]));
  return `${y}年${m}月${d}日`;
}
