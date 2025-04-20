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
    if (key === 'index') {
      if (jsr['.']) {
        result['.'] =
          jsr['.'] === `./${value}`
            ? true
            : `jsr.exports["."] is ./${value}, but it does not exist in jsr file.`
      } else {
        result['.'] = `jsr.exports["."] does not define.`
      }
    } else {
      if (jsr[`./${key}`]) {
        result[`./${key}`] =
          jsr[`./${key}`] === `./${value}`
            ? true
            : `jsr.exports["./${key}"] is ./${value}, but it does not exist in jsr file.`
      } else {
        result[`./${key}`] = `jsr.exports["./${key}"] does not define.`
      }
    }
  }

  return result
}
