import { type RouteConfig, route } from "@react-router/dev/routes";
import { routes } from 'react-router-mdx/server'

export default [
    route('/react-router-mdx', "./routes/posts.tsx"),
    ...routes('./routes/post.tsx')
] satisfies RouteConfig;
