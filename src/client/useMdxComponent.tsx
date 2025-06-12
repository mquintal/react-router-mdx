import { useLoaderData } from 'react-router'
import { runSync } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { MDXProvider } from '@mdx-js/react'
import type { LoadData } from './types'

type MDXContent = ReturnType<typeof runSync>['default']
type MDXProps = Parameters<MDXContent>[0]
type MDXComponents = MDXProps['components']

export const useMdxComponent = <T extends MDXComponents>(components: T) => {
  const { attributes, __raw } = useLoaderData<LoadData>()
  const { default: Component } = runSync(__raw, { ...runtime, baseUrl: import.meta.url })

  return () => (
    <MDXProvider>
      <Component components={components} {...attributes} />
    </MDXProvider>
  )
}
