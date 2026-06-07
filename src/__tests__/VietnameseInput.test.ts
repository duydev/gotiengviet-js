import { VietnameseInput } from '../core/VietnameseInput';
import { INPUT_METHODS } from '../constants';

describe('VietnameseInput singleton', () => {
  afterEach(() => {
    VietnameseInput.destroyInstance();
  });

  it('returns the same instance', () => {
    const vi1 = VietnameseInput.getInstance();
    const vi2 = VietnameseInput.getInstance();
    expect(vi1).toBe(vi2);
  });

  it('can destroy and recreate instance', () => {
    const vi1 = VietnameseInput.getInstance();
    VietnameseInput.destroyInstance();
    const vi2 = VietnameseInput.getInstance();
    expect(vi1).not.toBe(vi2);
  });
});

describe('VietnameseInput default config', () => {
  afterEach(() => {
    VietnameseInput.destroyInstance();
  });

  it('defaults to enabled telex', () => {
    const vi = VietnameseInput.getInstance();
    expect(vi.isEnabled()).toBe(true);
    expect(vi.getInputMethod()).toBe('telex');
    vi.destroy();
  });
});

describe('VietnameseInput config and methods', () => {
  let vi: VietnameseInput;
  beforeEach(() => {
    VietnameseInput.destroyInstance();
    vi = VietnameseInput.getInstance({ enabled: false, inputMethod: 'vni' });
  });
  afterEach(() => {
    vi.destroy();
  });

  it('can toggle, enable, disable', () => {
    expect(vi.isEnabled()).toBe(false);
    vi.enable();
    expect(vi.isEnabled()).toBe(true);
    vi.disable();
    expect(vi.isEnabled()).toBe(false);
    vi.toggle();
    expect(vi.isEnabled()).toBe(true);
  });

  it('gets and sets input method', () => {
    expect(vi.getInputMethod()).toBe('vni');
    vi.setInputMethod('telex');
    expect(vi.getInputMethod()).toBe('telex');
    vi.setInputMethod('viqr');
    expect(vi.getInputMethod()).toBe('viqr');
    // Invalid method should not change
    vi.setInputMethod(
      'invalid' as unknown as ReturnType<typeof vi.getInputMethod>,
    );
    expect(vi.getInputMethod()).toBe('viqr');
  });
});

