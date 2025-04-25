/**
 * An entry for unbuild hooks
 *
 * @example
 * ```js
 * import { lintJsrExports } from 'jsr-exports-lint/unbuild'
 * ```
 *
 * @module
 */

/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

import fs from 'node:fs'
import { lint } from './lint.ts'

import type { BuildContext } from 'unbuild'

const EXTENSIONS = ['.ts', '.js', '.mts', '.mjs', '.cts', '.cjs', '.tsx', '.jsx']

/**
 * Lint `exports` field of JSR manifest file for unbuild hooks
 * @param jsrPath The path to the `jsr.json` file.
 * @returns A unbuild hook
 */
export function lintJsrExports(jsrPath?: string): (ctx: BuildContext) => void | Promise<void> {
  return async (ctx: BuildContext): Promise<void> => {
    await lint({
      jsrPath,
      entries: normalizeEntries(ctx),
      silent: false
    })
  }
}

function normalizeEntries(ctx: BuildContext): Record<string, string> {
  const ctxEntries = ctx.options.entries.filter(entry => entry.builder === 'rollup' && entry.name)
  const entries: Record<string, string> = Object.create(null)
  for (const entry of ctxEntries) {
    const ext = EXTENSIONS.find(ext => fs.existsSync(`${entry.input}${ext}`))
    if (!ext) {
      throw new Error(`No entry found for ${entry.input}`)
    }
    const entryPath = entry.input.split(ctx.options.rootDir)[1]
    entries[entry.name!] = `${entryPath}${ext}`
  }
  return entries
}
