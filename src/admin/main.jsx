import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/base.css'
import './admin.css'
import AdminApp from './AdminApp.jsx'
import { applyDemo } from '../shared/demo.js'

applyDemo() // ?demo=…: dựng dữ liệu mẫu trước khi vẽ

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
)
