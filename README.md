# nuxt-srcdoc-prefetch-repro

Minimal reproduction for a Nuxt 4.6 regression: a Nuxt app booted inside an
`<iframe srcdoc>` fails during client initialization.

Since Nuxt 4.6.0, `router.afterEach` calls `prefetchGroup(to.fullPath)`, which
runs `new URL(url, window.location.href)`. Inside a srcdoc document
`window.location.href` is `about:srcdoc`, which is not a valid base URL, so it
throws `TypeError: Invalid URL`. Production builds report it only as
`[NUXT_E1005]`.

The reproduction app itself follows in a later commit.

## Scope

This repository only contains a minimal reproduction built from public
packages. It contains no code or knowledge internal to drunomics.

## License

MIT
