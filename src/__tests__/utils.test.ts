import {
  isVietnameseWord,
  getLastWord,
  findVowelPosition,
  shouldRestoreNonViet,
  replaceText,
} from '../utils/helpers';

describe('isVietnameseWord', () => {
  it('returns false for empty string and special chars', () => {
    expect(isVietnameseWord('')).toBe(false);
    expect(isVietnameseWord('!@#$%^&*()')).toBe(false);
  });
  it('returns true for Vietnamese words', () => {
    expect(isVietnameseWord('Tiếng Việt')).toBe(true);
    expect(isVietnameseWord('Nguyen')).toBe(true);
    expect(isVietnameseWord('Đặng Thái Sơn')).toBe(true);
    expect(isVietnameseWord('Trần')).toBe(true);
  });
  it('returns false for non-Vietnamese words', () => {
    expect(isVietnameseWord('hello123')).toBe(false);
    expect(isVietnameseWord('test@domain.com')).toBe(false);
    expect(isVietnameseWord('https://abc.com')).toBe(false);
    expect(isVietnameseWord('code_snippet')).toBe(false);
  });
});

describe('getLastWord', () => {
  it('returns the last word before the cursor', () => {
    expect(getLastWord('Xin chao cac ban', 17)).toBe('ban');
    expect(getLastWord('Xin chao cac ban', 12)).toBe('cac');
    expect(getLastWord('Xin chao', 8)).toBe('chao');
    expect(getLastWord('Xin', 3)).toBe('Xin');
  });
  it('returns empty string if no word', () => {
    expect(getLastWord('   ', 3)).toBe('');
    expect(getLastWord('', 0)).toBe('');
  });
});

describe('findVowelPosition', () => {
  it('returns positions of all vowels', () => {
    expect(findVowelPosition('TiengViet')).toEqual([1, 2, 6, 7]);
    expect(findVowelPosition('abc')).toEqual([0]);
    expect(findVowelPosition('xyz')).toEqual([1]);
    expect(findVowelPosition('')).toEqual([]);
  });
  it('works with Vietnamese vowels', () => {
    expect(findVowelPosition('ươuăâêôơư')).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });
});

describe('shouldRestoreNonViet', () => {
  it('returns true for emails', () => {
    expect(shouldRestoreNonViet('test@email.com')).toBe(true);
  });
  it('returns true for URLs', () => {
    expect(shouldRestoreNonViet('https://abc.com')).toBe(true);
    expect(shouldRestoreNonViet('http://abc.com')).toBe(true);
  });
  it('returns true for variable names', () => {
    expect(shouldRestoreNonViet('variableName')).toBe(true);
    expect(shouldRestoreNonViet('test123')).toBe(true);
    expect(shouldRestoreNonViet('a')).toBe(true);
  });
  it('returns false for Vietnamese words', () => {
    expect(shouldRestoreNonViet('Tiếng Việt')).toBe(false);
    expect(shouldRestoreNonViet('Xin chao')).toBe(false);
  });
});

describe('replaceText', () => {
  it('replaces text and updates cursor', () => {
    const input = document.createElement('input');
    input.value = 'Xin chao cac ban';
    input.selectionStart = input.selectionEnd = 8;
    replaceText(input, 'bạn', 8, 11);
    expect(input.value).toBe('Xin chaobạnc ban');
    expect(input.selectionStart).toBe(11); // Cursor at end of replaced text
    expect(input.selectionEnd).toBe(11);
  });
  it('works with textarea', () => {
    const textarea = document.createElement('textarea');
    textarea.value = 'Xin chao cac ban';
    textarea.selectionStart = textarea.selectionEnd = 0;
    replaceText(textarea, 'Chào ', 0, 0);
    expect(textarea.value).toBe('Chào Xin chao cac ban');
    expect(textarea.selectionStart).toBe(5);
    expect(textarea.selectionEnd).toBe(5);
  });
});
