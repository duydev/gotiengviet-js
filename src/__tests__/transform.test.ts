import { processInputByMethod, applyToneToText } from '../core/transform';
import { INPUT_METHODS } from '../constants';

const telex = INPUT_METHODS.telex;
const vni = INPUT_METHODS.vni;
const viqr = INPUT_METHODS.viqr;

describe('applyToneToText', () => {
  test('returns original when no vowels (consonants only)', () => {
    expect(applyToneToText('bc', 1)).toBe('bc');
    expect(applyToneToText('', 1)).toBe('');
  });

  test('y is treated as vowel', () => {
    expect(applyToneToText('xyz', 1)).toBe('xýz');
  });

  test('applies tone indices on vowel a', () => {
    expect(applyToneToText('ma', 1)).toBe('má');
    expect(applyToneToText('ma', 2)).toBe('mà');
    expect(applyToneToText('ma', 3)).toBe('mả');
    expect(applyToneToText('ma', 4)).toBe('mã');
    expect(applyToneToText('ma', 5)).toBe('mạ');
  });

  test('tone index 0 on plain vowel keeps base form', () => {
    expect(applyToneToText('ma', 0)).toBe('ma');
    expect(applyToneToText('má', 0)).toBe('má');
  });

  test('multi-vowel: priority picks a over o in hoa', () => {
    expect(applyToneToText('ban', 1)).toBe('bán');
    expect(applyToneToText('hoa', 1)).toBe('hoá');
  });

  test('uppercase handling', () => {
    expect(applyToneToText('BAN', 1)).toBe('BÁN');
    expect(applyToneToText('bAn', 2)).toBe('bàn');
  });

  test('all-uppercase word uses uppercase vowel mapping', () => {
    expect(applyToneToText('HOA', 1)).toBe('HOÁ');
  });

  test('special vowels â, ă, ê, ô, ơ, ư', () => {
    expect(applyToneToText('cây', 1)).toBe('cấy');
    expect(applyToneToText('tăng', 2)).toBe('tằng');
    expect(applyToneToText('tê', 3)).toBe('tể');
    expect(applyToneToText('cô', 4)).toBe('cỗ');
    expect(applyToneToText('mơ', 5)).toBe('mợ');
    expect(applyToneToText('tư', 1)).toBe('tứ');
  });
});

describe('processInputByMethod — Telex', () => {
  describe('mark rules', () => {
    test.each([
      ['aa', 'â'],
      ['aw', 'ă'],
      ['dd', 'đ'],
      ['ee', 'ê'],
      ['oo', 'ô'],
      ['ow', 'ơ'],
      ['uw', 'ư'],
      ['AA', 'Â'],
      ['DD', 'Đ'],
      ['EE', 'Ê'],
      ['OO', 'Ô'],
      ['AW', 'Ă'],
      ['OW', 'Ơ'],
      ['UW', 'Ư'],
    ])('%s → %s', (input, expected) => {
      expect(processInputByMethod(input, telex)).toBe(expected);
    });

    test('normalizes uơ → ươ via tuow', () => {
      expect(processInputByMethod('tuow', telex)).toBe('tươ');
      expect(processInputByMethod('HUOW', telex)).toBe('HƯƠ');
    });
  });

  describe('tone rules', () => {
    test.each([
      ['as', 'á'],
      ['af', 'à'],
      ['bas', 'bá'],
      ['baf', 'bà'],
      ['bar', 'bả'],
      ['bax', 'bã'],
      ['baj', 'bạ'],
      ['hoas', 'hoá'],
      ['ddas', 'đá'],
      ['ddaf', 'đà'],
    ])('%s → %s', (input, expected) => {
      expect(processInputByMethod(input, telex)).toBe(expected);
    });

    test('z as tone key applies ngang on preceding vowel', () => {
      expect(processInputByMethod('basz', telex)).toBe('báz');
    });

    test('double s: first s applies tone', () => {
      expect(processInputByMethod('ass', telex)).toBe('ás');
    });
  });

  describe('compound words (actual engine output)', () => {
    test('tieengs produces tieéng (double e retained)', () => {
      expect(processInputByMethod('tieengs', telex)).toBe('tieéng');
    });

    test('vieetj produces vieẹt (ee retained, tone on e)', () => {
      expect(processInputByMethod('vieetj', telex)).toBe('vieẹt');
    });

    test('nguoiwf applies tone on o', () => {
      expect(processInputByMethod('nguoiwf', telex)).toBe('nguòiw');
    });
  });

  describe('no-op', () => {
    test('unchanged when no rules match', () => {
      expect(processInputByMethod('abc', telex)).toBe('abc');
      expect(processInputByMethod('xi', telex)).toBe('xi');
    });
  });
});

