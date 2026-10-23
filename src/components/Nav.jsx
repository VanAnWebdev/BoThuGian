import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP, lenis } from '../lib/motion.js'
import { brand } from '../data/brand.js'
import './Nav.css'

const links = [
  ['#top', 'Trang chủ'],
  ['#gioi-thieu', 'Giới thiệu'],
  ['#mon-ngon', 'Món ngon'],
  ['#thuc-don', 'Thực đơn'],
  ['#dat-ban', 'Đặt bàn'],
]

export default function Nav() {
  const root = useRef(null)
  const pill = useRef(null)
  const items = useRef([])
  const [active, setActive] = useState(0)
  const [pillAt, setPillAt] = useState(0)
  const [open, setOpen] = useState(false)

  // Viên pill mờ trượt theo mục đang rê chuột, không thì nằm dưới mục đang xem (mục này tô cam bằng CSS)
  const placePill = () => {
    const el = items.current[pillAt]
    if (el) gsap.to(pill.current, { x: el.offsetLeft, width: el.offsetWidth, duration: 0.5, ease: 'power3.out' })
  }
  useEffect(placePill, [pillAt])
  useEffect(() => setPillAt(active), [active])
  useEffect(() => {
    window.addEventListener('resize', placePill)
    return () => window.removeEventListener('resize', placePill)
  })

  useGSAP(
    () => {
      links.forEach(([href], i) =>
        ScrollTrigger.create({
          trigger: href,
          start: 'top center',
          end: 'bottom center',
          refreshPriority: -1, // tính sau các đoạn ghim bên dưới
          onToggle: (self) => self.isActive && setActive(i),
        }),
      )
      // Cuộn xuống thì ẩn thanh điều hướng, cuộn lên thì hiện lại
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => root.current.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > 300),
      })
    },
    { scope: root },
  )

  // Menu toàn màn hình trên điện thoại
  useGSAP(
    () => {
      if (!open) return
      lenis?.stop()
      gsap.from('.nav-sheet li', { yPercent: 120, autoAlpha: 0, stagger: 0.06, duration: 0.7, ease: 'power4.out' })
      return () => lenis?.start()
    },
    { scope: root, dependencies: [open] },
  )

  return (
    <header className={`nav${open ? ' is-open' : ''}`} ref={root}>
      <a href="#top" className="nav-logo" aria-label={`${brand.name} — về đầu trang`}>
        <img src="/images/logo.webp" alt="" width="446" height="512" />
      </a>

      <nav className="nav-links" aria-label="Điều hướng chính" onMouseLeave={() => setPillAt(active)}>
        <span className="nav-pill" ref={pill} aria-hidden="true" />
        {links.map(([href, label], i) => (
          <a
            key={href}
            href={href}
            ref={(el) => (items.current[i] = el)}
            aria-current={i === active ? 'true' : undefined}
            onMouseEnter={() => setPillAt(i)}
          >
            {label}
          </a>
        ))}
      </nav>

      <a className="btn nav-call num" href={`tel:${brand.tel}`}>{brand.phone}</a>
      <button className="nav-burger" type="button" aria-expanded={open} aria-controls="nav-sheet" onClick={() => setOpen((o) => !o)}>
        {open ? 'Đóng' : 'Menu'}
      </button>

      <div id="nav-sheet" className="nav-sheet" inert={!open}>
        <ul>
          {links.map(([href, label]) => (
            <li key={href}><a href={href} onClick={() => setOpen(false)}>{label}</a></li>
          ))}
        </ul>
        <a className="btn" href={`tel:${brand.tel}`}>Gọi {brand.phone}</a>
      </div>
    </header>
  )
}
