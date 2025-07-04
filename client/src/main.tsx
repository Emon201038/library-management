import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import store from './redux/store.ts'
import { RouterProvider } from 'react-router'
import { router } from './routes/index.tsx'
import { ThemeProvider } from './providers/theme-provider.tsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Provider store={store}>
        <RouterProvider router={router} />
        <Toaster richColors position='top-right' />
      </Provider>
    </ThemeProvider>
  </StrictMode>,
)
