import { QueryClient } from "@tanstack/react-query";

function createQueryClient() {
  return new QueryClient();
}

let browserQueryClient: QueryClient | undefined;

/**
 * A single QueryClient per browser document.
 *
 * The TanStack app had one `<QueryClientProvider>` at the router root, so every
 * page shared one cache. Astro mounts each island on its own, so the client lives
 * in a module instead: islands rendered on the same page (the homepage hero and
 * the featured listings, for example) share the cache and therefore fire one
 * request instead of two. On the server a throwaway client is returned per render
 * so nothing is ever cached across requests.
 */
export function getQueryClient() {
  if (typeof window === "undefined") return createQueryClient();
  if (!browserQueryClient) browserQueryClient = createQueryClient();
  return browserQueryClient;
}
