import { defineConfig } from 'tsdown'
import { lintJsrExports } from 'tsdown-jsr-exports-lint/tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/utils.ts'],
  hooks: {
    'build:done': lintJsrExports()
  }
})
