import { Options } from './types'

export const getAliases = (options: Options) => {
  if ('alias' in options && options.alias) {
    return [options.alias]
  }
  if ('aliases' in options && options.aliases) {
    return options.aliases
  }
}

export const getPaths = (options: Options) =>
  'path' in options && typeof options.path === 'string' ? [options.path] : options.paths
