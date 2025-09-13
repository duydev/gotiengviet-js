import { InputMethodRule, InputConfig, InputMethod } from '../types';
import { INPUT_METHODS, VIETNAMESE_CHARS } from '../constants';
import { getLastWord, findVowelPosition, replaceText } from '../utils/helpers';

export class VietnameseInput {
  /**
   * Singleton instance
   */
  private static _instance: VietnameseInput | null = null;

  /**
   * Get the singleton instance (recommended usage)
   */
  public static getInstance(config: InputConfig = {}): VietnameseInput {
    if (!VietnameseInput._instance) {
      VietnameseInput._instance = new VietnameseInput(config);
    }
    return VietnameseInput._instance;
  }
  private config: InputConfig;
  private enabled: boolean;
  private composing: boolean = false;
  private handleInputBound: (e: Event) => void;
  private handleCompositionStart: () => void;
  private handleCompositionEnd: () => void;

  /**
   * Create a new VietnameseInput instance (advanced usage, not recommended)
   * Use VietnameseInput.getInstance() for singleton.
   */
  constructor(config: InputConfig = {}) {
    // Merge config with defaults
    this.config = {
      enabled: config.enabled !== undefined ? config.enabled : true,
      inputMethod: config.inputMethod || 'telex',
    };
    this.enabled = !!this.config.enabled;

    // Bind event handlers once
    this.handleInputBound = this.handleInput.bind(this);
    this.handleCompositionStart = () => {
      this.composing = true;
    };
    this.handleCompositionEnd = () => {
      this.composing = false;
    };
    this.setupListeners();
  }

  /**
   * Destroy the singleton instance (for cleanup/testing)
   */
  public static destroyInstance(): void {
    if (VietnameseInput._instance) {
      VietnameseInput._instance.destroy();
      VietnameseInput._instance = null;
    }
  }

  private setupListeners(): void {
    document.addEventListener('input', this.handleInputBound);
    document.addEventListener('compositionstart', this.handleCompositionStart);
    document.addEventListener('compositionend', this.handleCompositionEnd);
  }

  private handleInput(event: Event): void {
    if (!this.enabled || this.composing) {
      return;
    }

    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const value = target.value;
    const cursorPos = target.selectionStart || value.length;

    const lastWord = getLastWord(value, cursorPos);
    // keep previous behavior: only attempt when last word has at least 2 chars
    if (lastWord.length < 2) return;
    const method = INPUT_METHODS[this.config.inputMethod || 'telex'];
    const processed = this.processInput(lastWord, method);
    if (processed !== lastWord) {
      // start and end positions of the last word
      const startPos = cursorPos - lastWord.length;
      const endPos = cursorPos;
      // Replace only the last word segment (replaceText expects the replacement fragment)
      event.preventDefault();
      replaceText(target, processed, startPos, endPos);
    }
  }

  private processInput(text: string, method: InputMethodRule): string {
    // First, process tone keys that may appear anywhere (case-insensitive),
    // e.g., user types F then N H -> we should still apply tone to earlier vowel.
    let idx = 0;
    while (idx < text.length) {
      const ch = text[idx];
      const lowerCh = ch.toLowerCase();
      const toneIndex = method.toneRules[lowerCh];
      if (toneIndex !== undefined) {
        // Prevent double-tone typing (same key repeated immediately)
        if (idx > 0 && text[idx - 1].toLowerCase() === lowerCh) {
          idx++;
          continue;
        }
        // Remove tone char from text
        const before = text.slice(0, idx);
        const after = text.slice(idx + 1);
        const base = before + after;
        // Find vowel positions in base and choose the vowel to the left of original tone position if possible
        const vowelPositions = findVowelPosition(base);
        let chosenPos = -1;
        for (const vp of vowelPositions) {
          if (vp < idx) chosenPos = vp;
        }
        if (chosenPos === -1 && vowelPositions.length > 0) {
          chosenPos = vowelPositions[vowelPositions.length - 1];
        }
        if (chosenPos === -1) {
          idx++;
          continue;
        }
        // Apply tone; preserve case by passing base to applyTone which already handles case
        const toned = this.applyTone(base, toneIndex);
        text = toned;
        // restart scanning from beginning to handle multiple tone chars
        idx = 0;
        continue;
      }
      idx++;
    }

    // Then apply markRules anywhere inside the word (not only suffix).
    // We iterate replacing occurrences until no change; prefer exact-case matches first.
    let changed = true;
    const markKeys = Object.keys(method.markRules).sort(
      (a, b) => b.length - a.length,
    );
    while (changed) {
      changed = false;
      for (const key of markKeys) {
        const result = method.markRules[key as keyof typeof method.markRules];
        const idxExact = text.lastIndexOf(key);
        if (idxExact !== -1) {
          const before = text.slice(0, idxExact);
          const after = text.slice(idxExact + key.length);
          if (before.endsWith(result)) {
            text = before + key + after;
          } else {
            text = before + result + after;
          }
          changed = true;
          break;
        }
        const lowerKey = key.toLowerCase();
        const lowerText = text.toLowerCase();
        const idxLower = lowerText.lastIndexOf(lowerKey);
        if (idxLower !== -1) {
          const before = text.slice(0, idxLower);
          const after = text.slice(idxLower + key.length);
          const segment = text.substr(idxLower, key.length);
          const suggestsUpper = segment[0] === segment[0].toUpperCase();
          let mapped = result;
          const alt = method.markRules[key.toUpperCase()];
          if (suggestsUpper && alt) mapped = alt;
          if (before.endsWith(mapped)) {
            text = before + segment + after;
          } else {
            text = before + mapped + after;
          }
          changed = true;
          break;
        }
      }
    }

    // Post-processing: in cases like 'u' + 'ơ' -> should normalize to 'ươ' (and uppercase variants)
    // handle lowercase
    text = text.replace(/uơ/g, 'ươ');
    // uppercase
    text = text.replace(/UƠ/g, 'ƯƠ');

    return text;
  }

