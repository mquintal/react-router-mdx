import { useLoaderData } from 'react-router'
import type { LoadData } from './types'

export const useMdxAttributes = () => {
  const { attributes } = useLoaderData<LoadData>()

  return attributes
}
