import {
  comments,
  defineConfig,
  jsonc,
  markdown,
  typescript,
  oxlint,
  yaml
} from '@kazupon/eslint-config'

const config: ReturnType<typeof defineConfig> = defineConfig(
  comments({ kazupon: false }),
  typescript({
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
      project: true
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
  markdown({ preferences: true }),
  oxlint({
    presets: ['typescript'],
    configFile: './.oxlintrc.json'
  })
)

export default config
