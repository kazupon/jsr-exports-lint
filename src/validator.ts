/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

import path from 'node:path'

export function validateJsrExports(
  entries: Record<string, string>,
  jsr: Record<string, string>,
  cwd = '.'
): Record<string, string | true> {
  const result: Record<string, string | true> = {}

  for (const [key, value] of Object.entries(entries)) {
    const exportKey = key === 'index' ? '.' : `./${key}`
    const resolvedValue = path.isAbsolute(value) ? value : path.resolve(cwd, value)
    if (jsr[exportKey]) {
      result[exportKey] =
        path.resolve(cwd, jsr[exportKey]) === resolvedValue
          ? true
          : `jsr.exports["${exportKey}"] is ${jsr[exportKey]}, but it's miss-matched in your tsdown entry.`
    } else {
      result[exportKey] = `jsr.exports["${exportKey}"] does not define.`
    }
  }

  return result
}