  private applyTone(text: string, toneIndex: number): string {
    const vowelPositions = findVowelPosition(text);
    if (vowelPositions.length === 0) return text;

    // Choose which vowel should receive the tone using a priority list.
    // This approximates Vietnamese orthography: prefer 'a' variants, then 'o' variants, then 'e', then 'u', then 'i'/'y'.
    const priority = [
      'a',
      'ă',
      'â',
      'o',
      'ô',
      'ơ',
      'e',
      'ê',
      'u',
      'ư',
      'i',
      'y',
      'A',
      'Ă',
      'Â',
      'O',
      'Ô',
      'Ơ',
      'E',
      'Ê',
      'U',
      'Ư',
      'I',
      'Y',
    ];

    // Helper: find mapping array for a character. When the whole word is not uppercase prefer lowercase mapping
    const isAllUpper = text === text.toUpperCase();
    const findMappingForChar = (ch: string) => {
      const lower = ch.toLowerCase();
      if (!isAllUpper && lower in VIETNAMESE_CHARS) {
        return VIETNAMESE_CHARS[lower as keyof typeof VIETNAMESE_CHARS];
      }
      // fallback: return any mapping that contains this char
      for (const key of Object.keys(VIETNAMESE_CHARS) as Array<
        keyof typeof VIETNAMESE_CHARS
      >) {
        const arr = VIETNAMESE_CHARS[key];
        if (arr.indexOf(ch) !== -1) return arr;
      }
      return null;
    };

    // Evaluate candidate vowel positions and pick the one with highest priority
    let chosenPos = vowelPositions[vowelPositions.length - 1]; // fallback: last
    let bestRank = Number.MAX_SAFE_INTEGER;
    for (const p of vowelPositions) {
      const ch = text[p];
      const mapping = findMappingForChar(ch);
      if (!mapping) continue;
      // determine base key (the mapping's index 0 lowercased)
      const base = mapping[0];
      const rank =
        priority.indexOf(base) !== -1
          ? priority.indexOf(base)
          : Number.MAX_SAFE_INTEGER;
      // Prefer lower rank; on tie prefer the later vowel (higher position)
      if (rank < bestRank || (rank === bestRank && p > chosenPos)) {
        bestRank = rank;
        chosenPos = p;
      }
    }

    const vowel = text[chosenPos];
    const arr = findMappingForChar(vowel);
    if (!arr) return text;
    // toneIndex 0 means remove tone (restore base), arrays are ordered with base at index 0
    const idx = Math.max(0, Math.min(toneIndex, arr.length - 1));
    const tonedVowel = arr[idx] || arr[0];
    return text.slice(0, chosenPos) + tonedVowel + text.slice(chosenPos + 1);
  }

  /**
   * Toggle Vietnamese input on/off
   */
  public toggle(): void {
    this.enabled = !this.enabled;
  }

  /**
   * Enable Vietnamese input
   */
  public enable(): void {
    this.enabled = true;
  }

  /**
   * Disable Vietnamese input
   */
  public disable(): void {
    this.enabled = false;
  }

  /**
   * Check if Vietnamese input is enabled
   */
  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Remove all event listeners and clean up
   */
  public destroy(): void {
    document.removeEventListener('input', this.handleInputBound);
    document.removeEventListener(
      'compositionstart',
      this.handleCompositionStart,
    );
    document.removeEventListener('compositionend', this.handleCompositionEnd);
  }

  /**
   * Get current input method
   */
  public getInputMethod(): InputMethod {
    return this.config.inputMethod || 'telex';
  }

  /**
   * Set input method (telex, vni, viqr)
   */
  public setInputMethod(method: InputMethod): void {
    if (['telex', 'vni', 'viqr'].includes(method)) {
      this.config.inputMethod = method;
    }
  }
}
