export function cleanAudit(raw) {
  if (!raw) return '';

  return raw
    // Remove markdown headings
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold and italic stars
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Remove inline code backticks
    .replace(/`([^`]+)`/g, '$1')
    // Remove code blocks ```...```
    .replace(/```[\s\S]*?```/g, '')
    // Remove horizontal lines like --- or ***
    .replace(/^---$/gm, '')
    // Remove table formatting: |----| etc.
    .replace(/^\|.*\|$/gm, '')
    // Replace multiple newlines with just one
    .replace(/\n{2,}/g, '\n\n')
    // Trim leftover spaces
    .trim();
}
