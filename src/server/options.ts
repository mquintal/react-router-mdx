import type { Options } from './types'

const globalKey = '__react-router-mdx_options__'

export function setOptions(opts: Options) {
  ;(globalThis as any)[globalKey] = opts
}

export function getOptions(): Options {
  if (!(globalThis as any)[globalKey]) {
    throw new Error(
      'react-router-mdx has not initialized options. Please initialize it using init method.'
    )
  }
  return (globalThis as any)[globalKey]
}
