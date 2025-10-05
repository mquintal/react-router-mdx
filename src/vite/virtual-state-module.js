export const getAliases = () => {
  if ('alias' in options && options.alias) {
    return [options.alias]
  }
  if ('aliases' in options && options.aliases) {
    return options.aliases
  }
}

export const getPaths = () =>
  'path' in options && typeof options.path === 'string' ? [options.path] : options.paths

const getFilePathBasedOnUrl = (url, paths, aliases) => {
  const finalPaths = paths.map((path, index) => aliases?.[index] ?? path)
  const foundPath = finalPaths.find(path => url.includes(`/${path}/`))
  const foundPathIndex = finalPaths.findIndex(path => url.includes(`/${path}/`))

  if (foundPath) {
    const [, slug] = url.split(`/${foundPath}/`)
    if (slug) {
      return {
        path: paths[foundPathIndex],
        file: `${paths[foundPathIndex]}/${slug}.mdx`,
      }
    }
  }
  throw new Error(`Path(s) ${finalPaths.join(', ')} were not found on "${url}" url.`)
}

export const getFile = (url, paths, aliases) => {
  const { path, file } = getFilePathBasedOnUrl(url, paths, aliases)

  console.log('getFile ', { path, paths, aliases, url, file })
  const test = state[path].find(f => f.path === file)

  return {
    compiled: test.compiled,
    content: test.content,
  }
}
