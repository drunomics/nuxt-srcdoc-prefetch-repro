# nuxt-srcdoc-prefetch-repro

Minimal reproduction for a Nuxt 4.6 regression: a Nuxt app booted inside an
`<iframe srcdoc>` fails during client initialization.

## The bug

Since Nuxt 4.6.0 ([#36391](https://github.com/nuxt/nuxt/pull/36391)),
`router.afterEach` calls `prefetchGroup(to.fullPath)`, which runs
`new URL(url, window.location.href)`
(`packages/nuxt/src/app/internal/prefetch-util.ts`). Inside a srcdoc document
`window.location.href` is `about:srcdoc`, which is not a valid base URL, so it
throws `TypeError: Invalid URL`. Production builds only log `[NUXT_E1005]`.

This affects anything that renders a Nuxt app into a srcdoc iframe, e.g.
page-builder component previews.

## Run it

```sh
npm install
npm run build
node .output/server/index.mjs
```

Open http://localhost:3000/ and click **Boot this app in a srcdoc iframe**. The
page fetches its own HTML shell and loads it into `<iframe srcdoc>`. A client
plugin (`app/plugins/report.client.ts`) reports `app:error` / `app:mounted` from
inside the iframe to the parent page.

The setup mirrors how page builders embed a Nuxt app: client-only (`ssr: false`),
memory history inside the frame (`app/router.options.ts`), and a page for the
initial path `/srcdoc` that the frame starts on.

## Results

| Nuxt | iframe status | iframe page renders |
|---|---|---|
| 4.5.2 | `mounted` | yes |
| 4.6.3 | `error Failed to construct 'URL': Invalid URL`, console `[NUXT_E1005]` | no |
| 4.6.3 with the fix below | `mounted` | yes |

## Possible fix

Resolve against `document.baseURI`, which a srcdoc document inherits from its
parent. On normal pages it equals `window.location.href`:

```diff
 export function prefetchGroup (url: string): string {
-  const { pathname, search } = new URL(url, window.location.href)
+  const { pathname, search } = new URL(url, document.baseURI)
   return pathname + search
 }
```

`packages/nuxt/src/app/plugins/payload.client.ts` uses the same pattern for
`link:prefetch`. It is not hit during initialization, so this reproduction does
not exercise it.

## Scope

This repository only contains a minimal reproduction built from public
packages. It contains no code or knowledge internal to drunomics.

## License

MIT
