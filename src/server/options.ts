import type { Options } from './types'

const globalKey = '__react-router-mdx_options__'

let config: Options | null = null

export function setOptions(opts: Options) {
  // ;(globalThis as any)[globalKey] = opts
  console.log('setOptions v1')
  config = opts
}

export function getOptions(): Options {
  // if (!(globalThis as any)[globalKey]) {
  //   throw new Error(
  //     'react-router-mdx has not initialized options. Please initialize it using init method.'
  //   )
  // }
  // return (globalThis as any)[globalKey]
  if (!config) {
    throw new Error(
      'react-router-mdx has not initialized options. Please initialize it using init method.'
    )
  }
  return config
}
