import 'dotenv/config';

import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { reactRouterHonoServer } from 'react-router-hono-server/dev';
import { RemixComponentCssLoader } from 'remix-component-css-loader';

export default defineConfig({
  plugins: [
    RemixComponentCssLoader(),
    tailwindcss(),
    reactRouterHonoServer({
      runtime: 'node',
      serverEntryPoint: 'server/server.ts',
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
  define: {
    'APP_VERSION': JSON.stringify(process.env.APP_VERSION),
  },
});
