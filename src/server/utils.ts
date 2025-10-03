import { readFile } from 'fs/promises'
import { glob, globSync } from 'glob'
import { resolve, join } from 'path'
import slash from 'slash'

export const listMdxFiles = (paths: string[]) => {
  const allFilesPromises = paths.map(async (path: string) => {
    return glob(resolve(process.cwd(), path, '**', '*.mdx'), { windowsPathsNoEscape: true })
  })

  return Promise.all(allFilesPromises)
}

export const listMdxFilesSync = (paths: string[]) => {
  return paths.map(path =>
    globSync(resolve(process.cwd(), path, '**', '*.mdx'), { windowsPathsNoEscape: true })
  )
}

export const transformFilePathToUrlPath = (filePath: string, path: string, alias?: string) => {
  const [, fileName] = filePath.split(path)
  if (fileName) {
    const urlPath = slash(fileName).replace('.mdx', '')

    return slash(join(alias ?? path, urlPath))
  }
  throw new Error(`Path "${path}" is not found on "${filePath}" file path.`)
}

export const getFilePathBasedOnUrl = (url: string, paths: string[], aliases?: string[]) => {
  const finalPaths = paths.map((path, index) => aliases?.[index] ?? path)
  const foundPath = finalPaths.find(path => url.includes(`/${path}/`))
  const foundPathIndex = finalPaths.findIndex(path => url.includes(`/${path}/`))

  if (foundPath) {
    const [, slug] = url.split(`/${foundPath}/`)
    if (slug) {
      return resolve(process.cwd(), paths[foundPathIndex], `${slug}.mdx`)
    }
  }
  throw new Error(`Path(s) ${finalPaths.join(', ')} were not found on "${url}" url.`)
}

export const getFileContent = (path: string) => readFile(path, { encoding: 'utf-8' })
