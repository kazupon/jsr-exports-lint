# jsr-exports-lint

> JSR exports field lint with bundler

## 🐱 Motivation

- In [`tsdown`](https://tsdown.dev/), When `publint` option is enabled on tsdown.config, tsdown will lint the `exports` field in `package.json` using `publint`.
- However, `publint` currently does not lint the `exports` in package manifest files like JSR's `jsr.json`.
- Linting for `jsr.json` may be niche, but for those like me who distribute library packages via both npm and JSR, this lint is necessary.

## 💿 Installation

```sh
# npm
npm install --save-dev jsr-exports-lint

## pnpm
pnpm add -D jsr-exports-lint

## yarn
yarn add -D jsr-exports-lint

## bum
bun add -D jsr-exports-lint
```

## 🚀 Usage

### tsdown

```js
import { defineConfig } from 'tsdown'
import { lintJsrExports } from 'jsr-exports-lint/tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/features/feature1.ts', './src/features/feature2.ts'],
  publint: true,
  dts: true,
  hooks: {
    'build:done': lintJsrExports() // or put your jsr.json path (e.g. `lintJsrExports('/path/to/your/projects/project/jsr.json')`)
  }
})
```

### unbuild

```js
import { defineBuildConfig } from 'unbuild'
import { lintJsrExports } from 'jsr-exports-lint/unbuild'

export default defineBuildConfig({
  entries: ['./src/index.ts', './src/features/feature1.ts', './src/features/feature2.ts'],
  declaration: true,
  hooks: {
    'build:done': lintJsrExports() // or put your jsr.json path (e.g. `lintJsrExports('/path/to/your/projects/project/jsr.json')`)
  }
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
