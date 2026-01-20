function postToSlack_(text: string): void {
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
