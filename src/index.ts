/**
 * Notion（Telepathyタスク管理）:
 * - 「日程（date）」が "今日" または "今日+3日" に含まれるタスクを通知
 * - 担当者が makidaisuke のものに限定
 * - ステータス「完了」は除外
 */
function notifyDeadlines_today_and_3days_daisukemaki(): void {
  const today = formatYmd_(new Date());
  const in3 = formatYmd_(addDays_(new Date(), 3));

  const tasks = queryTasksByScheduleOr_(TARGET_USER_ID, [today, in3])
    .filter(t => t.status !== DONE_STATUS);

  if (tasks.length === 0) return;

  const todayTasks = tasks.filter(t => isDateInRangeYmd_(today, t.dateStart, t.dateEnd));
  const in3Tasks = tasks.filter(t => isDateInRangeYmd_(in3, t.dateStart, t.dateEnd));

  const blocks: string[] = [];
  if (todayTasks.length) {
    blocks.push(`🚨 *当日*（${today}）`);
    blocks.push(...todayTasks.map(formatTaskLine_));
    blocks.push("");
  }
  if (in3Tasks.length) {
    blocks.push(`⏰ *3日後*（${in3}）`);
    blocks.push(...in3Tasks.map(formatTaskLine_));
  }

  postToSlack_(blocks.join("\n").trim());
}
