import { format } from "date-fns"
import { useMdxComponent, useMdxAttributes } from "react-router-mdx/client"
import { z } from "zod";
import { Author } from "~/posts/Author"


const postSchema = z.object({
  date: z.date(),
  author: z.object({
    name: z.string(),
    role: z.string(),
    imageUrl: z.string(),
  })
});



export const Post = () => {
  const Component = useMdxComponent()
  const attrs = useMdxAttributes()
  
  const result = postSchema.safeParse(attrs);

  if (!result.success) {
    return (
      <>
        <p>Invalid post payload:</p>
        <pre>{JSON.stringify(result.error, null, 2)}</pre>
      </>
    )
  }

  const post = result.data


  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-8">
        <Author name={post.author.name} role={post.author.role} imageUrl={post.author.imageUrl} />
        <time dateTime={post.date.toString()} className="text-gray-500">
          {format(post.date, "LLL dd, yyyy")}
        </time>
      </div>
      <article className="prose lg:prose-xl article-content">
        <Component />
      </article>
    </div>    
  )
}