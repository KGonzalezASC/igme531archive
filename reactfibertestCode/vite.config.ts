import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {viteSingleFile} from "vite-plugin-singlefile";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),viteSingleFile()],
  build:{
    minify:true,
    outDir: 'dist'
  },
  server:{
    watch:{
      usePolling: true,
    }
  }
})
