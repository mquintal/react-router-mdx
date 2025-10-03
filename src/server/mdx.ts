import matter from 'gray-matter'
import { compile as compileMdx } from '@mdx-js/mdx'
import remarkFrontmatter from 'remark-frontmatter'

type Options = Pick<
  NonNullable<Parameters<typeof compileMdx>[1]>,
  'recmaPlugins' | 'rehypePlugins' | 'remarkPlugins' | 'remarkRehypeOptions'
>

export const compile = async (content: string, options?: Options) => {
  const compiled = await compileMdx(content, {
    ...(options ?? {}),
    outputFormat: 'function-body',
    remarkPlugins: [remarkFrontmatter, ...(options?.remarkPlugins ?? [])],
  })

  return String(compiled)
}

export const getAttributes = (content: string) => {
  const { data: attributes } = matter(content)

  return attributes
}
