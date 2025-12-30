import type { KnipConfig } from 'knip'

export default {
  // entry: [],
  workspaces: {
    'playground/*': {
      ignore: ['src/array/index.ts']
    }
  },
  ignoreDependencies: [
    'lint-staged',
    'tsdown',
    'unbuild',
    '@kazupon/eslint-plugin',
    '@kazupon/prettier-config'
  ]
} satisfies KnipConfig
