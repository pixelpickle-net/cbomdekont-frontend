import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          $feature-flags: (
            ui-shell: true,
            enable-css-custom-properties: true,
          );
        `,
        quietDeps: true,
      }
    }
  }
})
