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

const getAliases = (options: Options) => {
  if ('alias' in options && options.alias) {
    return [options.alias]
  }
  if ('aliases' in options && options.aliases) {
    return options.aliases
  }
}

const getPaths = (options: Options) =>
  'path' in options && typeof options.path === 'string' ? [options.path] : options.paths

export function init(options: Options) {
  setOptions(options)
  return {
    paths: async () => {
      const options = getOptions()
      const paths = getPaths(options)
      const aliases = getAliases(options)
      const pathsFiles = await listMdxFiles(paths)

      return pathsFiles.flatMap((pathFiles, index) => {
        return pathFiles.map(file =>
          transformFilePathToUrlPath(file, paths[index], aliases?.[index])
        )
      })
    },
  }
}

export const routesAsync = async (componentPath: string) => {
  const options = getOptions()
  const paths = getPaths(options)
  const aliases = getAliases(options)
  const pathsFiles = await listMdxFiles(paths)

  return pathsFiles.flatMap((pathFiles, index) => {
    const urlPaths = pathFiles.map(pathFile =>
      transformFilePathToUrlPath(pathFile, paths[index], aliases?.[index])
    )

    return urlPaths.map(urlPath =>
      route(urlPath, componentPath, {
        id: urlPath,
      })
    )
  })
}

export const routes = (componentPath: string) => {
  const options = getOptions()
  const paths = getPaths(options)
  const aliases = getAliases(options)
  const pathsFiles = listMdxFilesSync(paths)

  return pathsFiles.flatMap((pathFiles, index) => {
    const urlPaths = pathFiles.map(pathFile =>
      transformFilePathToUrlPath(pathFile, paths[index], aliases?.[index])
    )

    return urlPaths.map(urlPath =>
      route(urlPath, componentPath, {
        id: urlPath,
      })
    )
  })
}

export const loadMdx = async (request: Request) => {
  const options = getOptions()
  const paths = getPaths(options)
  const aliases = getAliases(options)
  const path = getFilePathBasedOnUrl(request.url, paths, aliases)
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

export const loadAllMdx = async (filterByPaths?: string[]) => {
  const options = getOptions()
  const paths = getPaths(options)
  const invalidFilters = filterByPaths?.filter(path => !paths.includes(path))
  if ((invalidFilters?.length ?? 0) > 0) {
    throw new Error(`${invalidFilters?.join(', ')} paths do not exist.`)
  }

  const pathsFiles = await listMdxFiles(
    paths.filter(
      path => !filterByPaths || filterByPaths.length === 0 || filterByPaths?.includes(path)
    )
  )

  const filesPromises = await Promise.all(
    pathsFiles.flatMap(pathFiles => {
      return pathFiles.map(async path => {
        const content = await getFileContent(path)
        const attributes = getMdxAttributes(content)
        const [fileName] = path.split('/').reverse()
        console.log('content ', content, 'attributes ', attributes, 'fileName ', fileName)
        return {
          path,
          slug: fileName.replace('.mdx', ''),
          ...attributes,
        }
      })
    })
  )
  return filesPromises
}
