import { describe, expect, test } from 'vitest'
import { validateJsrExports } from './validator.ts'

describe('simple', () => {
  test('success', () => {
    const entries = {
      index: '/path/to/project/src/index.ts',
      foo: '/path/to/project/src/foo.ts'
    }
    const jsr = {
      '.': './src/index.ts',
      './foo': './src/foo.ts'
    }

    const result = validateJsrExports(entries, jsr, '/path/to/project')
    expect(result['.']).toEqual(true)
    expect(result['./foo']).toEqual(true)
  })

  test('not define "."', () => {
    const entries = {
      index: '/path/to/project/src/index.ts',
      foo: '/path/to/project/src/foo.ts'
    }
    const jsr = {
      './foo': './src/foo.ts'
    }

    const result = validateJsrExports(entries, jsr, '/path/to/project')
    expect(result['.']).toEqual('jsr.exports["."] does not define.')
    expect(result['./foo']).toEqual(true)
  })

  test('wrong "." value', () => {
    const entries = {
      index: '/path/to/project/src/index.ts',
      foo: '/path/to/project/src/foo.ts'
    }
    const jsr = {
      '.': './src/foo.ts',
      './foo': './src/foo.ts'
    }

    const result = validateJsrExports(entries, jsr, '/path/to/project')
    expect(result['.']).toEqual(
      `jsr.exports["."] is ./src/foo.ts, but it's miss-matched in your tsdown entry.`
    )
    expect(result['./foo']).toEqual(true)
  })
})

describe('nest', () => {
  test('success', () => {
    const entries = {
      index: '/path/to/project/src/index.ts',
      'foo/index': '/path/to/project/src/foo/index.ts',
      'foo/bar': '/path/to/project/src/foo/bar.ts'
    }
    const jsr = {
      '.': './src/index.ts',
      './foo/index': './src/foo/index.ts',
      './foo/bar': './src/foo/bar.ts'
    }

    const result = validateJsrExports(entries, jsr, '/path/to/project')
    expect(result['.']).toEqual(true)
    expect(result['./foo/index']).toEqual(true)
    expect(result['./foo/bar']).toEqual(true)
  })

  test('not define "./foo/bar"', () => {
    const entries = {
      index: '/path/to/project/src/index.ts',
      'foo/index': '/path/to/project/src/foo/index.ts',
      'foo/bar': '/path/to/project/src/foo/bar.ts'
    }
    const jsr = {
      '.': './src/index.ts',
      './foo/index': './src/foo/index.ts'
    }

    const result = validateJsrExports(entries, jsr, '/path/to/project')
    expect(result['.']).toEqual(true)
    expect(result['./foo/index']).toEqual(true)
    expect(result['./foo/bar']).toEqual(`jsr.exports["./foo/bar"] does not define.`)
  })

  test('wrong "./foo/bar" value', () => {
    const entries = {
      index: '/path/to/project/src/index.ts',
      'foo/index': '/path/to/project/src/foo/index.ts',
      'foo/bar': '/path/to/projoect/src/foo/bar.ts'
    }
    const jsr = {
      '.': './src/index.ts',
      './foo/index': './src/foo/index.ts',
      './foo/bar': 'src/foo/baz.ts'
    }

    const result = validateJsrExports(entries, jsr, '/path/to/project')
    expect(result['.']).toEqual(true)
    expect(result['./foo/index']).toEqual(true)
    expect(result['./foo/bar']).toEqual(
      `jsr.exports["./foo/bar"] is src/foo/baz.ts, but it's miss-matched in your tsdown entry.`
    )
  })

  test('multi wrong', () => {
    const entries = {
      index: '/path/to/project/src/index.ts',
      'foo/index': '/path/to/project/src/foo/index.ts',
      'foo/bar': '/path/to/project/src/foo/bar.ts'
    }
    const jsr = {}
    const result = validateJsrExports(entries, jsr, '/path/to/project')
    expect(result['.']).toEqual(`jsr.exports["."] does not define.`)
    expect(result['./foo/index']).toEqual(`jsr.exports["./foo/index"] does not define.`)
    expect(result['./foo/bar']).toEqual(`jsr.exports["./foo/bar"] does not define.`)
  })
})
