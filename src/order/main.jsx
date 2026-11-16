import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/base.css'
import './order.css'
import OrderApp from './OrderApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OrderApp />
  </StrictMode>,
)
