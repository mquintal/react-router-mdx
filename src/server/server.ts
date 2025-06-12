import { route } from '@react-router/dev/routes'
import {
  getMdxAttributes,
  getFilePathBasedOnUrl,
  compileMdx,
  listMdxFiles,
  transformFilePathToUrlPath,
  getFileContent,
  listMdxFilesSync,
} from './utils'
import type { Options } from './types'
import { getOptions, setOptions } from './options'

export function init(options: Options) {
  setOptions(options)
  return {
    paths: async () => {
      const files = await listMdxFiles(options.path || './')

      return Promise.all(
        files.map(file => transformFilePathToUrlPath(file, options.path, options.alias))
      )
    },
  }
}

export const routesAsync = async (componentPath: string) => {
  const options = getOptions()
  const files = await listMdxFiles(options.path || './')

  return files.map(file => {
    const path = transformFilePathToUrlPath(file, options.path, options.alias)

    return route(path, componentPath, {
      id: path,
    })
  })
}

export const routes = (componentPath: string) => {
  const options = getOptions()
  const files = listMdxFilesSync(options.path || './')

  return files.map(file => {
    const path = transformFilePathToUrlPath(file, options.path, options.alias)

    return route(path, componentPath, {
      id: path,
    })
  })
}

export const loadMdx = async (request: Request) => {
  const options = getOptions()
  const path = getFilePathBasedOnUrl(request.url, options.path, options.alias)
  const content = await getFileContent(path)
  const [mdxContent, attributes] = await Promise.all([
    compileMdx(content),
    getMdxAttributes(content),
  ])

  return {
    __raw: mdxContent,
    attributes,
  }
}

export const loadAllMdx = async () => {
  const options = getOptions()
  const files = await listMdxFiles(options.path || './')

  return Promise.all(
    files.map(async path => {
      const content = await getFileContent(path)
      const attributes = getMdxAttributes(content)
      const [fileName] = path.split('/').reverse()

      return {
        path,
        slug: fileName.replace('.mdx', ''),
        ...attributes,
      }
    })
  )
}
