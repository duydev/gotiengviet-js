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
    if (lastWord.length < 2) return;
    const method = INPUT_METHODS[this.config.inputMethod || 'telex'];
    const processed = this.processInput(lastWord, method);
    if (processed !== lastWord) {
      // Xác định vị trí bắt đầu và kết thúc của từ cuối cùng
      const startPos = cursorPos - lastWord.length;
      const endPos = cursorPos;
      // Tạo giá trị mới cho toàn bộ input
      const newValue =
        value.slice(0, startPos) + processed + value.slice(endPos);
      // Đặt lại vị trí con trỏ sau từ vừa thay thế
      const newCursor = startPos + processed.length;
      event.preventDefault();
      replaceText(target, newValue, newCursor, newCursor);
    }
  }

  private processInput(text: string, method: InputMethodRule): string {
    // Marking rules (aa -> â, aw -> ă, etc.)
    for (const [key, result] of Object.entries(method.markRules)) {
      if (text.toLowerCase().endsWith(key.toLowerCase())) {
        const before = text.slice(0, -key.length);
        // Nếu đã là ký tự mark, gõ lại key sẽ undo về ký tự gốc
        if (before.endsWith(result)) {
          // Undo: trả lại ký tự gốc (key)
          return before + key;
        }
        // Nếu phía trước là key mark/tone giống key, không thay thế (giữ nguyên)
        if (before.endsWith(key)) return text;
        const base = text.slice(0, -key.length);
        return base + result;
      }
    }

    // Tone rules (s -> sắc, f -> huyền, etc.)
    const lastChar = text.slice(-1);
    if (lastChar in method.toneRules) {
      // Luôn cho phép gõ lặp key tone: nếu phía trước là ký tự tone giống lastChar, không thay thế
      if (text.slice(-2, -1) === lastChar) return text;
      // Chỉ áp dụng tone nếu có nguyên âm hợp lệ
      const base = text.slice(0, -1);
      const vowelPositions = findVowelPosition(base);
      if (vowelPositions.length === 0) {
        // Không có nguyên âm, không áp dụng tone, trả về text gốc (cho phép nhập r/f/s...)
        return text;
      }
      const tone = method.toneRules[lastChar];
      return this.applyTone(base, tone);
    }

    return text;
  }

  private applyTone(text: string, toneIndex: number): string {
    const vowelPositions = findVowelPosition(text);
    if (vowelPositions.length === 0) return text;

    // Apply tone to the last vowel by default
    const pos = vowelPositions[vowelPositions.length - 1];
    const vowel = text[pos];
    const toneMap =
      VIETNAMESE_CHARS[vowel.toLowerCase() as keyof typeof VIETNAMESE_CHARS];
    if (!toneMap) return text;
    const tonedVowel = toneMap[toneIndex] || vowel;
    return text.slice(0, pos) + tonedVowel + text.slice(pos + 1);
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
