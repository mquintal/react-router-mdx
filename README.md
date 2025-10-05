# react-router-mdx [![npm version](https://img.shields.io/npm/v/react-router-mdx)](https://www.npmjs.com/package/react-router-mdx)

> Simplifies the use of MDX files on a [React Router v7](https://reactrouter.com/home) project.

It was designed to integrate with [React Router v7](https://reactrouter.com/home) while using [Static Pre-rendering](https://reactrouter.com/start/framework/rendering#static-pre-rendering). Allowing you generate content based on a list of MDX files from a given folder.

Check our [DEMO](https://react-router-mdx.netlify.app/)

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

Once you have your MDX file you can initialize the lib passing the `path` which must be the folder where you will place your MDX files.

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

Here we are appending the routes based on your MDX files to your project's routes. Here you need to provide the path to your Route Module. In our case it will `"./routes/post.tsx"`.

`app/routes.tsx`

```ts
import { index } from "@react-router/dev/routes";
import { routes } from 'react-router-mdx/server'

export default [
    index("routes/home.tsx"),
    ...routes("./routes/post.tsx")
]
```

Finally, create the [Route Module](https://reactrouter.com/start/framework/route-module#introduction) `app/routes/post.tsx` which will load and render your MDX files.

```ts
import { useMdxComponent, useMdxAttributes } from 'react-router-mdx/client'
import { loadMdx } from 'react-router-mdx/server'
import type { Route } from "./+types/post";

export async function loader({ request }: Route.LoaderArgs) {
  return loadMdx(request)
}

export default function Route() {
  const Component = useMdxComponent()
  const attributes = useMdxAttributes()

  return (
    <section>
      <h1>{attributes.title}<h1>
      <Component />
    </section>
  )
}
```

Viola! We are done with a basic setup. Now you can run `npm run dev` or `yarn dev` and your page based on the MDX file will be available at: [http://localhost:5173/posts/hello-world](http://localhost:5173/posts/hello-world)


## Add metadata

If you need to provide [meta](https://reactrouter.com/start/framework/route-module#meta) to your mdx based pages you can access the mdx file attributes through the [meta arguments](https://api.reactrouter.com/v7/interfaces/react_router.MetaArgs).

Here is an example how you can use our file's title attribute to let router-router create respective head meta tags.

```ts
export function meta({ data: { attributes } }: Route.MetaArgs) {
  return [
    { title: attributes.title },
    {
      property: "og:title",
      content: attributes.title,
    },
  ]
}
```

## Using custom components

If you need to extend the MDX base components you can use your custom components by passing an components object to `useMdxComponent`.

Let's assume you want to embed YouTube videos in your MDX files. For that you can create an custom `Youtube` component that will render the you embed HTML code by providing just the video ID.

`hello-world.mdx`
```mdx
---
title: hello world title
---
# hello world

This is a hello World mdx file

<YouTube id='SOME-VIDEO-ID' >
```

`app/routes/posts.tsx`
```ts
const components = {
  YouTube: ({ id }: { id: string }) => {
    return (
      <iframe width="560" height="315" src={`https://www.youtube.com/embed/${id}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen />
    )
  }
}

export default function Route() {
  const Component = useMdxComponent(components)
  const attributes = useMdxAttributes()

  return (
    <section>
      <h1>{attributes.title}<h1>
      <Component />
    </section>
  )
}
```

## Using custom MDX plugins

If you need to extend the basic features of mdx and use custom [plugins](https://mdxjs.com/docs/extending-mdx/#list-of-plugins) you will need to provide it through `options` parameter in our `loadMdx` method.

For example let's say you need [remark-gfm](https://github.com/remarkjs/remark-gfm) in your project. Your route loader method will look like the following:

```ts
import { loadMdx } from 'react-router-mdx/server'
import remarkGfm from 'remark-gfm'
import type { Route } from "./+types/post";

export async function loader({ request }: Route.LoaderArgs) {
  return loadMdx(request, { remarkPlugins: [remarkGfm] })
}
```
