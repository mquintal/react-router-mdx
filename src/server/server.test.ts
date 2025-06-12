import { describe, expect, it, jest } from '@jest/globals'
import * as utils from './utils'

jest.unstable_mockModule('./utils', async () => ({
  ...utils,
  listMdxFiles: jest.fn(),
  listMdxFilesSync: jest.fn(),
  getFileContent: jest.fn(),
  compileMdx: jest.fn(),
  getMdxAttributes: jest.fn(),
  convertMdxToHTML: jest.fn(),
}))

describe('init().path', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should return the expected list of paths', async () => {
    const { listMdxFiles } = await import('./utils')
    const { init } = await import('./server')

    jest.mocked(listMdxFiles).mockResolvedValue(['posts/some-file-a.mdx', 'posts/some-file-b.mdx'])

    expect(await init({ path: 'posts' }).paths()).toEqual([
      'posts/some-file-a',
      'posts/some-file-b',
    ])
  })

  it('should return an empty array when no mdx files were found', async () => {
    const { listMdxFiles } = await import('./utils')
    const { init } = await import('./server')

    jest.mocked(listMdxFiles).mockResolvedValue([])

    expect(await init({ path: 'posts' }).paths()).toEqual([])
  })

  it('should return the expected list of paths when an alias is provided', async () => {
    const { listMdxFiles } = await import('./utils')
    const { init } = await import('./server')

    jest.mocked(listMdxFiles).mockResolvedValue(['posts/some-file-a.mdx', 'posts/some-file-b.mdx'])

    expect(await init({ path: 'posts', alias: 'some-alias' }).paths()).toEqual([
      'some-alias/some-file-a',
      'some-alias/some-file-b',
    ])
  })

  it('should throw an exception when something goes wrong listing the mdx files', async () => {
    const { listMdxFiles } = await import('./utils')
    const { init } = await import('./server')

    jest.mocked(listMdxFiles).mockImplementation(() => {
      throw new Error('something went wrong')
    })

    expect(() => init({ path: 'posts', alias: 'some-alias' }).paths()).rejects.toThrow(
      'something went wrong'
    )
  })
})

describe('routesAsync', () => {
  beforeEach(async () => {
    const { init } = await import('./server')
    init({ path: 'posts' })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return the expected routes', async () => {
    const { listMdxFiles } = await import('./utils')
    const { routesAsync } = await import('./server')
    jest.mocked(listMdxFiles).mockResolvedValue(['posts/some-file-a.mdx', 'posts/some-file-b.mdx'])

    expect(await routesAsync('./path/to/component.tsx')).toEqual([
      expect.objectContaining({
        children: undefined,
        file: './path/to/component.tsx',
        id: 'posts/some-file-a',
        path: 'posts/some-file-a',
      }),
      expect.objectContaining({
        children: undefined,
        file: './path/to/component.tsx',
        id: 'posts/some-file-b',
        path: 'posts/some-file-b',
      }),
    ])
  })

  it('should return an empty list when no files were found', async () => {
    const { listMdxFiles } = await import('./utils')
    const { routesAsync } = await import('./server')
    jest.mocked(listMdxFiles).mockResolvedValue([])

    expect(await routesAsync('./path/to/component.tsx')).toEqual([])
  })

  it('should throw an exception when something goes wrong listing the mdx files', async () => {
    const { listMdxFiles } = await import('./utils')
    const { routesAsync } = await import('./server')

    jest.mocked(listMdxFiles).mockImplementation(() => {
      throw new Error('something went wrong')
    })

    expect(() => routesAsync('./path/to/component.tsx')).rejects.toThrow('something went wrong')
  })
})

describe('routes', () => {
  beforeEach(async () => {
    const { init } = await import('./server')
    init({ path: 'posts' })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return the expected routes', async () => {
    const { listMdxFilesSync } = await import('./utils')
    const { routes } = await import('./server')
    jest
      .mocked(listMdxFilesSync)
      .mockReturnValue(['posts/some-file-a.mdx', 'posts/some-file-b.mdx'])

    expect(routes('./path/to/component.tsx')).toEqual([
      expect.objectContaining({
        children: undefined,
        file: './path/to/component.tsx',
        id: 'posts/some-file-a',
        path: 'posts/some-file-a',
      }),
      expect.objectContaining({
        children: undefined,
        file: './path/to/component.tsx',
        id: 'posts/some-file-b',
        path: 'posts/some-file-b',
      }),
    ])
  })

  it('should return an empty list when no files were found', async () => {
    const { listMdxFilesSync } = await import('./utils')
    const { routes } = await import('./server')
    jest.mocked(listMdxFilesSync).mockReturnValue([])

    expect(routes('./path/to/component.tsx')).toEqual([])
  })

  it('should throw an exception when something goes wrong listing the mdx files', async () => {
    const { listMdxFilesSync } = await import('./utils')
    const { routes } = await import('./server')

    jest.mocked(listMdxFilesSync).mockImplementation(() => {
      throw new Error('something went wrong')
    })

    expect(() => routes('./path/to/component.tsx')).toThrow('something went wrong')
  })
})

