import { readFile } from 'fs/promises'
import { glob, globSync } from 'glob'
import matter from 'gray-matter'
import { resolve, join } from 'path'
import slash from 'slash'
import { compile } from '@mdx-js/mdx'
import remarkFrontmatter from 'remark-frontmatter'

export const listMdxFiles = (path: string) => {
  return glob(resolve(process.cwd(), path, '**', '*.mdx'))
}

export const listMdxFilesSync = (path: string) => {
  return globSync(resolve(process.cwd(), path, '**', '*.mdx'))
}

export const transformFilePathToUrlPath = (filePath: string, path: string, alias?: string) => {
  const [, fileName] = filePath.split(path)
  if (fileName) {
    const urlPath = slash(fileName).replace('.mdx', '')

    return slash(join(alias ?? path, urlPath))
  }
  throw new Error(`Path "${path}" is not found on "${filePath}" file path.`)
}

export const getFilePathBasedOnUrl = (url: string, path: string, alias?: string) => {
  const [, slug] = url.split(`/${alias ?? path}/`)
  if (slug) {
    return resolve(process.cwd(), path, `${slug}.mdx`)
  }
  throw new Error(`Path "${alias ?? path}" is not found on "${url}" url.`)
}

export const getMdxAttributes = (content: string) => {
  const { data: attributes } = matter(content)

  return attributes
}

export const getFileContent = (path: string) => readFile(path, { encoding: 'utf-8' })

export const compileMdx = async (mdxContent: string) => {
  const compiled = await compile(mdxContent, {
    outputFormat: 'function-body',
    remarkPlugins: [remarkFrontmatter],
  })

  return String(compiled)
}
