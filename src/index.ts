/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

import type { defineConfig } from 'tsdown'
import type { UnionToTuple } from './types.ts'

type ArrayrableUserConfig = Parameters<typeof defineConfig>[0]
type UserConfig = UnionToTuple<ArrayrableUserConfig>[0]
type onSuccessHandler = NonNullable<UserConfig['onSuccess']>

/**
 * JSR `exports` fileld lint options.
 */
export interface JsrExportsLintOptions {
  /**
   * The path to the `jsr.json` file.
   * This option specifies the path of the `jsr.json` file to be verified.
   */
  jsrPath?: string
}

export function jsrExportsLint({ jsrPath }: JsrExportsLintOptions): onSuccessHandler {
  console.log('jsrPath', jsrPath)
  // TODO: normalize jsrJsonPath

  return async (config): Promise<void> => {
    const _entry = config.entry

    if (jsrPath) {
      // TODO:
    }
  }
}
