import {
  comments,
  defineConfig,
  imports,
  javascript,
  jsonc,
  markdown,
  prettier,
  promise,
  typescript,
  unicorn,
  vitest,
  yaml
} from '@kazupon/eslint-config'
import { globalIgnores } from 'eslint/config'

const config: ReturnType<typeof defineConfig> = defineConfig(
  javascript(),
  imports({
    typescript: true,
    rules: {
      'import/extensions': ['error', 'always', { ignorePackages: true }]
    }
  }),
  comments({
    kazupon: {
      ignores: ['**/*.test.ts', '**/*.spec.ts']
    }
  }),
  promise(),
  unicorn({
    rules: {
      'unicorn/prevent-abbreviations': 'off'
    }
  }),
  typescript({
    parserOptions: {
      tsconfigRootDir: import.meta.dirname
    }
  }),
  jsonc({
    json: true,
    json5: true,
    jsonc: true,
    prettier: true
  }),
  yaml({
    prettier: true
  }),
  markdown({
    rules: {
      'import/extensions': 'off'
    }
  }),
  vitest(),
  prettier(),
  // @ts-expect-error -- FIXME
  globalIgnores(['.vscode', '**/dist/**', 'tsconfig.json', 'pnpm-lock.yaml'])
)

export default config
