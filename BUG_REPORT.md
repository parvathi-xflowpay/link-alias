# Bug: Turbopack `resolveAlias` for `next/link` does not apply — original Next.js Link is still used

## Summary

When using Turbopack with `resolveAlias` in `next.config.js` to redirect `next/link` to a custom Link component (and `original-next-link` to the real `next/link`), the alias is **not** applied at runtime. Imports of `next/link` still resolve to the built-in Next.js Link, so the custom wrapper is never used.

`tsconfig.json` `paths` are set correctly (TypeScript and editor resolve to the custom component), but the Turbopack bundler does not honor the same aliases, so the runtime behavior does not match.

## Environment

- **Next.js version:** canary (e.g. 16.x canary)
- **Node.js version:** (your version)
- **Package manager:** yarn
- **Run command:** `yarn dev` or `yarn dev:turbo` (Turbopack)

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
2. Start dev server with Turbopack: `yarn dev` (or `yarn dev:turbo` if you use that script)
3. Open http://localhost:3000
4. Open browser DevTools → Console

## Expected behavior

- The import `next/link` is resolved to `src/components/Link.tsx` by Turbopack (matching `resolveAlias`).
- The custom Link component runs and logs: **"using custom link: /about undefined"** (or similar for the link on the page).
- Clicking the link uses the custom wrapper (e.g. with the intended prefetch behavior).

## Actual behavior

- No log **"using custom link: ..."** appears in the console.
- The built-in Next.js Link is used instead of the custom component.
- So Turbopack is **not** applying the `resolveAlias` for `next/link` (and possibly for other package subpath aliases).

## Possible causes (for maintainers)

- Turbopack may resolve `next/link` (or other package subpaths) before applying user `resolveAlias`, so the alias never runs.
- There may be special handling for `next/*` that bypasses alias config.
- Alias resolution might not be applied to the same resolution path that handles `next/link`.

## Related

- Similar alias/override use case: custom Link wrapper with different prefetch behavior.
- TypeScript and editors respect `paths`, so the mismatch is specifically at Turbopack/bundler resolution.

## Reproduction repo

This repository is a minimal reproduction:

- `next.config.ts` – `turbopack.resolveAlias` as above
- `tsconfig.json` – `paths` for `next/link` and `original-next-link`
- `src/components/Link.tsx` – custom Link that logs to console
- `pages/index.tsx` – uses `import Link from 'next/link'`

Run `yarn dev`, open the app and the console; the absence of the custom log confirms the bug.

---

## How to raise this bug

1. **Open a new issue** at: https://github.com/vercel/next.js/issues/new
2. **Title suggestion:** `Turbopack resolveAlias for "next/link" is not applied — built-in Link used instead of custom component`
3. **Use the template** (Bug Report) and fill in Environment, reproduction steps, and paste the Expected vs Actual sections from above.
4. **Link this repo** (push to GitHub and add the repo URL to the issue) or attach a zip of this minimal reproduction.
5. **Related issue:** Consider linking to [Issue #88540](https://github.com/vercel/next.js/issues/88540) (resolveAlias and package subpath exports) if relevant; this bug is about the main app’s `next/link` alias not being applied by Turbopack.
