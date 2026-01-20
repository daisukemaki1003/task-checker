function formatTaskLine_(t: Task): string {
  const dateRange = formatDateRange_(t.dateStart, t.dateEnd);
  return `*<${t.url}|${t.title}>*（${dateRange}）`;
}

function formatDateRange_(startYmd: string, endYmd: string): string {
  if (!startYmd) return "未設定";
  if (!endYmd || endYmd === startYmd) return formatMdJp_(startYmd);
  return `${formatMdJp_(startYmd)} - ${formatMdJp_(endYmd)}`;
}

function formatTasksForAttachment_(tasks: Task[]): string {
  return tasks.map(formatTaskLine_).join("\n\n");
}
