/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

import fs from 'node:fs'
import path from 'node:path'
import pc from 'picocolors'
import { validateJsrExports } from './validator.ts'

/**
 * JSR `exports` field lint options.
 */
interface LintOptions {
  /**
   * The path to the `jsr.json` file.
   * This option specifies the path of the `jsr.json` file to be verified.
   * @default `${process.cwd()}/jsr.json`
   */
  jsrPath?: string
  /**
   * The validation entry for `exports` field.
   * @default {}
   */
  entries?: Record<string, string>
  /**
   * The lint current working directory.
   * @default '.''
   */
  cwd?: string
  /**
   * Whether to suppress output messages.
   * @default false
   */
  silent?: boolean
}

/**
 * Lint the `exports` field of the JSR manifest file.
 * @param options An lint options, about details, see {@link LintOptions}
 */
export async function lint({
  jsrPath = path.resolve(process.cwd(), 'jsr.json'),
  entries = {},
  cwd = '.',
  silent = false
}: LintOptions = {}): Promise<void> {
  // resolve target jsr path
  if (!fs.existsSync(jsrPath)) {
    throw new Error(`jsr manifest file not found at ${jsrPath}`)
  }

  const jsr = (await import(jsrPath, { with: { type: 'json' } }).then(
    (m: { default?: unknown }) => m.default || m
  )) as {
    exports?: Record<string, string>
  }
  if (!jsr.exports) {
    error(pc.dim('No jsr.exports found in jsr.json'))
    process.exit(1)
  }

  const startTime = performance.now()
  const result = validateJsrExports(entries, jsr.exports, cwd)
  const endTime = performance.now()

  const messages = [] as string[]
  for (const [_, value] of Object.entries(result)) {
    if (typeof value === 'string') {
      messages.push(value)
    }
  }

  if (messages.length > 0) {
    for (const msg of messages) {
      console.log('')
      error(pc.whiteBright(msg))
      console.log('')
    }
    process.exit(1)
  } else {
    if (!silent) {
      console.log(
        pc.green('✔'),
        'No JSR exports issues found',
        pc.dim(`(${(endTime - startTime).toFixed(2)}ms)`)
      )
    }
  }
}

function error(message: string) {
  console.error(pc.bgRed(pc.black(' ERROR ')), message)
}
