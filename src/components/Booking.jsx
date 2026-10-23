import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, reduced } from '../lib/motion.js'
import { brand } from '../data/brand.js'
import { openStatus, defaultBookingDate, slots } from '../lib/hours.js'
import { Btn, Split } from './ui.jsx'
import './Booking.css'

export default function Booking() {
  const root = useRef(null)
  const [status, setStatus] = useState(openStatus)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const t = setInterval(() => setStatus(openStatus()), 60_000)
    return () => clearInterval(t)
  }, [])

  useGSAP(
    () => {
      if (reduced) return
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%' } })
        .from('.book-info h2 .w-in', { yPercent: 115, stagger: 0.06, duration: 1, ease: 'power4.out' })
        .from('.book-info > :not(h2)', { y: 30, autoAlpha: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .from('.book-card', { y: 80, rotate: 3, autoAlpha: 0, duration: 1.1, ease: 'power4.out' }, 0.1)
    },
    { scope: root },
  )

  // Hiện thẻ xác nhận: nảy nhẹ
  useGSAP(
    () => {
      if (message && !reduced) gsap.from('.book-done > *', { y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.6, ease: 'back.out(1.7)' })
    },
    { scope: root, dependencies: [message] },
  )

  // Chưa có backend: gom yêu cầu thành tin nhắn để khách gửi SMS / gọi quán.
  // Khi có API đặt bàn, thay setMessage bằng POST tới API.
  function submit(e) {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget))
    const [y, m, d] = f.date.split('-')
    setMessage(
      `Đặt bàn Bò Thư Giãn: ${f.name.trim()}, SĐT ${f.phone.trim()}, ${f.people} người, ${f.time} ngày ${d}/${m}/${y}.` +
        (f.note.trim() ? ` Ghi chú: ${f.note.trim()}` : ''),
    )
  }

  return (
    <section id="dat-ban" className="book" ref={root} aria-labelledby="book-title">
      <div className="book-inner wrap">
        <div className="book-info">
          <h2 id="book-title"><Split text="Tối nay ăn bò không?" /></h2>
          <p className={`book-status${status.open ? ' is-open' : ''}`}><i aria-hidden="true" />{status.text}</p>
          <dl className="book-facts">
            <div><dt>Địa chỉ</dt><dd>{brand.street}, {brand.city}</dd></div>
            <div><dt>Giờ mở cửa</dt><dd className="num">{brand.hours}, mỗi ngày</dd></div>
            <div><dt>Hotline</dt><dd><a href={`tel:${brand.tel}`} className="num">{brand.phone}</a></dd></div>
          </dl>
          <div className="book-map" data-cursor="Chỉ đường">
            <iframe src={brand.mapEmbed} title="Bản đồ đường đến Bò Thư Giãn, 128 Tố Hữu" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <a className="book-dir" href={brand.maps} target="_blank" rel="noreferrer">Mở chỉ đường trên Google Maps →</a>
        </div>

        <div className="book-card">
          {message ? (
            <div className="book-done" role="status">
              <h3>Gần xong rồi!</h3>
              <p className="book-msg">{message}</p>
              <p>Gửi tin này cho quán để giữ bàn, quán sẽ gọi lại xác nhận.</p>
              <Btn href={`sms:${brand.tel}?&body=${encodeURIComponent(message)}`}>Gửi SMS cho quán</Btn>
              <a href={`tel:${brand.tel}`}>Hoặc gọi {brand.phone}</a>
              <button type="button" className="book-link" onClick={() => setMessage(null)}>Sửa lại</button>
            </div>
          ) : (
            <form className="book-form" onSubmit={submit}>
              <h3>Giữ bàn cho bạn</h3>
              <label className="full">
                <span>Họ tên</span>
                <input name="name" required autoComplete="name" maxLength={60} placeholder="Nguyễn Văn A" />
              </label>
              <label className="full">
                <span>Số điện thoại</span>
                <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern="[0-9 +.]{9,15}" placeholder="09xx xxx xxx" />
              </label>
              <label>
                <span>Ngày</span>
                <input name="date" type="date" required defaultValue={defaultBookingDate()} min={defaultBookingDate()} />
              </label>
              <label>
                <span>Giờ</span>
                <select name="time" defaultValue="18:30">
                  {slots.map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label>
                <span>Số người</span>
                <input name="people" type="number" min="1" max="60" defaultValue="4" required />
              </label>
              <label>
                <span>Ghi chú</span>
                <input name="note" maxLength={120} placeholder="Sinh nhật, bàn ngoài trời…" />
              </label>
              <Btn type="submit" className="full" data-cursor="Gửi">Gửi yêu cầu đặt bàn</Btn>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
