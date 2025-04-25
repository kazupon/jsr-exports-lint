import { lintJsrExports } from 'jsr-exports-lint/tsdown'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/utils.ts'],
  hooks: {
    'build:done': lintJsrExports()
  }
})
