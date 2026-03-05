# Turbopack `resolveAlias` for `next/link` does not apply — original Next.js Link is still used

## Summary

When using Turbopack with `resolveAlias` in `next.config.js` to redirect `next/link` to a custom Link component (and `original-next-link` to the real `next/link`), the alias is **not** applied at runtime. Imports of `next/link` still resolve to the built-in Next.js Link, so the custom wrapper is never used.

`tsconfig.json` `paths` are set correctly (TypeScript and editor resolve to the custom component), but the Turbopack bundler does not honor the same aliases, so the runtime behavior does not match.

## Environment

- **Next.js version:** canary (e.g. 16.x canary)
- **Node.js version:** (your version)
- **Package manager:** yarn
- **Run command:** `yarn build` then `yarn start`

## Configuration

### next.config.ts (or next.config.js)

```js
turbopack: {
  resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
  resolveAlias: {
    'original-next-link': 'node_modules/next/link',
    'next/link': 'src/components/Link.tsx',
  },
},
```

### tsconfig.json

```json
"paths": {
  "next/link": ["src/components/Link.tsx"],
  "original-next-link": ["node_modules/next/link"]
}
```

### Custom Link (src/components/Link.tsx)

- Imports the real Link from `original-next-link` to avoid circular resolution.
- Wraps it and logs `"using custom link: ", href, prefetch` in the console when used.

### Usage

- A page imports `import Link from 'next/link'`.
- Intention: that import should resolve to `src/components/Link.tsx` so the custom wrapper (and its console.log) runs.

## Steps to reproduce

1. Clone this repo and install: `yarn install`
2. **Build then start:** `yarn build` then `yarn start`
3. Open http://localhost:3000
4. Open browser DevTools → Console and Network tab

## Expected behavior (if alias were applied)

- The import `next/link` resolves to `src/components/Link.tsx`, so the custom Link runs.
- **Console:** log **"using custom link: /about undefined"** (or similar) appears.
- **Prefetch:** the custom Link disables prefetch when `target="_blank"`; so no prefetch request for the linked page.

## Actual behavior

- **a) Prefetch still happens** — e.g. in Network tab you see prefetch for the link target, even though the custom Link would set `prefetch={false}` for `target="_blank"`. So the built-in Link is being used.
- **b) No log** — **"using custom link: ..."** never appears in the console. The custom component is not used.
- Conclusion: the bundler is **not** applying `resolveAlias` for `next/link`; the original Next.js Link is still used.


## Reproduction repo

This repository is a minimal reproduction:

- `next.config.ts` – `turbopack.resolveAlias` as above
- `tsconfig.json` – `paths` for `next/link` and `original-next-link`
- `src/components/Link.tsx` – custom Link that logs to console
- `app/page.tsx` – uses `import Link from 'next/link'` (App Router)

Run `yarn build` then `yarn start`, open the app. You’ll see **(a)** prefetch still happening and **(b)** no custom log — confirming the alias is not applied.