describe('VietnameseInput internal logic (coverage)', () => {
  it('handleCompositionStart/End: sets composing flag', () => {
    expect(vi['composing']).toBe(false);
    vi['handleCompositionStart']();
    expect(vi['composing']).toBe(true);
    vi['handleCompositionEnd']();
    expect(vi['composing']).toBe(false);
  });
  let vi: VietnameseInput;
  let input: HTMLInputElement;

  beforeEach(() => {
    VietnameseInput.destroyInstance();
    vi = VietnameseInput.getInstance({ enabled: true, inputMethod: 'telex' });
    input = document.createElement('input');
    document.body.appendChild(input);
  });

  afterEach(() => {
    vi.destroy();
    document.body.removeChild(input);
  });

  it('handleInput: skips if disabled or composing', () => {
    vi.disable();
    const event = new Event('input', { bubbles: true });
    Object.defineProperty(event, 'target', { value: input });
    vi['handleInput'](event);
    vi.enable();
    vi['composing'] = true;
    vi['handleInput'](event);
    vi['composing'] = false;
  });

  it('handleInput: skips if lastWord.length < 2', () => {
    input.value = 'a';
    input.selectionStart = 1;
    const event = new Event('input', { bubbles: true });
    Object.defineProperty(event, 'target', { value: input });
    vi['handleInput'](event);
  });

  it('handleInput: processes and replaces text (markRules)', () => {
    input.value = 'baaa';
    input.selectionStart = 4;
    const event = new Event('input', { bubbles: true });
    Object.defineProperty(event, 'target', { value: input });
    vi['handleInput'](event);
    expect(input.value).toBe('baâ'); // 'aa' -> 'â'
  });

  it('handleInput: processes and replaces text (toneRules)', () => {
    input.value = 'baas';
    input.selectionStart = 4;
    const event = new Event('input', { bubbles: true });
    Object.defineProperty(event, 'target', { value: input });
    vi['handleInput'](event);
    expect(input.value).toBe('baá'); // 's' -> sắc cho nguyên âm cuối
  });

  it('processInput: returns text if no rule matches', () => {
    expect(vi['processInput']('abc', INPUT_METHODS.telex)).toBe('abc');
  });

  it('applyTone: returns text if no vowels', () => {
    expect(vi['applyTone']('bc', 1)).toBe('bc');
  });

  it('applyTone: returns text if no toneMap', () => {
    expect(vi['applyTone']('zzz', 1)).toBe('zzz');
  });

  it('applyTone: applies tone to last vowel', () => {
    expect(vi['applyTone']('ban', 1)).toBe('bán');
    expect(vi['applyTone']('bAn', 2)).toBe('bàn'); // 'A' có trong VIETNAMESE_CHARS
  });

  it('markRules: Dd and DD should produce uppercase Đ', () => {
    // processInput is aware of markRules and should handle dd/ DD sequences
    expect(vi['processInput']('Dd', INPUT_METHODS.telex)).toBe('Đ');
    expect(vi['processInput']('DD', INPUT_METHODS.telex)).toBe('Đ');
  });

  it('regression: MIFNH becomes MÌNH', () => {
    expect(vi['processInput']('MIFNH', INPUT_METHODS.telex)).toBe('MÌNH');
  });

  it('regression: huowng becomes hương and HUOWNG -> HƯƠNG', () => {
    expect(vi['processInput']('huowng', INPUT_METHODS.telex)).toBe('hương');
    expect(vi['processInput']('HUOWNG', INPUT_METHODS.telex)).toBe('HƯƠNG');
  });

  it('destroy removes listeners', () => {
    const spy1 = jest.spyOn(document, 'removeEventListener');
    vi.destroy();
    expect(spy1).toHaveBeenCalled();
    spy1.mockRestore();
  });

  it('handleInput: VNI tone replacement', () => {
    vi.setInputMethod('vni');
    input.value = 'xin hoa1';
    input.selectionStart = 8;
    const event = new Event('input', { bubbles: true });
    Object.defineProperty(event, 'target', { value: input });
    vi['handleInput'](event);
    expect(input.value).toBe('xin hoá');
  });

  it('handleInput: VIQR mark replacement', () => {
    vi.setInputMethod('viqr');
    input.value = 'baaa(';
    input.selectionStart = 5;
    const event = new Event('input', { bubbles: true });
    Object.defineProperty(event, 'target', { value: input });
    vi['handleInput'](event);
    expect(input.value).toBe('baaă');
  });

  it('handleInput: skips email addresses', () => {
    input.value = 'test@email.com';
    input.selectionStart = 16;
    const event = new Event('input', { bubbles: true });
    Object.defineProperty(event, 'target', { value: input });
    vi['handleInput'](event);
    expect(input.value).toBe('test@email.com');
  });

  it('handleInput: skips variable-like tokens', () => {
    input.value = 'const variableName';
    input.selectionStart = 18;
    const event = new Event('input', { bubbles: true });
    Object.defineProperty(event, 'target', { value: input });
    vi['handleInput'](event);
    expect(input.value).toBe('const variableName');
  });

  it('handleInput: skips URLs', () => {
    input.value = 'see https://abc.com';
    input.selectionStart = 19;
    const event = new Event('input', { bubbles: true });
    Object.defineProperty(event, 'target', { value: input });
    vi['handleInput'](event);
    expect(input.value).toBe('see https://abc.com');
  });

  it('handleInput: no change when processed equals lastWord', () => {
    input.value = 'hello';
    input.selectionStart = 5;
    const event = new Event('input', { bubbles: true });
    Object.defineProperty(event, 'target', { value: input });
    vi['handleInput'](event);
    expect(input.value).toBe('hello');
  });

  it('handleInput: contenteditable telex tone replacement', () => {
    const div = document.createElement('div');
    div.setAttribute('contenteditable', 'true');
    div.textContent = 'baas';
    document.body.appendChild(div);

    const textNode = div.firstChild as Text;
    const range = document.createRange();
    range.setStart(textNode, 4);
    range.collapse(true);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);

    const event = new Event('input', { bubbles: true });
    Object.defineProperty(event, 'target', { value: div });
    vi['handleInput'](event);
    expect(div.innerText).toBe('baá');

    document.body.removeChild(div);
  });

  it('handleInput: ignores non-editable elements', () => {
    const div = document.createElement('div');
    div.innerText = 'baas';
    document.body.appendChild(div);
    const event = new Event('input', { bubbles: true });
    Object.defineProperty(event, 'target', { value: div });
    vi['handleInput'](event);
    expect(div.innerText).toBe('baas');
    document.body.removeChild(div);
  });

  it('handleInput: uses value length when selectionStart is null', () => {
    const target = {
      value: 'baas',
      selectionStart: null as number | null,
      selectionEnd: null as number | null,
      scrollTop: 0,
      setRangeText(
        replacement: string,
        start: number,
        end: number,
        _selectionMode?: string,
      ) {
        this.value =
          this.value.slice(0, start) + replacement + this.value.slice(end);
        const pos = start + replacement.length;
        this.selectionStart = pos;
        this.selectionEnd = pos;
      },
    } as HTMLInputElement;
    const event = new Event('input', { bubbles: true });
    Object.defineProperty(event, 'target', { value: target });
    vi['handleInput'](event);
    expect(target.value).toBe('baá');
  });
});
