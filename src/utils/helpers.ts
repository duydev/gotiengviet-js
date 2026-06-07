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

export type EditableElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLElement;

function isInputLikeElement(
  element: Element,
): element is HTMLInputElement | HTMLTextAreaElement {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    ('value' in element &&
      typeof (element as { value: unknown }).value === 'string' &&
      ('selectionStart' in element || 'setRangeText' in element))
  );
}

export function isContentEditableElement(
  element: Element,
): element is HTMLElement {
  if (!(element instanceof HTMLElement)) {
    return false;
  }
  const attr = element.getAttribute('contenteditable');
  return element.isContentEditable === true || attr === '' || attr === 'true';
}

export function isEditableElement(
  element: Element,
): element is EditableElement {
  return isInputLikeElement(element) || isContentEditableElement(element);
}

export function getEditableText(element: EditableElement): string {
  if (isInputLikeElement(element)) {
    return (element as HTMLInputElement).value;
  }
  const el = element as HTMLElement;
  return el.innerText ?? el.textContent ?? '';
}

function getContentEditableCaretOffset(element: HTMLElement): number {
  const text = getEditableText(element);
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return text.length;
  }
  const range = selection.getRangeAt(0);
  const preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(element);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  const offset = preCaretRange.toString().length;
  return offset > 0 || text.length === 0 ? offset : text.length;
}

function setContentEditableCaretOffset(
  element: HTMLElement,
  offset: number,
): void {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const range = document.createRange();
  let current = 0;
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode() as Text | null;

  while (node) {
    const len = node.textContent?.length ?? 0;
    if (current + len >= offset) {
      range.setStart(node, offset - current);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
    current += len;
    node = walker.nextNode() as Text | null;
  }

  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function getCaretOffset(element: EditableElement): number {
  if (isInputLikeElement(element)) {
    const input = element as HTMLInputElement;
    return input.selectionStart ?? input.value.length;
  }
  return getContentEditableCaretOffset(element);
}

function replaceContentEditableText(
  element: HTMLElement,
  newText: string,
  startPos: number,
  endPos: number,
): void {
  const text = getEditableText(element);
  element.innerText = text.slice(0, startPos) + newText + text.slice(endPos);
  setContentEditableCaretOffset(element, startPos + newText.length);
}

// Helper function to update text maintaining cursor position
export function replaceText(
  element: EditableElement,
  newText: string,
  startPos: number,
  endPos: number,
): void {
  if (isContentEditableElement(element)) {
    replaceContentEditableText(element, newText, startPos, endPos);
    return;
  }

  const inputEl = element as HTMLInputElement | HTMLTextAreaElement;

  // Save scroll state for restoration (inspired by avim.js approach)
  const savedScrollTop = inputEl.scrollTop || 0;

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
    'setRangeText' in inputEl &&
    typeof (inputEl as unknown as HasSetRangeText).setRangeText === 'function'
  ) {
    // setRangeText(replacement, start, end, selectionMode)
    // selectionMode 'end' moves the caret to the end of the replaced text.
    (inputEl as unknown as HasSetRangeText).setRangeText(
      newText,
      startPos,
      endPos,
      'end',
    );
    // Ensure selection reflects caret at end of inserted text
    const newCursorPos = startPos + newText.length;
    inputEl.selectionStart = inputEl.selectionEnd = newCursorPos;
  } else {
    // Fallback
    inputEl.value =
      inputEl.value.slice(0, startPos) + newText + inputEl.value.slice(endPos);
    const newCursorPos = startPos + newText.length;
    inputEl.selectionStart = inputEl.selectionEnd = newCursorPos;
  }

  // Restore scroll state
  inputEl.scrollTop = savedScrollTop;
}
