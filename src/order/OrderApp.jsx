import { useEffect, useState } from 'react'
import { useStore, set } from '../shared/store.js'
import { useSettings } from '../shared/menuData.js'
import { openBill } from '../shared/actions.js'
import { countLines, sumLines } from '../shared/logic.js'
import { formatPrice } from '../data/menu.js'
import MenuView from './MenuView.jsx'
import CartView from './CartView.jsx'
import BillView from './BillView.jsx'
import PayView from './PayView.jsx'
import ThanksView from './ThanksView.jsx'

// Màn hình theo hash: #menu · #cart · #bill · #pay · #thanks (F5 vẫn giữ đúng màn)
function useRoute() {
  const read = () => location.hash.slice(1) || 'menu'
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const on = () => (setRoute(read()), scrollTo(0, 0))
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  return route
}
export const go = (r) => (location.hash = r)

export default function OrderApp() {
  const settings = useSettings()
  const table = Number(new URLSearchParams(location.search).get('ban'))
  const valid = Number.isInteger(table) && table >= 1 && table <= settings.tables
  if (!valid) return <NoTable max={settings.tables} />
  return <TableApp table={table} />
}

function TableApp({ table }) {
  const route = useRoute()
  const cart = useStore(`cart:${table}`, [])
  const bills = useStore('bills', {})
  const bill = bills[table]
  const setCart = (next) => set(`cart:${table}`, next)
  const [toast, setToast] = useState('')
  const flash = (msg) => {
    setToast(msg)
    clearTimeout(flash.t)
    flash.t = setTimeout(() => setToast(''), 2200)
  }

  // Đã thanh toán mà chưa đánh giá → luôn về trang cảm ơn (kể cả khi nhân viên xác nhận ở máy khác tab)
  const paid = bill?.status === 'paid' && !bill.feedbackDone
  const view = paid ? 'thanks' : route
  const active = openBill(bills, table)

  const props = { table, cart, setCart, bill: active, flash }
  return (
    <div className="app">
      <header className="app-head">
        <a href="/" className="app-logo" aria-label="Bò Thư Giãn"><img src="/images/logo.webp" alt="" width="640" height="543" /></a>
        <div className="app-table">
          <span>Bàn</span>
          <b className="num">{String(table).padStart(2, '0')}</b>
        </div>
        {active && view !== 'bill' && view !== 'thanks' && (
          <button type="button" className="app-billbtn" onClick={() => go('bill')}>Đơn của bàn</button>
        )}
      </header>

      <main className="app-main">
        {view === 'cart' ? <CartView {...props} />
          : view === 'bill' ? <BillView {...props} />
          : view.startsWith('pay') ? <PayView {...props} />
          : view === 'thanks' ? <ThanksView {...props} bill={bill} />
          : <MenuView {...props} />}
      </main>

      {view === 'menu' && cart.length > 0 && (
        <button type="button" className="cartbar" onClick={() => go('cart')}>
          <span className="cartbar-count num">{countLines(cart)}</span>
          <span>Xem giỏ món</span>
          <b className="num">{formatPrice(sumLines(cart))}đ</b>
        </button>
      )}
      <p className={`toast${toast ? ' is-on' : ''}`} role="status" aria-live="polite">{toast}</p>
    </div>
  )
}

function NoTable({ max }) {
  const [n, setN] = useState('')
  return (
    <div className="app notable">
      <img src="/images/logo.webp" alt="Bò Thư Giãn" width="640" height="543" />
      <h1>Quét mã QR trên bàn để gọi món</h1>
      <p>Mỗi bàn có một mã QR riêng. Nếu không quét được, nhập số bàn của bạn:</p>
      <form onSubmit={(e) => (e.preventDefault(), (location.search = `?ban=${n}`))}>
        <input type="number" min="1" max={max} required value={n} onChange={(e) => setN(e.target.value)} placeholder={`1 – ${max}`} aria-label="Số bàn" />
        <button className="btn" type="submit">Vào bàn</button>
      </form>
    </div>
  )
}
