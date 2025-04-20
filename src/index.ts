/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

import fs from 'node:fs'
import path from 'node:path'
import pc from 'picocolors'
import { validateJsrExports } from './validator.ts'

import type { defineConfig } from 'tsdown'
import type { UnionToTuple } from './types.ts'

type ArrayrableUserConfig = Parameters<typeof defineConfig>[0]
type UserConfig = UnionToTuple<ArrayrableUserConfig>[0]
type onSuccessHandler = NonNullable<UserConfig['onSuccess']>

/**
 * JSR `exports` field lint options.
 */
export interface JsrExportsLintOptions {
  /**
   * The path to the `jsr.json` file.
   * This option specifies the path of the `jsr.json` file to be verified.
   */
  jsrPath?: string
}

/**
 * Lint the `exports` field of the JSR manifest file.
 * @param jsrPath The path to the `jsr.json` file.
 * @returns A handler for tsdown's `onSuccess` option.
 */
export function jsrExportsLint(jsrPath?: string): onSuccessHandler {
  // resolve target jsr path
  const targetJsrPath = jsrPath ?? path.resolve(process.cwd(), 'jsr.json')
  if (!fs.existsSync(targetJsrPath)) {
    throw new Error(`jsr manifest file not found at ${targetJsrPath}`)
  }

  return async (config): Promise<void> => {
    const jsr = (await import(targetJsrPath, { with: { type: 'json' } }).then(
      m => m.default || m
    )) as { exports?: Record<string, string> }
    if (!jsr.exports) {
      error(pc.dim('No jsr.exports found in jsr.json'))
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1)
    }

    const result = validateJsrExports(config.entry as Record<string, string>, jsr.exports)

    const messages = [] as string[]
    for (const [_, value] of Object.entries(result)) {
      if (typeof value === 'string') {
        messages.push(value)
      }
    }

    if (messages.length > 0) {
      for (const msg of messages) {
        console.log('')
        error(msg)
        console.log('')
      }
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1)
    } else {
      if (!config.silent) {
        console.log(pc.green('✔'), 'No JSR exports issues found')
      }
    }
  }
}

export function error(message: string) {
  console.error(pc.bgRed(pc.black(' ERROR ')), message)
}
