import { useEffect, useState } from 'react'
import { useStore } from '../shared/store.js'
import { useSettings } from '../shared/menuData.js'
import { setOrderStatus, markPaid, closeTable, openBill } from '../shared/actions.js'
import { sessionOrders, billTotal, isClosed } from '../shared/logic.js'
import { formatPrice } from '../data/menu.js'
import { METHOD } from '../order/BillView.jsx'

const COLUMNS = [
  ['new', 'Mới gửi', 'cooking', 'Nhận làm'],
  ['cooking', 'Đang làm', 'served', 'Đã ra món'],
  ['served', 'Đã ra món', null, null],
]
const ago = (t, now) => {
  const m = Math.max(0, Math.round((now - t) / 60000))
  return m < 1 ? 'vừa xong' : m < 60 ? `${m} phút trước` : `${Math.floor(m / 60)} giờ ${m % 60} phút trước`
}
const pad = (n) => String(n).padStart(2, '0')

export default function Board() {
  const orders = useStore('orders', [])
  const bills = useStore('bills', {})
  const { tables } = useSettings()
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(t)
  }, [])

  // Chỉ hiện order của các phiên đang mở (bàn chưa dọn)
  const live = orders.filter((o) => {
    const b = bills[o.table]
    return b && !isClosed(b) && b.session === o.session
  })
  const totalOf = (table) => billTotal(sessionOrders(orders, table, bills[table]?.session))
  // Khoá của object là chuỗi → đổi về số bàn trước khi tra order
  const payQueue = Object.entries(bills)
    .map(([t, b]) => [Number(t), b])
    .filter(([, b]) => b?.status === 'pay_requested' || (b?.status === 'paid' && !b.feedbackDone))

  return (
    <div className="board">
      <header className="adm-head">
        <h1>Order & thanh toán</h1>
        <p>{live.filter((o) => o.status !== 'served' && o.status !== 'cancelled').length} order đang chờ bếp</p>
      </header>

      <section aria-labelledby="t-tables">
        <h2 id="t-tables" className="sub">Sơ đồ bàn</h2>
        <ul className="tablemap">
          {Array.from({ length: tables }, (_, i) => i + 1).map((t) => {
            const b = openBill(bills, t)
            const state = !b ? 'free' : b.status === 'pay_requested' ? 'pay' : b.status === 'paid' ? 'paid' : 'busy'
            const label = { free: 'Trống', busy: 'Đang ăn', pay: 'Gọi thanh toán', paid: 'Đã thanh toán' }[state]
            return (
              <li key={t} className={`tbl is-${state}`}>
                <b className="num">{pad(t)}</b>
                <span>{label}</span>
                {b && state !== 'paid' && <span className="num">{formatPrice(totalOf(t))}đ</span>}
              </li>
            )
          })}
        </ul>
      </section>

      {payQueue.length > 0 && (
        <section aria-labelledby="t-pay">
          <h2 id="t-pay" className="sub">Thanh toán</h2>
          <ul className="payq">
            {payQueue.map(([t, b]) => (
              <li key={t} className={`payq-item is-${b.status}`}>
                <div>
                  <b>Bàn {pad(t)}</b>
                  <span>{b.status === 'paid' ? 'Đã thanh toán · chờ khách đánh giá' : `${METHOD[b.method]} · ${ago(b.requestedAt, now)}`}</span>
                </div>
                <b className="num">{formatPrice(b.status === 'paid' ? b.total : totalOf(t))}đ</b>
                {b.status === 'pay_requested'
                  ? <button type="button" className="btn" onClick={() => markPaid(t)}>Xác nhận đã thu</button>
                  : <button type="button" className="btn btn--ghost" onClick={() => closeTable(t)}>Dọn bàn</button>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="kanban" aria-label="Order theo trạng thái">
        {COLUMNS.map(([status, title, next, action]) => {
          const list = live.filter((o) => o.status === status).sort((a, b) => a.at - b.at)
          return (
            <div key={status} className={`col is-${status}`}>
              <h2 className="sub">{title} <span className="num">{list.length}</span></h2>
              {list.length === 0 && <p className="muted">Không có order.</p>}
              {list.map((o) => (
                <article key={o.id} className="ticket">
                  <header>
                    <b>Bàn {pad(o.table)}</b>
                    <span>{ago(o.at, now)}</span>
                  </header>
                  <ul>
                    {o.lines.map((l) => (
                      <li key={l.id}>
                        <span className="num">{l.qty}×</span> {l.name}
                        {l.note && <em>{l.note}</em>}
                      </li>
                    ))}
                  </ul>
                  {next && (
                    <div className="ticket-actions">
                      {status === 'new' && <button type="button" className="link" onClick={() => confirm(`Huỷ order bàn ${o.table}?`) && setOrderStatus(o.id, 'cancelled')}>Huỷ</button>}
                      <button type="button" className="btn" onClick={() => setOrderStatus(o.id, next)}>{action}</button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )
        })}
      </section>
    </div>
  )
}
