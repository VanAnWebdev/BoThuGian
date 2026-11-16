import { setQty, setNote, removeLine, sumLines, countLines } from '../shared/logic.js'
import { submitOrder } from '../shared/actions.js'
import { formatPrice } from '../data/menu.js'
import Stepper from './Stepper.jsx'
import { go } from './OrderApp.jsx'

export default function CartView({ table, cart, setCart, bill, flash }) {
  const send = () => {
    submitOrder(table, cart)
    setCart([])
    flash('Đã gửi order cho bếp')
    go('bill')
  }

  if (!cart.length) {
    return (
      <div className="empty">
        <h1>Giỏ món đang trống</h1>
        <p>Chọn vài món ngon rồi quay lại đây nhé.</p>
        <button type="button" className="btn" onClick={() => go('menu')}>Xem thực đơn</button>
      </div>
    )
  }

  return (
    <div className="page">
      <button type="button" className="back" onClick={() => go('menu')}>← Thực đơn</button>
      <h1>Giỏ món <span className="num">({countLines(cart)})</span></h1>
      {bill?.status === 'pay_requested' && (
        <p className="warn">Bàn đang chờ thanh toán. Gửi thêm món sẽ cộng vào hoá đơn.</p>
      )}

      <ul className="lines">
        {cart.map((l) => (
          <li key={l.id} className="line">
            <div className="line-top">
              <h3>{l.name}</h3>
              <b className="num">{formatPrice(l.price * l.qty)}đ</b>
            </div>
            <div className="line-bottom">
              <Stepper value={l.qty} onChange={(n) => setCart(setQty(cart, l.id, n))} label={l.name} />
              <button type="button" className="link" onClick={() => setCart(removeLine(cart, l.id))}>Xoá</button>
            </div>
            <input className="note" value={l.note} maxLength={80} placeholder="Ghi chú cho bếp: ít cay, không hành…"
              onChange={(e) => setCart(setNote(cart, l.id, e.target.value))} aria-label={`Ghi chú cho ${l.name}`} />
          </li>
        ))}
      </ul>

      <div className="sumrow">
        <span>Tạm tính</span>
        <b className="num">{formatPrice(sumLines(cart))}đ</b>
      </div>
      <div className="actions">
        <button type="button" className="btn btn--ghost" onClick={() => confirm('Xoá hết món trong giỏ?') && setCart([])}>Xoá giỏ</button>
        <button type="button" className="btn" onClick={send}>Gửi order cho bếp</button>
      </div>
    </div>
  )
}
