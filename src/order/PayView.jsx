import { useState } from 'react'
import { useStore } from '../shared/store.js'
import { sessionOrders, billTotal } from '../shared/logic.js'
import { requestPay, cancelPay, markPaid } from '../shared/actions.js'
import { formatPrice } from '../data/menu.js'
import { brand } from '../data/brand.js'
import QR from '../shared/QR.jsx'
import { go } from './OrderApp.jsx'
import { METHOD } from './BillView.jsx'
import PaymentLogo from './PaymentLogo.jsx'

// Chỉ là giao diện: chưa nối cổng thanh toán thật
const METHODS = [
  ['vietqr', 'Chuyển khoản VietQR', 'Quét mã bằng app ngân hàng'],
  ['wallet', 'Ví MoMo / ZaloPay', 'Thanh toán bằng ví điện tử'],
  ['cash', 'Tiền mặt', 'Nhân viên mang hoá đơn ra bàn'],
  ['card', 'Thẻ ngân hàng', 'Nhân viên mang máy POS ra bàn'],
]

export default function PayView({ table, bill }) {
  const orders = useStore('orders', [])
  if (!bill) {
    return (
      <div className="empty">
        <h1>Bàn chưa có hoá đơn</h1>
        <button type="button" className="btn" onClick={() => go('menu')}>Xem thực đơn</button>
      </div>
    )
  }
  const total = billTotal(sessionOrders(orders, table, bill.session))
  const code = `BTG B${String(table).padStart(2, '0')} ${bill.session.slice(0, 4).toUpperCase()}`
  // Use the shared bill; another tab may have changed the payment method.
  const chosen = bill.status === 'pay_requested' ? bill.method : null

  const pick = (m) => (requestPay(table, m), go(`pay/${m}`))
  const change = () => (cancelPay(table), go('pay'))

  return (
    <div className="page">
      <button type="button" className="back" onClick={() => go('bill')}>← Đơn của bàn</button>
      <h1>Thanh toán</h1>
      <div className="sumrow big">
        <span>Cần thanh toán</span>
        <b className="num">{formatPrice(total)}đ</b>
      </div>

      {!chosen ? (
        <ul className="methods">
          {METHODS.map(([id, name, desc]) => (
            <li key={id}>
              <button type="button" className={`method m-${id}`} onClick={() => pick(id)}>
                <PaymentLogo method={id} />
                <span><b>{name}</b>{desc}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : chosen === 'vietqr' ? (
        <div className="paybox">
          <QR text={`Chuyen khoan ${total} VND - ${brand.bank.holder} - ${code}`} size={220} label="Mã QR chuyển khoản" />
          <dl className="bank">
            <div><dt>Ngân hàng</dt><dd>{brand.bank.name}</dd></div>
            <div><dt>Số tài khoản</dt><dd className="num">{brand.bank.account} <Copy text={brand.bank.account.replace(/\s/g, '')} /></dd></div>
            <div><dt>Chủ tài khoản</dt><dd>{brand.bank.holder}</dd></div>
            <div><dt>Số tiền</dt><dd className="num">{formatPrice(total)}đ</dd></div>
            <div><dt>Nội dung</dt><dd className="num">{code} <Copy text={code} /></dd></div>
          </dl>
          <p className="fine">Mã QR và tài khoản đang là minh hoạ (giao diện demo).</p>
          <Done table={table} label="Tôi đã chuyển khoản" onChange={change} />
        </div>
      ) : chosen === 'wallet' ? (
        <div className="paybox">
          <div className="wallets">
            <PaymentLogo method="wallet" />
          </div>
          <QR text={`Thanh toan vi ${total} VND - ${code}`} size={200} label="Mã QR ví điện tử" />
          <p>Mở ứng dụng MoMo hoặc ZaloPay, chọn <b>Quét mã</b> và xác nhận <b className="num">{formatPrice(total)}đ</b>.</p>
          <p className="fine">Giao diện demo, chưa kết nối ví thật.</p>
          <Done table={table} label="Tôi đã thanh toán" onChange={change} />
        </div>
      ) : (
        <div className="paybox waiting">
          <PaymentLogo method={chosen} />
          <h2>{chosen === 'cash' ? 'Nhân viên đang mang hoá đơn ra bàn' : 'Nhân viên đang mang máy POS ra bàn'}</h2>
          <p>Bạn vui lòng đợi một chút. Trang sẽ tự chuyển khi quán xác nhận đã thanh toán.</p>
          <p className="fine">Cách thanh toán: {METHOD[chosen]}</p>
          <button type="button" className="link" onClick={change}>Đổi cách thanh toán</button>
        </div>
      )}
    </div>
  )
}

// Chuyển khoản / ví: khách tự báo đã trả (bản thật sẽ chờ ngân hàng báo về)
function Done({ table, label, onChange }) {
  return (
    <div className="actions">
      <button type="button" className="btn btn--ghost" onClick={onChange}>Đổi cách khác</button>
      <button type="button" className="btn" onClick={() => markPaid(table)}>{label}</button>
    </div>
  )
}

function Copy({ text }) {
  const [ok, setOk] = useState(false)
  return (
    <button type="button" className="copy" onClick={() => navigator.clipboard?.writeText(text).then(() => (setOk(true), setTimeout(() => setOk(false), 1500)))}>
      {ok ? 'Đã chép' : 'Chép'}
    </button>
  )
}
