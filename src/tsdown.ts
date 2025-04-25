/**
 * An entry for tsdown hooks
 * @module
 */

/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

import { lint } from './lint.ts'

import type { BuildContext } from 'tsdown'

/**
 * Lint `exports` field of JSR manifest file for tsdown hooks
 * @param jsrPath The path to the `jsr.json` file.
 * @returns A tsdown hook
 */
export function lintJsrExports(jsrPath?: string): (ctx: BuildContext) => void | Promise<void> {
  return async (ctx: BuildContext): Promise<void> => {
    console.log('lintJsrExports', ctx.options.entry)
    await lint({
      jsrPath,
      entries: ctx.options.entry as Record<string, string>,
      silent: ctx.options.silent ?? false
    })
  }
}
