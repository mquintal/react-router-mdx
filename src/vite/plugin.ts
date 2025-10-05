import type { Plugin } from 'vite'
import fs from 'fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { getPaths, loadPath } from '../shared'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

type State = Record<string, ReturnType<typeof loadPath>>

export function reactRouterMdx(options: any): Plugin {
  const VIRTUAL_MODULES = ['virtual:react-router-mdx', 'virtual:hello-world']
  const virtualModule = fs.readFileSync(resolve(__dirname, 'virtual-state-module.js'), 'utf8')
  const paths = getPaths(options)
  const state = paths.reduce<State>((acc, path) => {
    return {
      ...acc,
      [path]: loadPath(path),
    }
  }, {})

  return {
    name: 'react-router-mdx',
    resolveId(id) {
      if (VIRTUAL_MODULES.includes(id)) {
        const resolvedId = `\0${id}`
        console.log('resolveId > ', id, resolvedId)
        return resolvedId
      }
    },
    load(id) {
      if (!VIRTUAL_MODULES.map(mod => `\0${mod}`).includes(id)) return null

      // TODO: this is for testing (it need to be based on the mdx found)
      if (id.includes('hello-world')) {
        return `${String(state['posts'][0].compiled)}
        `
      }

      return `
        const state = ${JSON.stringify(state)}
        const options = ${JSON.stringify(options)}

        ${virtualModule}
      `
    },
    config() {
      return {
        optimizeDeps: {
          exclude: ['react-router-mdx'],
        },
      }
    },
  }
}
