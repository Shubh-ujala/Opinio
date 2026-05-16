import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

const rootElement = document.getElementById('root')
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
  const appLoader = document.getElementById('app-loader')
  if (appLoader) {
    appLoader.classList.add('hidden')
    appLoader.addEventListener('transitionend', () => appLoader.remove(), { once: true })
  }
}