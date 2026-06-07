import { VIETNAMESE_CHARS } from '../constants';

function isVowelChar(ch: string): boolean {
  const lower = ch.toLowerCase();
  if (/[aeiouyăâêôơư]/.test(lower)) {
    return true;
  }
  if (lower in VIETNAMESE_CHARS) {
    return true;
  }
  for (const key of Object.keys(VIETNAMESE_CHARS) as Array<
    keyof typeof VIETNAMESE_CHARS
  >) {
    const arr = VIETNAMESE_CHARS[key];
    if (arr.indexOf(ch) !== -1 || arr.indexOf(lower) !== -1) {
      return true;
    }
  }
  return false;
}

export function isVietnameseWord(text: string): boolean {
  return /^[a-zA-ZÀ-ỹ\s]+$/.test(text);
}

export function getLastWord(value: string, position: number): string {
  const before = value.slice(0, position);
  const match = before.match(/[^ \t\n\r.,!?]*$/);
  return match ? match[0] : '';
}

export function findVowelPosition(text: string): number[] {
  const positions: number[] = [];
  for (let i = 0; i < text.length; i++) {
    if (isVowelChar(text[i])) {
      positions.push(i);
    }
  }
  return positions;
}

export function shouldRestoreNonViet(text: string): boolean {
  // Email and URL — always skip transform
  if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text)) {
    return true;
  }
  if (/^https?:\/\//.test(text)) {
    return true;
  }

  // snake_case identifiers
  if (text.includes('_')) {
    return true;
  }

  // camelCase (e.g. variableName)
  if (/[a-z][A-Z]/.test(text)) {
    return true;
  }

  // VNI: trailing single digit 0–5 is a tone key, not a code token
  const vniToneStripped = text.replace(/[0-5]$/, '');
  if (vniToneStripped !== text && /^\D+$/.test(vniToneStripped)) {
    return false;
  }

  // Tokens with digits (e.g. test123) — but not pure-letter Vietnamese input
  if (/\d/.test(text)) {
    return true;
  }

  return false;
}

// Helper function to update text maintaining cursor position
export function replaceText(
  element: HTMLInputElement | HTMLTextAreaElement,
  newText: string,
  startPos: number,
  endPos: number,
): void {
  // Save scroll state for restoration (inspired by avim.js approach)
  const savedScrollTop = element.scrollTop || 0;

  // If supported, use setRangeText which preserves other selection behavior
  // and is more efficient than manual string splicing.
  interface HasSetRangeText {
    setRangeText(
      replacement: string,
      start: number,
      end: number,
      selectionMode?: 'preserve' | 'select' | 'end',
    ): void;
  }

  if (
    'setRangeText' in element &&
    typeof (element as unknown as HasSetRangeText).setRangeText === 'function'
  ) {
    // setRangeText(replacement, start, end, selectionMode)
    // selectionMode 'end' moves the caret to the end of the replaced text.
    (element as unknown as HasSetRangeText).setRangeText(
      newText,
      startPos,
      endPos,
      'end',
    );
    // Ensure selection reflects caret at end of inserted text
    const newCursorPos = startPos + newText.length;
    element.selectionStart = element.selectionEnd = newCursorPos;
  } else {
    // Fallback
    element.value =
      element.value.slice(0, startPos) + newText + element.value.slice(endPos);
    const newCursorPos = startPos + newText.length;
    element.selectionStart = element.selectionEnd = newCursorPos;
  }

  // Restore scroll state
  element.scrollTop = savedScrollTop;
}
