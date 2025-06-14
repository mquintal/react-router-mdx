import { loadAllMdx } from 'react-router-mdx/server'
import { useMdxFiles } from 'react-router-mdx/client'
import { z } from 'zod'
import { Posts } from '../posts'

const postSchema = z.object({
  date: z.date(),
  description: z.string(),
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  author: z.object({
    name: z.string(),
    role: z.string(),
    imageUrl: z.string(),
  })
});

const postsSchema = z.array(postSchema).min(1)

export const loader = () => {
  return loadAllMdx()
}

export default function Home() {
  const files = useMdxFiles()
  const result = postsSchema.safeParse(files)

  if (!result.success) {
    return (
      <>
        <p>Invalid posts payload:</p>
        <pre>{JSON.stringify(result.error, null, 2)}</pre>
      </>
    )
  }

  const posts = result.data

  return <Posts posts={posts} />;
}