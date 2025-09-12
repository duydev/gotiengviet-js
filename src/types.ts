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

export interface ToneRule {
  key: string;
  tone: number;
}

export interface MarkRule {
  key: string;
  result: string;
}

export interface InputMethodRule {
  toneRules: Record<string, number>;
  markRules: Record<string, string>;
}
