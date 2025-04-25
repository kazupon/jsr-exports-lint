import { lintJsrExports } from 'tsdown-jsr-exports-lint/unbuild'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index', './src/utils'],
  declaration: true,
  hooks: {
    'build:done': lintJsrExports()
  }
})
