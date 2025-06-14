// vite.config.js
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { flatRoutes } from "remix-flat-routes";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      routes(defineRoutes) {
        return flatRoutes("routes", defineRoutes, {
          ignoredRouteFiles: ["**/.*"],
        });
      },
    }),
  ],
});
