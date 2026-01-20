/**
 * Notion（Telepathyタスク管理）:
 * - 「締め切り日（formula/date）」が "今日" または "今日+3日" のタスクを通知
 * - 担当者が makidaisuke のものに限定
 * - ステータス「完了」は除外
 */

const NOTION_TOKEN_PROP_KEY = "NOTION_API_TOKEN";
const NOTION_DATABASE_ID = "1e651189e7918028b6cbe047764989cf";

// Slack Incoming Webhook URL（Script Properties で設定）
const SLACK_WEBHOOK_URL_PROP_KEY = "SLACK_WEBHOOK_URL";


// DBプロパティ
const TITLE_PROP = "タスク名";
const STATUS_PROP = "ステータス";
const ASSIGNEE_PROP = "担当者";
const DEADLINE_PROP = "締め切り日"; // formula(date)


// 条件
const DONE_STATUS = "完了";
const TARGET_USER_ID = "1445087a-04c9-405f-b123-05e7bcd84499"; // daisukemaki


function notifyDeadlines_today_and_3days_daisukemaki() {
  const today = formatYmd_(new Date());
  const in3 = formatYmd_(addDays_(new Date(), 3));

  const tasks = queryTasksByDeadlineOr_(TARGET_USER_ID, [today, in3])
    .filter(t => t.status !== DONE_STATUS);

  if (tasks.length === 0) return;

  const todayTasks = tasks.filter(t => t.deadline === today);
  const in3Tasks = tasks.filter(t => t.deadline === in3);

  const blocks = [];
  if (todayTasks.length) {
    blocks.push(`🚨 *締切当日*（${today}）`);
    blocks.push(...todayTasks.map(formatTaskLine_));
    blocks.push("");
  }
  if (in3Tasks.length) {
    blocks.push(`⏰ *締切3日前*（${in3}）`);
    blocks.push(...in3Tasks.map(formatTaskLine_));
  }

  postToSlack_(blocks.join("\n").trim());
}

function queryTasksByDeadlineOr_(assigneeUserId, dateYmdList) {
  const url = `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`;
  const notionToken = getRequiredScriptProperty_(NOTION_TOKEN_PROP_KEY);

  const orFilters = dateYmdList.map(ymd => ({
    property: DEADLINE_PROP,
    formula: { date: { equals: ymd } }
  }));

  const payload = {
    filter: {
      and: [
        { property: ASSIGNEE_PROP, people: { contains: assigneeUserId } },
        { property: STATUS_PROP, status: { does_not_equal: DONE_STATUS } },
        { or: orFilters }
      ]
    }
  };

  const results = [];
  let startCursor = null;
  let hasMore = true;

  while (hasMore) {
    const body = startCursor ? { ...payload, start_cursor: startCursor } : payload;

    const res = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Notion-Version": "2022-06-28"
      },
      payload: JSON.stringify(body),
      muteHttpExceptions: true
    });

    const code = res.getResponseCode();
    const text = res.getContentText();
    if (code >= 400) throw new Error(`Notion API error: ${code}\n${text}`);

    const json = JSON.parse(text);
    (json.results || []).forEach(page => results.push(mapPage_(page)));

    hasMore = !!json.has_more;
    startCursor = json.next_cursor;
  }

  return results;
}

function mapPage_(page) {
  const props = page.properties || {};
  return {
    title: getTitle_(props, TITLE_PROP),
    status: getStatus_(props, STATUS_PROP),
    deadline: getFormulaDateYmd_(props, DEADLINE_PROP),
    url: page.url
  };
}

function getTitle_(props, propName) {
  const p = props[propName];
  if (!p || p.type !== "title") return "(no title)";
  return (p.title || []).map(x => x.plain_text).join("") || "(no title)";
}

function getStatus_(props, propName) {
  const p = props[propName];
  if (!p) return "";
  if (p.type === "status") return p.status?.name || "";
  if (p.type === "select") return p.select?.name || "";
  return "";
}

function getFormulaDateYmd_(props, propName) {
  const p = props[propName];
  if (!p || p.type !== "formula") return "";
  if (p.formula?.type !== "date") return "";
  return (p.formula?.date?.start || "").slice(0, 10);
}

function formatTaskLine_(t) {
  return `• ${t.title}（締切:${t.deadline} / 状態:${t.status || "未設定"}）\n  ${t.url}`;
}

function postToSlack_(text) {
  const slackWebhookUrl = getOptionalScriptProperty_(SLACK_WEBHOOK_URL_PROP_KEY);
  if (!slackWebhookUrl || slackWebhookUrl.includes("XXX")) {
    console.log("SLACK_WEBHOOK_URL未設定のため送信せずログ出力:\n" + text);
    return;
  }
  UrlFetchApp.fetch(slackWebhookUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({ text })
  });
}

function addDays_(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatYmd_(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getRequiredScriptProperty_(key) {
  const value = PropertiesService.getScriptProperties().getProperty(key);
  if (!value) {
    throw new Error(`Script Properties の ${key} が未設定です。`);
  }
  return value;
}

function getOptionalScriptProperty_(key) {
  const value = PropertiesService.getScriptProperties().getProperty(key);
  if (!value) {
    console.log(`Script Properties の ${key} が未設定です。`);
  }
  return value || "";
}
