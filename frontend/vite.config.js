import { defineConfig } from "vite"
import path from "path"
import react from "@vitejs/plugin-react"
// import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
