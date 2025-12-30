import type { KnipConfig } from 'knip'

export default {
  // entry: [],
  ignoreDependencies: [
    'lint-staged',
    'tsdown',
    'unbuild',
    '@kazupon/eslint-plugin',
    '@kazupon/prettier-config'
  ]
} satisfies KnipConfig
