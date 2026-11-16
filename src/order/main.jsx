import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/base.css'
import './order.css'
import OrderApp from './OrderApp.jsx'
import { applyDemo } from '../shared/demo.js'

applyDemo() // ?demo=…: dựng dữ liệu mẫu trước khi vẽ

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OrderApp />
  </StrictMode>,
)
