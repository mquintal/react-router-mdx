import { compile } from './mdx'

const removeTabs = (str: string) => str.replace(/[ ]{2}/g, '')

describe('compile', () => {
  it('should return the expected outcome when there are no attributes', async () => {
    expect(await compile(JSON.stringify(`# this is a title`))).toContain('this is a title')
  })

  it('should return the expected outcome when there are attributes and custom components', async () => {
    const mdx = removeTabs(`---
          title: this is a page title
          description: this is an amazing mdx file
          ---
          # this is a title
          <ThisIsACustomComponent its='prop' />
          `)
    expect(await compile(mdx)).toContain('this is a title')
  })
})
