export type Options =
  | {
      path: string
      paths?: never
      alias?: string
    }
  | {
      path?: never
      paths: string[]
      aliases?: string[]
    }