describe('loadMdx', () => {
  beforeEach(async () => {
    const { init } = await import('./server')
    init({ path: 'posts' })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should load the mdx file based on the request path provided', async () => {
    const { getFileContent, compileMdx, getMdxAttributes } = await import('./utils')
    const { loadMdx } = await import('./server')

    const path = 'posts/path-a'
    const mdxContent = 'some content'
    const mdxCompiled = 'compiled some content'
    const mdxAttributes = { title: 'some title' }
    const html = '<p>compiled html<p>'

    jest.mocked(getFileContent).mockResolvedValue(mdxContent)
    jest.mocked(compileMdx).mockResolvedValue(mdxCompiled)
    jest.mocked(getMdxAttributes).mockReturnValue(mdxAttributes)

    const mdx = await loadMdx(new Request(`https://some.domain/${path}`))
    expect(getFileContent).toHaveBeenCalledWith(expect.stringContaining(`${path}.mdx`))
    expect(compileMdx).toHaveBeenCalledWith(mdxContent)
    expect(getMdxAttributes).toHaveBeenCalledWith(mdxContent)
    expect(mdx).toEqual({
      __raw: mdxCompiled,
      attributes: mdxAttributes,
    })
  })

  it('should reject when the url path provided is not found', async () => {
    const { loadMdx } = await import('./server')
    const url = 'https://some.domain/some-path-does-not-exist'

    expect(() => loadMdx(new Request(url))).rejects.toThrowError(
      `Path "posts" is not found on "${url}" url.`
    )
  })

  it('should reject when it could not read the mdx file', async () => {
    const { getFileContent } = await import('./utils')
    const { loadMdx } = await import('./server')
    const url = 'https://some.domain/posts/some-file'

    jest.mocked(getFileContent).mockImplementation(() => {
      throw new Error('something went wrong')
    })

    expect(() => loadMdx(new Request(url))).rejects.toThrowError('something went wrong')
  })

  it('should reject when it could not compile mdx file', async () => {
    const { getFileContent, compileMdx } = await import('./utils')
    const { loadMdx } = await import('./server')
    const url = 'https://some.domain/posts/some-file'

    jest.mocked(getFileContent).mockResolvedValue('some content')
    jest.mocked(compileMdx).mockImplementation(() => {
      throw new Error('something went wrong while compiling mdx')
    })

    expect(() => loadMdx(new Request(url))).rejects.toThrowError(
      'something went wrong while compiling mdx'
    )
  })

  it('should reject when it could not extract mdx file attributes', async () => {
    const { getFileContent, compileMdx, getMdxAttributes } = await import('./utils')
    const { loadMdx } = await import('./server')
    const url = 'https://some.domain/posts/some-file'

    jest.mocked(getFileContent).mockResolvedValue('some content')
    jest.mocked(compileMdx).mockResolvedValue('some compiled content')
    jest.mocked(getMdxAttributes).mockImplementation(() => {
      throw new Error('something went wrong while extracting mdx attributes')
    })

    expect(() => loadMdx(new Request(url))).rejects.toThrowError(
      'something went wrong while extracting mdx attributes'
    )
  })
})

describe('loadAllMdx', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('shoud list all existing mdx files', async () => {
    const { listMdxFiles, getFileContent, getMdxAttributes } = await import('./utils')
    const { loadAllMdx } = await import('./server')
    const files = ['posts/some-file-a.mdx', 'posts/some-file-b.mdx']
    const attrs = { some: 'value' }

    jest.mocked(listMdxFiles).mockResolvedValue(files)
    jest.mocked(getFileContent).mockResolvedValue('some content')
    jest.mocked(getMdxAttributes).mockReturnValue(attrs)

    expect(await loadAllMdx()).toEqual(
      files.map(path => ({
        path,
        slug: path.split('/').reverse().at(0)?.replace('.mdx', ''),
        ...attrs,
      }))
    )
  })

  it('should reject when it could not read the mdx file', async () => {
    const { getFileContent, listMdxFiles } = await import('./utils')
    const { loadAllMdx } = await import('./server')
    jest.mocked(listMdxFiles).mockResolvedValue(['posts/some-file-a.mdx', 'posts/some-file-b.mdx'])
    jest.mocked(getFileContent).mockImplementation(() => {
      throw new Error('something went wrong')
    })

    expect(() => loadAllMdx()).rejects.toThrowError('something went wrong')
  })

  it('should reject when it could not extract mdx file attributes', async () => {
    const { getFileContent, getMdxAttributes, listMdxFiles } = await import('./utils')
    const { loadAllMdx } = await import('./server')

    jest.mocked(listMdxFiles).mockResolvedValue(['posts/some-file-a.mdx', 'posts/some-file-b.mdx'])
    jest.mocked(getFileContent).mockResolvedValue('some content')
    jest.mocked(getMdxAttributes).mockImplementation(() => {
      throw new Error('something went wrong while extracting mdx attributes')
    })

    expect(() => loadAllMdx()).rejects.toThrowError(
      'something went wrong while extracting mdx attributes'
    )
  })
})
