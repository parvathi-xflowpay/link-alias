import NextLink from "original-next-link"; // avoid circular dependency with next/link

const Link = ({
  href,
  target,
  prefetch,
  children,
  ...rest
}: React.ComponentProps<typeof NextLink>) => {
  const shouldPrefetch = target === "_blank" ? false : prefetch;
  if (typeof window !== "undefined") {
    window.console.log("using custom link: ", href, prefetch);
  }
  return (
    <NextLink href={href} prefetch={shouldPrefetch} target={target} {...rest}>
      {children}
    </NextLink>
  );
};

export default Link;
