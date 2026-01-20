function queryTasksByScheduleOr_(assigneeUserId: string, dateYmdList: string[]): Task[] {
  const url = `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`;
  const notionToken = getRequiredScriptProperty_(NOTION_TOKEN_PROP_KEY);

  const orFilters = dateYmdList.map(ymd => ({
    and: [
      { property: SCHEDULE_PROP, date: { on_or_before: ymd } },
      { property: SCHEDULE_PROP, date: { on_or_after: ymd } }
    ]
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

  const results: Task[] = [];
  let startCursor: string | null = null;
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
    (json.results || []).forEach((page: any) => {
      results.push(mapPage_(page));
    });

    hasMore = !!json.has_more;
    startCursor = json.next_cursor;
  }

  return results;
}

function mapPage_(page: any): Task {
  const props = page.properties || {};
  const dateRange = getDateRangeYmd_(props, SCHEDULE_PROP);
  return {
    title: getTitle_(props, TITLE_PROP),
    status: getStatus_(props, STATUS_PROP),
    dateStart: dateRange.start,
    dateEnd: dateRange.end,
    url: page.url
  };
}

function getTitle_(props: any, propName: string): string {
  const p = props[propName];
  if (!p || p.type !== "title") return "(no title)";
  return (p.title || []).map((x: any) => x.plain_text).join("") || "(no title)";
}

function getStatus_(props: any, propName: string): string {
  const p = props[propName];
  if (!p) return "";
  if (p.type === "status") return p.status?.name || "";
  if (p.type === "select") return p.select?.name || "";
  return "";
}

function getDateRangeYmd_(props: any, propName: string): { start: string; end: string } {
  const p = props[propName];
  if (!p || p.type !== "date") return { start: "", end: "" };
  return {
    start: (p.date?.start || "").slice(0, 10),
    end: (p.date?.end || "").slice(0, 10)
  };
}
