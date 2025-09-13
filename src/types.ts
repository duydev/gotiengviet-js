/** Supported input method identifiers. */
export type InputMethod = 'telex' | 'vni' | 'viqr';

export interface InputConfig {
  /**
   * Enable/disable Vietnamese input at startup (default: true)
   */
  enabled?: boolean;
  /**
   * Input method: 'telex' | 'vni' | 'viqr' (default: 'telex')
   */
  inputMethod?: InputMethod;
}

/** Single tone rule mapping (internal shape used by InputMethodRule). */
export interface ToneRule {
  key: string;
  tone: number;
}

/** Single mark rule mapping (internal shape used by InputMethodRule). */
export interface MarkRule {
  key: string;
  result: string;
}

/**
 * Representation of an input method's rules.
 * - `toneRules`: mapping from typed key to tone index
 * - `markRules`: mapping from typed sequence to resulting character
 */
export interface InputMethodRule {
  toneRules: Record<string, number>;
  markRules: Record<string, string>;
}
