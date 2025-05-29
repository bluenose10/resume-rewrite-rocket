
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register service worker
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    if (confirm('New content available. Reload for better performance?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
  onRegisterError(error) {
    console.error('SW registration error', error)
  }
})

createRoot(document.getElementById("root")!).render(<App />);
