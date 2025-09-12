
# gotiengviet-js

![npm](https://img.shields.io/npm/v/gotiengviet?style=flat-square)
![npm downloads](https://img.shields.io/npm/dm/gotiengviet?style=flat-square)
![license](https://img.shields.io/npm/l/gotiengviet?style=flat-square)
![build](https://github.com/duydev/gotiengviet-js/actions/workflows/ci.yml/badge.svg)

Add Vietnamese typing capabilities to your web application with minimal setup. This package brings the familiar typing experience of Unikey/EVKey to the browser, supporting all popular input methods (Telex, VNI, VIQR).

## Why I created this package?

I built gotiengviet-js to solve a real need for Vietnamese users and developers: fast, accurate Vietnamese typing in any web app, without relying on browser extensions or OS-level tools. Inspired by Unikey and EVKey, this project aims for simplicity, zero dependencies, and easy integration with any framework or plain JavaScript. My goal is to make it effortless for anyone to add a modern Vietnamese typing experience to their product with just a single line of code.

## Features

- Works with all input fields and rich text editors
- Multiple input methods:
  - Telex: aa → â, aw → ă, dd → đ
  - VNI: a1 → á, a2 → à, a3 → ả
  - VIQR: 'a → á, `a → à, ?a → ả
- Zero dependencies
- TypeScript support

## Installation

```bash
npm install gotiengviet
# or
yarn add gotiengviet
# or
pnpm add gotiengviet
```

## Quick Start

Install and import VietnameseInput class:

```bash
npm install gotiengviet
```

```js
import { VietnameseInput } from 'gotiengviet';

// Recommended: Use singleton instance (auto-initializes if needed)
const vietnameseInput = VietnameseInput.getInstance({
  inputMethod: 'telex', // or 'vni', 'viqr'
  enabled: true,
});

// Clean up when done (optional, usually only for testing or SPA navigation)
VietnameseInput.destroyInstance();

// Advanced: Create a separate instance (not recommended for most apps)
// const customInput = new VietnameseInput({ inputMethod: 'vni' });
// customInput.destroy();
```


## Usage in Frameworks

```js
// React
import { useEffect } from 'react';
import { VietnameseInput } from 'gotiengviet';
function MyComponent() {
  useEffect(() => {
    const input = VietnameseInput.getInstance({ inputMethod: 'telex' });
    return () => VietnameseInput.destroyInstance();
  }, []);
  // ...
}

// Vue
import { VietnameseInput } from 'gotiengviet';
export default {
  mounted() {
    this.vietnameseInput = VietnameseInput.getInstance({ inputMethod: 'telex' });
  },
  beforeDestroy() {
    VietnameseInput.destroyInstance();
  }
}

// Angular
import { VietnameseInput } from 'gotiengviet';
export class MyComponent implements OnInit, OnDestroy {
  private vietnameseInput: VietnameseInput;

  ngOnInit() {
    this.vietnameseInput = VietnameseInput.getInstance({ inputMethod: 'telex' });
  }

  ngOnDestroy() {
    VietnameseInput.destroyInstance();
  }
}
```

## Configuration Options

You can customize the behavior when creating a new instance:

```typescript
import { VietnameseInput } from 'gotiengviet';

const input = VietnameseInput.getInstance({
  // Enable or disable Vietnamese input at startup (default: true)
  enabled: true,
  // Input method: 'telex', 'vni', or 'viqr'
  inputMethod: 'telex',
});
```

## Input Methods

### Telex

| Type    | Result | Example        |
|---------|--------|----------------|
| aa      | â      | maa → mâ      |
| aw      | ă      | taw → tă      |
| dd      | đ      | dem → đem     |
| ee      | ê      | tee → tê      |
| oo      | ô      | too → tô      |
| ow      | ơ      | mow → mơ      |
| w       | ư      | tu → tư       |

### VNI

| Type    | Result | Example        |
|---------|--------|----------------|
| a1      | á      | ba1 → bá      |
| a2      | à      | ba2 → bà      |
| a3      | ả      | ba3 → bả      |
| a4      | ã      | ba4 → bã      |
| a5      | ạ      | ba5 → bạ      |

### VIQR

| Type    | Result | Example        |
|---------|--------|----------------|
| 'a      | á      | b'a → bá      |
| `a      | à      | b`a → bà      |
| ?a      | ả      | b?a → bả      |
| ~a      | ã      | b~a → bã      |
| .a      | ạ      | b.a → bạ      |

## API Reference

### VietnameseInput Class

```typescript
import { VietnameseInput } from 'gotiengviet';


// Get the singleton instance (recommended)
const input = VietnameseInput.getInstance({ inputMethod: 'telex' });

// Check if Vietnamese input is enabled
const enabled = input.isEnabled(); // returns boolean

// Toggle Vietnamese input on/off
input.toggle();


// Clean up when done (optional)
VietnameseInput.destroyInstance();
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT License](LICENSE) © 2025 [Tran Nhat Duy](https://github.com/duydev)

## Thanks to

Inspired by [Unikey](https://www.unikey.org/), [EVKey](https://evkeyvn.com/) and other Vietnamese input methods.