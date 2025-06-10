import { useLoaderData } from 'react-router'

type MdxAttributes = {
  path: string
  slug: string
  [key: string]: string
}

export const useMdxFiles = () => {
  return useLoaderData<MdxAttributes[]>()
}
