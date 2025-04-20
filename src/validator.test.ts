import { describe, expect, test } from 'vitest'
import { validateJsrExports } from './validator.ts'

describe('simple', () => {
  test('success', () => {
    const entries = {
      index: 'src/index.ts',
      foo: 'src/foo.ts'
    }
    const jsr = {
      '.': './src/index.ts',
      './foo': './src/foo.ts'
    }

    const result = validateJsrExports(entries, jsr)
    expect(result['.']).toEqual(true)
    expect(result['./foo']).toEqual(true)
  })

  test('not define "."', () => {
    const entries = {
      index: 'src/index.ts',
      foo: 'src/foo.ts'
    }
    const jsr = {
      './foo': './src/foo.ts'
    }

    const result = validateJsrExports(entries, jsr)
    expect(result['.']).toEqual('jsr.exports["."] does not define.')
    expect(result['./foo']).toEqual(true)
  })

  test('wrong "." value', () => {
    const entries = {
      index: 'src/index.ts',
      foo: 'src/foo.ts'
    }
    const jsr = {
      '.': './src/foo.ts',
      './foo': './src/foo.ts'
    }

    const result = validateJsrExports(entries, jsr)
    expect(result['.']).toEqual(
      'jsr.exports["."] is ./src/index.ts, but it does not exist in jsr file.'
    )
    expect(result['./foo']).toEqual(true)
  })
})

describe('nest', () => {
  test('success', () => {
    const entries = {
      index: 'src/index.ts',
      'foo/index': 'src/foo/index.ts',
      'foo/bar': 'src/foo/bar.ts'
    }
    const jsr = {
      '.': './src/index.ts',
      './foo/index': './src/foo/index.ts',
      './foo/bar': './src/foo/bar.ts'
    }

    const result = validateJsrExports(entries, jsr)
    expect(result['.']).toEqual(true)
    expect(result['./foo/index']).toEqual(true)
    expect(result['./foo/bar']).toEqual(true)
  })

  test('not define "./foo/bar"', () => {
    const entries = {
      index: 'src/index.ts',
      'foo/index': 'src/foo/index.ts',
      'foo/bar': 'src/foo/bar.ts'
    }
    const jsr = {
      '.': './src/index.ts',
      './foo/index': './src/foo/index.ts'
    }

    const result = validateJsrExports(entries, jsr)
    expect(result['.']).toEqual(true)
    expect(result['./foo/index']).toEqual(true)
    expect(result['./foo/bar']).toEqual(`jsr.exports["./foo/bar"] does not define.`)
  })

  test('wroing "./foo/bar" value', () => {
    const entries = {
      index: 'src/index.ts',
      'foo/index': 'src/foo/index.ts',
      'foo/bar': 'src/foo/bar.ts'
    }
    const jsr = {
      '.': './src/index.ts',
      './foo/index': './src/foo/index.ts',
      './foo/bar': 'src/foo/baz.ts'
    }

    const result = validateJsrExports(entries, jsr)
    expect(result['.']).toEqual(true)
    expect(result['./foo/index']).toEqual(true)
    expect(result['./foo/bar']).toEqual(
      `jsr.exports["./foo/bar"] is ./src/foo/bar.ts, but it does not exist in jsr file.`
    )
  })

  test('multi wrong', () => {
    const entries = {
      index: 'src/index.ts',
      'foo/index': 'src/foo/index.ts',
      'foo/bar': 'src/foo/bar.ts'
    }
    const jsr = {}
    const result = validateJsrExports(entries, jsr)
    expect(result['.']).toEqual(`jsr.exports["."] does not define.`)
    expect(result['./foo/index']).toEqual(`jsr.exports["./foo/index"] does not define.`)
    expect(result['./foo/bar']).toEqual(`jsr.exports["./foo/bar"] does not define.`)
  })
})
