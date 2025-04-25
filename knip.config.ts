import type { KnipConfig } from 'knip'

export default {
  entry: [
    'src/index.ts',
    'src/tsdown.ts',
    'src/unbuild.ts',
    'eslint.config.ts',
    'tsdown.config.ts',
    'playground/tsdown/tsdown.config.ts'
  ],

  ignoreDependencies: ['lint-staged', 'tsdown', 'unbuild']
} satisfies KnipConfig
