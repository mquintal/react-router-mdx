# react-router-mdx

> Simplifies the use of MDX files on a [React Router v7](https://reactrouter.com/home) project.

It was designed to integrate with [React Router v7](https://reactrouter.com/home) while using [Static Pre-rendering](https://reactrouter.com/start/framework/rendering#static-pre-rendering). Allowing you generate content based on a list of MDX files from a give folder.

## Install

npm

```sh
npm install react-router-mdx
```

yarn 

```sh
yarn add react-router-mdx
```

## Usage

First of all please make sure you are using React Router v7 and you're using the its [Framework Mode](https://reactrouter.com/start/framework/installation).

Create a MDX file under `posts/hello-world.mdx`

```mdx
---
title: hello world title
---
# hello world

This is a hello World mdx file
```

`react-router.config.ts`

```ts
import type { Config } from "@react-router/dev/config";
import { init } from "react-router-mdx/server";


const mdx = init({ path: "posts" });

export default {
  ssr: true,
  async prerender() {
    return ["/", ...(await mdx.paths())];
  },
} satisfies Config;
```

Here we are initializing the lib where we pass the `path` which should be the folder where you will place your MDX files.

`app/routes.tsx`

```ts
import { index } from "@react-router/dev/routes";
import { routes } from 'react-router-mdx/server'


export default [
    index("routes/home.tsx"),
    ...routes("./routes/post.tsx")
]
```

Here we are appending the routes based on your MDX files to your project.

Create a [Route Module](https://reactrouter.com/start/framework/route-module#introduction) `app/routes/post.tsx`

```ts
import { useMdxComponent, useMdxMetadata } from 'react-router-mdx/client'
import { loadFile } from 'react-router-mdx/server'
import type { Route } from "./+types/post";


export async function loader({ request }: Route.LoaderArgs) {
  return loadFile(request)
}

export default function Routess() {
  const Component = useMdxComponent()
  const metadata = useMdxMetadata()

  return (
    <section>
      <h1>{metadata.title}<h1>
      <Component />
    </section>
  )
}
```

Viola! We are done with a basic setup. Now you can run `npm run dev` or `yarn dev` and your page based on the MDX file will be available at: [http://localhost:5173/posts/hello-world](http://localhost:5173/posts/hello-world)
