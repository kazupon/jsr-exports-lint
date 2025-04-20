/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

export function validateJsrExports(
  entries: Record<string, string>,
  jsr: Record<string, string>
): Record<string, string | true> {
  const result: Record<string, string | true> = {}

  for (const [key, value] of Object.entries(entries)) {
    const exportKey = key === 'index' ? '.' : `./${key}`
    if (jsr[exportKey]) {
      result[exportKey] =
        jsr[exportKey] === `./${value}`
          ? true
          : `jsr.exports["${exportKey}"] is ./${value}, but it does not exist in jsr file.`
    } else {
      result[exportKey] = `jsr.exports["${exportKey}"] does not define.`
    }
  }

  return result
}
