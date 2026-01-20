function getRequiredScriptProperty_(key: string): string {
  const value = PropertiesService.getScriptProperties().getProperty(key);
  if (!value) {
    throw new Error(`Script Properties の ${key} が未設定です。`);
  }
  return value;
}

function getOptionalScriptProperty_(key: string): string {
  const value = PropertiesService.getScriptProperties().getProperty(key);
  if (!value) {
    console.log(`Script Properties の ${key} が未設定です。`);
  }
  return value || "";
}
