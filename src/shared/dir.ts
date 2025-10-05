import { globSync } from 'glob'
import { resolve } from 'path'

export const list = (path: string) => {
  return globSync(resolve(process.cwd(), path, '**', '*.mdx'), { windowsPathsNoEscape: true })
}
