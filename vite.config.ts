import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// The build is inlined into a single dist/index.html (fonts and voice clips
// included), so it can be opened by double-click with no server and no network.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
})
