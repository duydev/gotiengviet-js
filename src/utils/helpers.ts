export function isVietnameseWord(text: string): boolean {
  return /^[a-zA-ZÀ-ỹ\s]+$/.test(text);
}

export function getLastWord(value: string, position: number): string {
  const before = value.slice(0, position);
  const match = before.match(/[^ \t\n\r.,!?]*$/);
  return match ? match[0] : '';
}

export function findVowelPosition(text: string): number[] {
  const vowels = /[aeiouyăâêôơưAEIOUYĂÂÊÔƠƯ]/gi;
  const positions = [];
  let match;

  while ((match = vowels.exec(text)) !== null) {
    positions.push(match.index);
  }

  return positions;
}

export function shouldRestoreNonViet(text: string): boolean {
  // Check if the text might be a code snippet, URL, email, etc.
  return (
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text) || // email
    /^https?:\/\//.test(text) || // URL
    /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(text) // variable name
  );
}

// Helper function to update text maintaining cursor position
export function replaceText(
  element: HTMLInputElement | HTMLTextAreaElement,
  newText: string,
  startPos: number,
  endPos: number,
): void {
  const beforeLength = element.value.length;
  element.value =
    element.value.slice(0, startPos) + newText + element.value.slice(endPos);

  const afterLength = element.value.length;
  const delta = afterLength - beforeLength;

  // Update cursor position
  element.selectionStart = element.selectionEnd = startPos + delta;
}
