import { useEffect, useState } from 'react'
import { useStore } from '../shared/store.js'
import Board from './Board.jsx'
import Tables from './Tables.jsx'
import MenuAdmin from './MenuAdmin.jsx'
import Insights from './Insights.jsx'

const TABS = [
  ['orders', 'Order & thanh toán', Board],
  ['tables', 'Mã QR bàn', Tables],
  ['menu', 'Thực đơn', MenuAdmin],
  ['insights', 'Đánh giá & doanh thu', Insights],
]

// shortcut: chưa có đăng nhập — bản demo chỉ đọc/ghi dữ liệu trong trình duyệt này; có backend thì phải thêm xác thực
export default function AdminApp() {
  const read = () => location.hash.slice(1) || 'orders'
  const [tab, setTab] = useState(read)
  useEffect(() => {
    const on = () => setTab(read())
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  const bills = useStore('bills', {})
  const waiting = Object.values(bills).filter((b) => b?.status === 'pay_requested').length
  const newOrders = useStore('orders', []).filter((o) => o.status === 'new').length
  const [, , View] = TABS.find(([id]) => id === tab) || TABS[0]

  return (
    <div className="adm">
      <aside className="adm-side">
        <a href="/" className="adm-logo" aria-label="Về trang Bò Thư Giãn"><img src="/images/logo.webp" alt="" width="640" height="543" /></a>
        <nav aria-label="Quản lý">
          {TABS.map(([id, label]) => (
            <a key={id} href={`#${id}`} aria-current={tab === id ? 'page' : undefined}>
              {label}
              {id === 'orders' && newOrders + waiting > 0 && <span className="dot num">{newOrders + waiting}</span>}
            </a>
          ))}
        </nav>
        <p className="adm-note">Bản demo: dữ liệu lưu trong trình duyệt này. Mở trang gọi món ở tab khác cùng máy để thấy order chạy về.</p>
      </aside>
      <main className="adm-main"><View /></main>
    </div>
  )
}
