import { InputMethodRule } from '../types';
import { TONE_VOWEL_PRIORITY, VIETNAMESE_CHARS } from '../constants';
import { findVowelPosition } from '../utils/helpers';

const sortedMarkKeysCache = new WeakMap<InputMethodRule, string[]>();

function getSortedMarkKeys(method: InputMethodRule): string[] {
  let keys = sortedMarkKeysCache.get(method);
  if (!keys) {
    keys = Object.keys(method.markRules).sort((a, b) => b.length - a.length);
    sortedMarkKeysCache.set(method, keys);
  }
  return keys;
}

/**
 * Pure, side-effect-free transformation utilities extracted from VietnameseInput.
 * These functions operate on strings only and can be unit-tested independently.
 */
export function processInputByMethod(
  text: string,
  method: InputMethodRule,
): string {
  let working = text;

  // Tone processing
  let idx = 0;
  while (idx < working.length) {
    const ch = working[idx];
    const lowerCh = ch.toLowerCase();
    const toneIndex = method.toneRules[lowerCh];
    if (toneIndex !== undefined) {
      if (idx > 0 && working[idx - 1].toLowerCase() === lowerCh) {
        idx++;
        continue;
      }
      const before = working.slice(0, idx);
      const after = working.slice(idx + 1);
      const base = before + after;
      const vowelPositions = findVowelPosition(base);
      // Choose a vowel to the left of the tone key. If there's no vowel to the left
      // (e.g. tone-like letter at the start of the word like "x" in "xi"), skip
      // tone application. This prevents accidental transformation such as "xi" -> "ĩ".
      let chosenPos = -1;
      for (const vp of vowelPositions) if (vp < idx) chosenPos = vp;
      if (chosenPos === -1) {
        // No vowel to the left — do not apply tone
        idx++;
        continue;
      }
      // apply tone using helper below
      working = applyToneToText(base, toneIndex);
      idx = 0;
      continue;
    }
    idx++;
  }

  // Mark rules (diacritic/key sequences)
  let changed = true;
  const markKeys = getSortedMarkKeys(method);
  while (changed) {
    changed = false;
    for (const key of markKeys) {
      const result = method.markRules[key as keyof typeof method.markRules];
      const idxExact = working.lastIndexOf(key);
      if (idxExact !== -1) {
        const before = working.slice(0, idxExact);
        const after = working.slice(idxExact + key.length);
        const prev = working;
        if (before.endsWith(result)) {
          working = before + key + after;
        } else {
          working = before + result + after;
        }
        if (working !== prev) {
          changed = true;
        }
        break;
      }
      const lowerKey = key.toLowerCase();
      const lowerText = working.toLowerCase();
      const idxLower = lowerText.lastIndexOf(lowerKey);
      if (idxLower !== -1) {
        const before = working.slice(0, idxLower);
        const after = working.slice(idxLower + key.length);
        const segment = working.substr(idxLower, key.length);
        const suggestsUpper = segment[0] === segment[0].toUpperCase();
        let mapped = result;
        const alt = method.markRules[key.toUpperCase()];
        if (suggestsUpper && alt) mapped = alt;
        const prev = working;
        if (before.endsWith(mapped)) {
          working = before + segment + after;
        } else {
          working = before + mapped + after;
        }
        if (working !== prev) {
          changed = true;
        }
        break;
      }
    }
  }

  // Normalize sequences like u + ơ -> ươ (and uppercase)
  working = working.replace(/uơ/g, 'ươ');
  working = working.replace(/UƠ/g, 'ƯƠ');

  return working;
}

export function applyToneToText(text: string, toneIndex: number): string {
  const vowelPositions = findVowelPosition(text);
  if (vowelPositions.length === 0) return text;

  const isAllUpper = text === text.toUpperCase();
  const findMappingForChar = (ch: string) => {
    const lower = ch.toLowerCase();
    if (!isAllUpper && lower in VIETNAMESE_CHARS) {
      return VIETNAMESE_CHARS[lower as keyof typeof VIETNAMESE_CHARS];
    }
    for (const key of Object.keys(VIETNAMESE_CHARS) as Array<
      keyof typeof VIETNAMESE_CHARS
    >) {
      const arr = VIETNAMESE_CHARS[key];
      if (arr.indexOf(ch) !== -1) return arr;
    }
    return null;
  };

  let chosenPos = vowelPositions[vowelPositions.length - 1];
  let bestRank = Number.MAX_SAFE_INTEGER;
  for (const p of vowelPositions) {
    const ch = text[p];
    const mapping = findMappingForChar(ch);
    if (!mapping) continue;
    const base = mapping[0];
    const rank =
      TONE_VOWEL_PRIORITY.indexOf(base) !== -1
        ? TONE_VOWEL_PRIORITY.indexOf(base)
        : Number.MAX_SAFE_INTEGER;
    if (rank < bestRank || (rank === bestRank && p > chosenPos)) {
      bestRank = rank;
      chosenPos = p;
    }
  }

  const vowel = text[chosenPos];
  const arr = findMappingForChar(vowel);
  if (!arr) return text;
  const idx = Math.max(0, Math.min(toneIndex, arr.length - 1));
  const tonedVowel = arr[idx] || arr[0];
  return text.slice(0, chosenPos) + tonedVowel + text.slice(chosenPos + 1);
}
