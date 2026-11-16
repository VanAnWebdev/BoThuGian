import { useStore } from '../shared/store.js'
import { sessionOrders, billTotal, sumLines } from '../shared/logic.js'
import { formatPrice } from '../data/menu.js'
import { go } from './OrderApp.jsx'

export const STATUS = { new: 'Bếp đã nhận', cooking: 'Đang làm', served: 'Đã ra món', cancelled: 'Đã huỷ' }
export const METHOD = { vietqr: 'Chuyển khoản VietQR', wallet: 'Ví MoMo / ZaloPay', cash: 'Tiền mặt', card: 'Thẻ ngân hàng' }
const time = (t) => new Date(t).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

export default function BillView({ table, bill }) {
  const orders = useStore('orders', [])
  if (!bill) {
    return (
      <div className="empty">
        <h1>Bàn chưa gọi món</h1>
        <p>Order bạn gửi cho bếp sẽ hiện ở đây.</p>
        <button type="button" className="btn" onClick={() => go('menu')}>Xem thực đơn</button>
      </div>
    )
  }
  const mine = sessionOrders(orders, table, bill.session)
  const total = billTotal(mine)

  return (
    <div className="page">
      <h1>Đơn của bàn</h1>
      {bill.status === 'pay_requested' && (
        <button type="button" className="notice" onClick={() => go(`pay/${bill.method}`)}>
          Đã gọi thanh toán · {METHOD[bill.method]} <span>Xem →</span>
        </button>
      )}

      <ol className="orders">
        {mine.map((o, i) => (
          <li key={o.id} className={`order is-${o.status}`}>
            <div className="order-head">
              <b>Lượt {i + 1} · {time(o.at)}</b>
              <span className={`badge is-${o.status}`}>{STATUS[o.status]}</span>
            </div>
            <ul>
              {o.lines.map((l) => (
                <li key={l.id}>
                  <span className="num">{l.qty}×</span>
                  <span>{l.name}</span>
                  <b className="num">{formatPrice(l.price * l.qty)}</b>
                  {l.note && <em>{l.note}</em>}
                </li>
              ))}
            </ul>
            {o.status !== 'cancelled' && <p className="order-sum num">{formatPrice(sumLines(o.lines))}đ</p>}
          </li>
        ))}
      </ol>

      <div className="sumrow big">
        <span>Tổng cộng</span>
        <b className="num">{formatPrice(total)}đ</b>
      </div>
      <p className="fine">Giá chưa gồm VAT.</p>
      <div className="actions">
        <button type="button" className="btn btn--ghost" onClick={() => go('menu')}>Gọi thêm món</button>
        {bill.status !== 'pay_requested' && (
          <button type="button" className="btn" onClick={() => go('pay')} disabled={!total}>Gọi thanh toán</button>
        )}
      </div>
    </div>
  )
}
