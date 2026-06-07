/** Public library entry: VietnameseInput singleton/instance */
export { VietnameseInput } from './core/VietnameseInput';

/** Pure transform utilities (headless / server / CLI) */
export { processInputByMethod, applyToneToText } from './core/transform';

/** Public types */
export type { InputConfig, InputMethod } from './types';
