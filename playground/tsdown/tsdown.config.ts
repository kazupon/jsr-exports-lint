import { lintJsrExports } from 'jsr-exports-lint/tsdown'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/array/index.ts', './src/utils.ts'],
  clean: true,
  outDir: 'dist',
  dts: true,
  fixedExtension: false,
  hooks: {
    'build:done': lintJsrExports()
  }
})