describe('processInputByMethod — VNI', () => {
  describe('mark rules', () => {
    test.each([
      ['a6', 'â'],
      ['a8', 'ă'],
      ['d9', 'đ'],
      ['e6', 'ê'],
      ['o6', 'ô'],
      ['o7', 'ơ'],
      ['u7', 'ư'],
      ['A6', 'Â'],
      ['D9', 'Đ'],
    ])('%s → %s', (input, expected) => {
      expect(processInputByMethod(input, vni)).toBe(expected);
    });
  });

  describe('tone rules', () => {
    test.each([
      ['ba1', 'bá'],
      ['ba2', 'bà'],
      ['ba3', 'bả'],
      ['ba4', 'bã'],
      ['ba5', 'bạ'],
      ['hoa1', 'hoá'],
    ])('%s → %s', (input, expected) => {
      expect(processInputByMethod(input, vni)).toBe(expected);
    });

    test('ba10: tone on ba then trailing 0', () => {
      expect(processInputByMethod('ba10', vni)).toBe('bá0');
    });

    test('dd1 unchanged (d9 mark needs separate step)', () => {
      expect(processInputByMethod('dd1', vni)).toBe('dd1');
    });
  });

  describe('compound words', () => {
    test('tieeng5 and vieetj5', () => {
      expect(processInputByMethod('tieeng5', vni)).toBe('tieẹng');
      expect(processInputByMethod('vieetj5', vni)).toBe('vieẹtj');
    });
  });
});

describe('processInputByMethod — VIQR', () => {
  describe('mark rules (no ^ conflict)', () => {
    test.each([
      ['a(', 'ă'],
      ['dd', 'đ'],
      ['o+', 'ơ'],
      ['u+', 'ư'],
      ['A(', 'Ă'],
      ['DD', 'Đ'],
      ['O+', 'Ơ'],
      ['U+', 'Ư'],
    ])('%s → %s', (input, expected) => {
      expect(processInputByMethod(input, viqr)).toBe(expected);
    });
  });

  describe('mark rules with ^ (tone key conflicts)', () => {
    test('a^ consumed as tone revert — result a', () => {
      expect(processInputByMethod('a^', viqr)).toBe('a');
      expect(processInputByMethod('e^', viqr)).toBe('e');
      expect(processInputByMethod('o^', viqr)).toBe('o');
    });
  });

  describe('tone rules (tone key strips itself; trailing consonant kept)', () => {
    test.each([
      ["as'", 'ás'],
      ['af`', 'àf'],
      ['ar?', 'ảr'],
      ['ax~', 'ãx'],
      ['aj.', 'ạj'],
      ["hoas'", 'hoás'],
      ["a'", 'á'],
      ['a`', 'à'],
    ])('%s → %s', (input, expected) => {
      expect(processInputByMethod(input, viqr)).toBe(expected);
    });
  });

  describe('tone before vowel (VIQR style) — not supported', () => {
    test.each([
      ["b'a", "b'a"],
      ['b`a', 'b`a'],
      ['b?a', 'b?a'],
    ])('%s unchanged', (input, expected) => {
      expect(processInputByMethod(input, viqr)).toBe(expected);
    });
  });

  describe('compound words', () => {
    test("tieeng' and vieetj.", () => {
      expect(processInputByMethod("tieeng'", viqr)).toBe('tieéng');
      expect(processInputByMethod('vieetj.', viqr)).toBe('vieẹtj');
    });
  });
});

describe('processInputByMethod — edge cases', () => {
  test('skips consecutive duplicate tone keys', () => {
    expect(processInputByMethod('axx', telex)).toBe('ãx');
  });

  test('mark already present keeps sequence', () => {
    expect(processInputByMethod('aâ', telex)).toBe('aâ');
  });

  test('known: MIFNH → MÌNH', () => {
    expect(processInputByMethod('MIFNH', telex)).toBe('MÌNH');
  });

  test('known: huowng → hương, HUOWNG → HƯƠNG', () => {
    expect(processInputByMethod('huowng', telex)).toBe('hương');
    expect(processInputByMethod('HUOWNG', telex)).toBe('HƯƠNG');
  });
});
