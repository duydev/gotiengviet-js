import { replaceText } from '../utils';

// JSDOM provides an input element for tests; we only test basic replacement behavior
describe('utils index and replaceText (basic)', () => {
  test('replaceText replaces segment and moves caret', () => {
    const input = document.createElement('input');
    input.value = 'hello world';
    input.selectionStart = input.selectionEnd = 11;

    replaceText(input, 'everyone', 6, 11);

    expect(input.value).toBe('hello everyone');
    expect(input.selectionStart).toBe(14);
    expect(input.selectionEnd).toBe(14);
  });
});
