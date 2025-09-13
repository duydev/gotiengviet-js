import { processInputByMethod } from '../core/transform';
import { INPUT_METHODS } from '../constants';

describe('processInputByMethod (basic)', () => {
  test('applies simple mark rule (telex aa -> â)', () => {
    const method = INPUT_METHODS.telex;
    const input = 'aa';
    const out = processInputByMethod(input, method);
    expect(out).toBe('â');
  });

  test('applies tone rule (telex s -> acute) on vowel', () => {
    const method = INPUT_METHODS.telex;
    // 'as' should become 'á'
    const input = 'as';
    const out = processInputByMethod(input, method);
    expect(out).toBe('á');
  });
});
