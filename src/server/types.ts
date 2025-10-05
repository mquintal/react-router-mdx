import { run } from '@mdx-js/mdx'
export { Options } from '../shared/types'

type MDXContent = Awaited<ReturnType<typeof run>>['default']
type MDXProps = Parameters<MDXContent>[0]
export type MDXComponents = MDXProps['components']

export {}

declare global {
  var __REACT_ROUTER_MDX_SSR_COMPONENT__: MDXContent | undefined
}
