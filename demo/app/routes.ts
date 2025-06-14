import { type RouteConfig, index } from "@react-router/dev/routes";
import { routes } from 'react-router-mdx/server'

export default [
    index("./routes/posts.tsx"),
    ...routes('./routes/post.tsx')
] satisfies RouteConfig;
