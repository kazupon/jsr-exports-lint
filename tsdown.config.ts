import { defineConfig } from 'tsdown'

const config: ReturnType<typeof defineConfig> = defineConfig({
  entry: ['./src/index.ts'],
  clean: true,
  outDir: 'dist',
  publint: true,
  dts: true
})

export default config
