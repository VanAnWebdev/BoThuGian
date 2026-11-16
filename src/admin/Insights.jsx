import { useStore } from '../shared/store.js'
import { dayStats, topItems, avgRating } from '../shared/logic.js'
import { seedDemo, clearAll } from '../shared/actions.js'
import { formatPrice } from '../data/menu.js'
import { METHOD } from '../order/BillView.jsx'

const when = (t) => new Date(t).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })

export default function Insights() {
  const history = useStore('history', [])
  const feedback = useStore('feedback', [])
  const today = dayStats(history)
  const top = topItems(history, 5)
  const rating = avgRating(feedback)

  return (
    <div>
      <header className="adm-head">
        <h1>Đánh giá & doanh thu</h1>
        <div className="toolbar">
          <button type="button" className="btn btn--ghost" onClick={seedDemo}>Tạo dữ liệu mẫu</button>
          <button type="button" className="link danger" onClick={() => confirm('Xoá toàn bộ order, hoá đơn, đánh giá demo?') && clearAll()}>Xoá dữ liệu demo</button>
        </div>
      </header>

      <dl className="kpis">
        <div><dt>Doanh thu hôm nay</dt><dd className="num">{formatPrice(today.revenue)}đ</dd></div>
        <div><dt>Hoá đơn hôm nay</dt><dd className="num">{today.bills}</dd></div>
        <div><dt>Trung bình / hoá đơn</dt><dd className="num">{formatPrice(today.avg)}đ</dd></div>
        <div><dt>Điểm đánh giá ({feedback.length} lượt)</dt><dd className="num">{rating ? `${String(rating).replace('.', ',')} / 5` : '—'}</dd></div>
      </dl>

      <div className="split">
        <section aria-labelledby="t-top">
          <h2 id="t-top" className="sub">Món bán chạy</h2>
          {top.length ? (
            <ol className="rank">
              {top.map((t) => <li key={t.name}><span>{t.name}</span><b className="num">{t.qty} phần</b></li>)}
            </ol>
          ) : <p className="muted">Chưa có hoá đơn nào.</p>}

          <h2 className="sub">Hoá đơn gần đây</h2>
          <ul className="recent">
            {[...history].reverse().slice(0, 8).map((h) => (
              <li key={h.id}>
                <span>Bàn {String(h.table).padStart(2, '0')} · {METHOD[h.method]}</span>
                <span className="muted">{when(h.paidAt)}</span>
                <b className="num">{formatPrice(h.total)}đ</b>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="t-fb">
          <h2 id="t-fb" className="sub">Đánh giá của khách</h2>
          {!feedback.length && <p className="muted">Chưa có đánh giá. Khách đánh giá ngay sau khi thanh toán.</p>}
          <ul className="fblist">
            {[...feedback].reverse().map((f) => (
              <li key={f.id}>
                <header>
                  <b aria-label={`${f.rating} sao`}>{'★'.repeat(f.rating)}<span className="dim">{'★'.repeat(5 - f.rating)}</span></b>
                  <span className="muted">Bàn {String(f.table).padStart(2, '0')} · {when(f.at)}</span>
                </header>
                {f.tags?.length > 0 && <p className="fbtags">{f.tags.map((t) => <span key={t}>{t}</span>)}</p>}
                {f.comment && <p>{f.comment}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
