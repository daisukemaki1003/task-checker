function formatTaskLine_(t: Task): string {
  const dateRange = formatDateRange_(t.dateStart, t.dateEnd);
  const status = t.status || "未設定";
  return `*<${t.url}|${t.title}>*\n日程: ${dateRange} | 状態: ${status}`;
}

function formatDateRange_(startYmd: string, endYmd: string): string {
  if (!startYmd) return "未設定";
  if (!endYmd || endYmd === startYmd) return startYmd;
  return `${startYmd} - ${endYmd}`;
}

function formatTasksForAttachment_(tasks: Task[]): string {
  return tasks.map(formatTaskLine_).join("\n\n");
}
