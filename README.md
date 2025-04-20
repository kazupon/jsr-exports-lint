# tsdown-jsr-exports-lint

> JSR exports field lint with tsdown

## 🐱 Motivation

- When `publint` option is enabled on tsdown.config, tsdown will lint the `exports` field in `package.json` using `publint`.
- However, `publint` currently does not lint the `exports` in package manifest files like JSR's `jsr.json`.
- Linting for `jsr.json` may be niche, but for those like me who distribute library packages via both npm and JSR, this lint is necessary.

## 💿 Installation

```sh
# npm
npm install --save-dev tsdown-jsr-exports-lint

## pnpm
pnpm add -D tsdown-jsr-exports-lint

## yarn
yarn add -D tsdown-jsr-exports-lint

## bum
bun add -D tsdown-jsr-exports-lint
```

## 🚀 Usage

```js
import { defineConfig } from 'tsdown'
import { jsrExportsLint } from 'tsdown-jsr-exports-lint'

export default defineConfig({
  entry: ['./src/index.ts', './src/features/feature1.ts', './src/features/feature2.ts'],
  publint: true,
  dts: true,
  // lint via `onSuccess` option
  onSuccess: jsrExportsLint() // or put your jsr.json path (e.g. `jsrExportsLint('/path/to/your/projects/project/jsr.json')`)
})
```

## 🤝 Sponsors

The development of Gunish is supported by my OSS sponsors!

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/kazupon/sponsors/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/kazupon/sponsors/sponsors.svg'/>
  </a>
</p>

## ©️ License

[MIT](http://opensource.org/licenses/MIT)
