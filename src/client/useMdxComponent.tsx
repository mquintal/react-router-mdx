import { useLoaderData } from 'react-router'
import { useState, useEffect, useMemo } from 'react'
import { run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { MDXProvider } from '@mdx-js/react'
import type { LoadData } from './types'

type MDXContent = Awaited<ReturnType<typeof run>>['default']
type MDXProps = Parameters<MDXContent>[0]
type MDXComponents = MDXProps['components']

type Options = {
  rootClass?: string
}

const defaultRootClass = 'generated-article'

export const useMdxComponent = <T extends MDXComponents>(components: T, options?: Options) => {
  const { attributes, html } = useLoaderData<LoadData>()
  const Hydrated = useHydrate()

  const Component = useMemo(() => {
    return Hydrated
      ? () => (
          <article className={options?.rootClass ?? defaultRootClass}>
            <Hydrated components={components} {...attributes} />
          </article>
        )
      : () => (
          <article
            className={options?.rootClass ?? defaultRootClass}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )
  }, [options?.rootClass, html])

  return () => (
    <MDXProvider>
      <Component />
    </MDXProvider>
  )
}

const useHydrate = () => {
  const { raw } = useLoaderData<LoadData>()
  const [Hydrated, setHydrated] = useState<MDXContent | undefined>()

  useEffect(() => {
    ;(async function hydrate() {
      const { default: Mod } = await run(raw, { ...runtime, baseUrl: import.meta.url })
      setHydrated(() => Mod)
    })()
  }, [raw])

  return Hydrated
}
