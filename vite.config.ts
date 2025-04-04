import {vitePlugin as remix} from '@remix-run/dev';
import {RemixVitePWA} from '@vite-pwa/remix';
import {defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const {RemixVitePWAPlugin, RemixPWAPreset} = RemixVitePWA();

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      presets: [RemixPWAPreset()],
    }),
    tsconfigPaths(),
    RemixVitePWAPlugin({
      registerType: 'prompt',
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: 'vinylogger',
        short_name: 'vinylogger',
        description: 'Handle your vinyl collection effortlessly with Vinylogger',
        theme_color: '#ffffff',
      },

      workbox: {
        globPatterns: ['**/*.{js,html,css,png,svg,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: true,
        suppressWarnings: true,
        navigateFallback: '/',
        navigateFallbackAllowlist: [/^\/$/],
        type: 'module',
      },
    }),
  ],
});
