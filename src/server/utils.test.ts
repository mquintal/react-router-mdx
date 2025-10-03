import { describe, expect, it } from '@jest/globals'
import { transformFilePathToUrlPath, getFilePathBasedOnUrl } from './utils'

describe('transformFilePathToUrlPath', () => {
  it('should return the expected url path when no alias is provided', async () => {
    expect(
      await transformFilePathToUrlPath('/root/path/to/project/posts/hello-world.mdx', 'posts')
    ).toBe('posts/hello-world')
  })

  it('should return the expected url path when an alias is provided', async () => {
    expect(
      await transformFilePathToUrlPath(
        '/root/path/to/project/posts/hello-world.mdx',
        'posts',
        'some-alias'
      )
    ).toBe('some-alias/hello-world')
  })

  it('should reject with the expected error when the path provided is incorrect', () => {
    expect(() =>
      transformFilePathToUrlPath(
        '/root/path/to/project/posts/hello-world.mdx',
        'some-incorrect-path'
      )
    ).toThrow(`Path "some-incorrect-path" is not found on`)
  })
})

describe('getFilePathBasedOnUrl', () => {
  it('should return the expected file path when no alias is provided', () => {
    expect(getFilePathBasedOnUrl('https://some.url/posts/some-slug', ['posts'])).toContain(
      'react-router-mdx/posts/some-slug.mdx'
    )
  })

  it('should return the expected file path when an alias is provided', () => {
    expect(
      getFilePathBasedOnUrl('https://some.url/some-alias/some-slug', ['posts'], ['some-alias'])
    ).toContain('react-router-mdx/posts/some-slug.mdx')
  })

  it('should throw an exception whrn an incorrect path is provided', () => {
    expect(() =>
      getFilePathBasedOnUrl('https://some.url/posts/some-slug', ['some-incorrect-path'])
    ).toThrow(
      'Path(s) some-incorrect-path were not found on "https://some.url/posts/some-slug" url.'
    )
  })

  it('should throw an exception whrn an incorrect alias is provided', () => {
    expect(() =>
      getFilePathBasedOnUrl(
        'https://some.url/some-alias/some-slug',
        ['posts'],
        ['some-incorrect-alias']
      )
    ).toThrow(
      'Path(s) some-incorrect-alias were not found on "https://some.url/some-alias/some-slug" url.'
    )
  })
})
