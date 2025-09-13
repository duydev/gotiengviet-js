import { InputConfig, InputMethod, InputMethodRule } from '../types';
import { INPUT_METHODS } from '../constants';
import { getLastWord, replaceText } from '../utils';
import { processInputByMethod } from './transform';
import { applyToneToText } from './transform';

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

  // Backwards-compatible accessors for tests and callers that relied on internal methods.
  // These delegate to the pure transform functions.
  public processInput(text: string, method: InputMethodRule): string {
    return processInputByMethod(text, method);
  }

  public applyTone(text: string, toneIndex: number): string {
    return applyToneToText(text, toneIndex);
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
    const processed = processInputByMethod(lastWord, method);
    if (processed !== lastWord) {
      // start and end positions of the last word
      const startPos = cursorPos - lastWord.length;
      const endPos = cursorPos;
      // Replace only the last word segment (replaceText expects the replacement fragment)
      event.preventDefault();
      replaceText(target, processed, startPos, endPos);
    }
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
