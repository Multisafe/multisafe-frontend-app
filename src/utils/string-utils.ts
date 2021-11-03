export function formatText(string: String) {
  if (!string) return "";

  return string.replace(/\s+/g, " ").trim();
}
