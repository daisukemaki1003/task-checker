/**
 * Notion（Telepathyタスク管理）:
 * - 「日程（date）」の着手日/期限が "今日" または "今日+3日" のタスクを通知
 * - 担当者が makidaisuke のものに限定
 * - ステータス「完了」は除外
 */
function notifyDeadlines_today_and_3days_daisukemaki(): void {
  const today = formatYmd_(new Date());
  const in3 = formatYmd_(addDays_(new Date(), 3));

  const tasks = queryTasksByScheduleOr_(TARGET_USER_ID, [today, in3])
    .filter(t => t.status !== DONE_STATUS);

  if (tasks.length === 0) return;

  const todayTasks = tasks.filter(t => isStartOrEndOnDateYmd_(today, t.dateStart, t.dateEnd));
  const in3Tasks = tasks.filter(t => isStartOrEndOnDateYmd_(in3, t.dateStart, t.dateEnd));

  const attachments: any[] = [];
  if (todayTasks.length) {
    attachments.push({
      color: "#E01E5A",
      title: `当日（${formatYmdLongJp_(today)}）`,
      text: formatTasksForAttachment_(todayTasks),
      mrkdwn_in: ["text", "title"]
    });
  }
  if (in3Tasks.length) {
    attachments.push({
      color: "#ECB22E",
      title: `3日後（${formatYmdLongJp_(in3)}）`,
      text: formatTasksForAttachment_(in3Tasks),
      mrkdwn_in: ["text", "title"]
    });
  }

  const mention = buildMentionText_();
  const mentionPrefix = mention ? `${mention} ` : "";
  const summary = `${mentionPrefix}期限リマインド（今日 ${todayTasks.length}件 / 3日後 ${in3Tasks.length}件）`;
  postToSlack_(summary, attachments);
}
