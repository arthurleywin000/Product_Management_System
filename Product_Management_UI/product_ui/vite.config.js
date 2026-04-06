import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import path from "path" // 1. Added this import

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  // 2. Added this resolve block for shadcn
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})