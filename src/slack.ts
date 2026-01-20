function postToSlack_(text: string, attachments: any[] = []): void {
  const slackWebhookUrl = getOptionalScriptProperty_(SLACK_WEBHOOK_URL_PROP_KEY);
  if (!slackWebhookUrl || slackWebhookUrl.includes("XXX")) {
    console.log("SLACK_WEBHOOK_URL未設定のため送信せずログ出力:\n" + text);
    return;
  }
  const payload: any = { text, link_names: 1 };
  if (attachments.length > 0) payload.attachments = attachments;
  UrlFetchApp.fetch(slackWebhookUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}
