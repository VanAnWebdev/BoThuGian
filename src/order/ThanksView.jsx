import { useState } from 'react'
import { submitFeedback, closeTable } from '../shared/actions.js'
import { formatPrice } from '../data/menu.js'
import { brand } from '../data/brand.js'
import { go } from './OrderApp.jsx'

const TAGS = ['Món ngon', 'Bò tươi', 'Phục vụ nhanh', 'Nhân viên dễ thương', 'Không gian chill', 'Giá hợp lý']
const LABELS = ['', 'Chưa hài lòng', 'Tạm được', 'Ổn', 'Ngon', 'Tuyệt vời']

export default function ThanksView({ table, bill }) {
  const [rating, setRating] = useState(0)
  const [tags, setTags] = useState([])
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)

  const toggle = (t) => setTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))
  const send = (e) => {
    e.preventDefault()
    submitFeedback(table, { rating, tags, comment: comment.trim() })
    setSent(true)
    go('thanks') // phiên đã đóng: giữ khách ở trang cảm ơn
  }

  if (sent || !bill || bill.feedbackDone) {
    return (
      <div className="thanks">
        <img src="/images/logo.webp" alt="" width="640" height="543" />
        <h1>Cảm ơn bạn!</h1>
        <p>Góp ý của bạn giúp quán làm tốt hơn mỗi ngày. Hẹn gặp lại ở 128 Tố Hữu nhé.</p>
        <a className="btn" href="/#dat-ban">Đặt bàn lần sau</a>
        <button type="button" className="btn btn--ghost" onClick={() => go('menu')}>Bắt đầu gọi món mới</button>
        <a className="link" href={brand.facebook} target="_blank" rel="noreferrer">Theo dõi Bò Thư Giãn trên Facebook</a>
      </div>
    )
  }

  return (
    <div className="thanks">
      <div className="paid-mark" aria-hidden="true">✓</div>
      <h1>Thanh toán thành công</h1>
      {bill?.total ? <p className="num paid-total">{formatPrice(bill.total)}đ</p> : null}
      <p>Cảm ơn bạn đã ghé Bò Thư Giãn. Bữa nay thế nào?</p>

      <form className="feedback" onSubmit={send}>
        <fieldset className="stars">
          <legend>Chấm điểm bữa ăn</legend>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={n <= rating ? 'is-on' : undefined}>
              <input type="radio" name="rating" value={n} checked={rating === n} onChange={() => setRating(n)} required />
              <span aria-hidden="true">★</span>
              <span className="sr-only">{n} sao</span>
            </label>
          ))}
          <p className="star-label" aria-live="polite">{LABELS[rating]}</p>
        </fieldset>

        <fieldset className="chips">
          <legend>Bạn thích điều gì?</legend>
          {TAGS.map((t) => (
            <label key={t}>
              <input type="checkbox" checked={tags.includes(t)} onChange={() => toggle(t)} />
              <span>{t}</span>
            </label>
          ))}
        </fieldset>

        <label className="comment">
          <span>Góp ý thêm cho quán</span>
          <textarea rows="3" maxLength={300} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Món nào ngon, chỗ nào cần cải thiện…" />
        </label>

        <button className="btn" type="submit" disabled={!rating}>Gửi đánh giá</button>
        <button type="button" className="link" onClick={() => (closeTable(table), setSent(true), go('thanks'))}>Bỏ qua</button>
      </form>
    </div>
  )
}
