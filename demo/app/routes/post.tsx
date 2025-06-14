import { loadMdx } from 'react-router-mdx/server'
import type { Route } from "./+types/post";
import { Post } from '../post'

export const loader = async ({ request }: Route.LoaderArgs) => {
  return loadMdx(request)
}

export default function Home() {
  return <Post />;
}