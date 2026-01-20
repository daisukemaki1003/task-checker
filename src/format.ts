function formatTaskLine_(t: Task): string {
  const dateRange = formatDateRange_(t.dateStart, t.dateEnd);
  return `• ${t.title}（日程:${dateRange} / 状態:${t.status || "未設定"}）\n  ${t.url}`;
}

function formatDateRange_(startYmd: string, endYmd: string): string {
  if (!startYmd) return "未設定";
  if (!endYmd || endYmd === startYmd) return startYmd;
  return `${startYmd} - ${endYmd}`;
}
