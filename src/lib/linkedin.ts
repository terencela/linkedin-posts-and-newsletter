/** Strip markdown for LinkedIn paste. */
export function toLinkedInText(body: string): string {
  return body
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/^[-*]\s+/gm, "• ")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}
