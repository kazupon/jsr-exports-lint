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
    // barrel file (foo/index) uses shortened form (./foo) by default
    expect(result['./foo']).toEqual(`jsr.exports["./foo"] does not define.`)
    expect(result['./foo/bar']).toEqual(`jsr.exports["./foo/bar"] does not define.`)
  })
})

describe('relative path', () => {
  test('success', () => {
    const entries = {
      index: './src/index.ts',
      'foo/index': './src/foo/index.ts',
      'foo/bar': './src/foo/bar.ts'
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

  test('fail', () => {
    const entries = {
      index: './src/index.ts',
      'foo/index': './src/foo/index.ts',
      'foo/bar': './src/foo/bar.ts'
    }
    const jsr = {}
    const result = validateJsrExports(entries, jsr, '/path/to/project')
    expect(result['.']).toEqual(`jsr.exports["."] does not define.`)
    // barrel file (foo/index) uses shortened form (./foo) by default
    expect(result['./foo']).toEqual(`jsr.exports["./foo"] does not define.`)
    expect(result['./foo/bar']).toEqual(`jsr.exports["./foo/bar"] does not define.`)
  })
})

describe('barrel file (index.ts)', () => {
  test('success: entry "array/index" matches jsr exports "./array"', () => {
    const entries = {
      index: '/path/to/project/src/index.ts',
      'array/index': '/path/to/project/src/array/index.ts',
      utils: '/path/to/project/src/utils.ts'
    }
    const jsr = {
      '.': './src/index.ts',
      './array': './src/array/index.ts',
      './utils': './src/utils.ts'
    }

    const result = validateJsrExports(entries, jsr, '/path/to/project')
    expect(result['.']).toEqual(true)
    expect(result['./array']).toEqual(true)
    expect(result['./utils']).toEqual(true)
  })

  test('success: nested barrel file "foo/bar/index" matches jsr exports "./foo/bar"', () => {
    const entries = {
      index: '/path/to/project/src/index.ts',
      'foo/bar/index': '/path/to/project/src/foo/bar/index.ts'
    }
    const jsr = {
      '.': './src/index.ts',
      './foo/bar': './src/foo/bar/index.ts'
    }

    const result = validateJsrExports(entries, jsr, '/path/to/project')
    expect(result['.']).toEqual(true)
    expect(result['./foo/bar']).toEqual(true)
  })

  test('not define: barrel file entry without corresponding jsr exports', () => {
    const entries = {
      index: '/path/to/project/src/index.ts',
      'array/index': '/path/to/project/src/array/index.ts'
    }
    const jsr = {
      '.': './src/index.ts'
    }

    const result = validateJsrExports(entries, jsr, '/path/to/project')
    expect(result['.']).toEqual(true)
    expect(result['./array']).toEqual(`jsr.exports["./array"] does not define.`)
  })

  test('wrong value: barrel file entry with mismatched jsr exports value', () => {
    const entries = {
      index: '/path/to/project/src/index.ts',
      'array/index': '/path/to/project/src/array/index.ts'
    }
    const jsr = {
      '.': './src/index.ts',
      './array': './src/other/index.ts'
    }

    const result = validateJsrExports(entries, jsr, '/path/to/project')
    expect(result['.']).toEqual(true)
    expect(result['./array']).toEqual(
      `jsr.exports["./array"] is ./src/other/index.ts, but it's miss-matched in your tsdown entry.`
    )
  })

  test('success: mix of barrel and non-barrel entries', () => {
    const entries = {
      index: '/path/to/project/src/index.ts',
      'components/index': '/path/to/project/src/components/index.ts',
      'utils/helpers': '/path/to/project/src/utils/helpers.ts',
      'types/index': '/path/to/project/src/types/index.ts'
    }
    const jsr = {
      '.': './src/index.ts',
      './components': './src/components/index.ts',
      './utils/helpers': './src/utils/helpers.ts',
      './types': './src/types/index.ts'
    }

    const result = validateJsrExports(entries, jsr, '/path/to/project')
    expect(result['.']).toEqual(true)
    expect(result['./components']).toEqual(true)
    expect(result['./utils/helpers']).toEqual(true)
    expect(result['./types']).toEqual(true)
  })
})
