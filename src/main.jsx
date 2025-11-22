import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { CartProvider } from './context/CartContext.jsx'
import { BrowserRouter } from 'react-router-dom'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </ConvexProvider>
  </StrictMode>,
)
