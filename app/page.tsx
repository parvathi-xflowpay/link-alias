import Link from "next/link";

/** Page uses next/link — with aliases, this should resolve to src/components/Link.tsx and log "using custom link" in console. */
export default function Home() {
  return (
    <div>
      <h1>next/link alias reproduction</h1>
      <p>Open DevTools console. If the alias worked, you should see: &quot;using custom link: /about undefined&quot;</p>
      <Link href="/about" target="_blank">Go to about</Link>
    </div>
  );
}
