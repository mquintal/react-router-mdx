import slash from 'slash'
import { compileSync } from '@mdx-js/mdx'
import remarkFrontmatter from 'remark-frontmatter'
import { list } from './dir'
import { read } from './file'

const compileMdx = (mdxContent: string) => {
  const compiled = compileSync(mdxContent, {
    outputFormat: 'program',
    remarkPlugins: [remarkFrontmatter],
  })

  return String(compiled)
}

export const loadPath = (path: string) => {
  const pathFiles = list(path)

  return pathFiles.map(pathFile => {
    return {
      path: slash(pathFile.replace(process.cwd(), '')).slice(1),
      content: read(pathFile),
      compiled: compileMdx(read(pathFile)),
    }
  })
}
