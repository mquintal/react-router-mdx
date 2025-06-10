import { run } from '@mdx-js/mdx'

type MDXContent = Awaited<ReturnType<typeof run>>['default']
type MDXProps = Parameters<MDXContent>[0]
export type MDXComponents = MDXProps['components']

export type Options = {
  path: string
  alias?: string
}
