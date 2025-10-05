import { readFileSync } from 'fs'

export const read = (path: string) => {
  return readFileSync(path, 'utf8') ?? ''
}
