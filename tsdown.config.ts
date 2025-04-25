import { defineConfig } from 'tsdown'

const config: ReturnType<typeof defineConfig> = defineConfig({
  entry: ['./src/index.ts', './src/tsdown.ts', './src/unbuild.ts'],
  clean: true,
  outDir: 'dist',
  publint: true,
  dts: true
})

export default config
