import '@fontsource/b612/400.css'
import '@fontsource/b612/700.css'
import '@fontsource/b612-mono/400.css'
import '@fontsource/b612-mono/700.css'
import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { config } from './config'
import { loadVoice } from './voice'

document.body.style.background = config.colors.bg

// Load every face up front so no text swaps font in the middle of a scene.
for (const face of ['400 16px "B612"', '700 16px "B612"', '400 16px "B612 Mono"', '700 16px "B612 Mono"']) {
  void document.fonts.load(face)
}

void loadVoice()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
