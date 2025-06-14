import { format } from 'date-fns'
import { Author } from './Author'
import { Link } from 'react-router'

type Props = {
  posts: {
    description: string
    slug: string
    title: string
    date: Date
    category: string
    author: {
      name: string
      role: string
      imageUrl: string
    }
  }[]
}

export const Posts = ({ posts }: Props) => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">react-router-mdx demo</h2>
          <p className="mt-2 text-lg/8 text-gray-600">This is a simple blog demo page based on react-router-mdx.</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="flex max-w-xl flex-col items-start justify-between">
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={post.date.toString()} className="text-gray-500">
                  {format(post.date, "LLL dd, yyyy")}
                </time>
                <a
                  href='#'
                  className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                >
                  {post.category}
                </a>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                  <Link to={`/posts/${post.slug}`} >
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">{post.description}</p>
              </div>
              <Author name={post.author.name} role={post.author.role} imageUrl={post.author.imageUrl} />
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
