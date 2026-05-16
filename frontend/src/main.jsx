import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety


// Render the app
const rootElement = document.getElementById('root')
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
  // Fade out the HTML-level loader once React has mounted
  const appLoader = document.getElementById('app-loader')
  if (appLoader) {
    appLoader.classList.add('hidden')
    appLoader.addEventListener('transitionend', () => appLoader.remove(), { once: true })
  }
}