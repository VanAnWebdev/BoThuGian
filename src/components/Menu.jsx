import { useRef, useState } from 'react'
import { gsap, useGSAP, reduced } from '../lib/motion.js'
import { menu, formatPrice } from '../data/menu.js'
import { Sticker } from './ui.jsx'
import './Menu.css'

const count = menu.reduce((n, g) => n + g.items.length, 0)

export default function Menu() {
  const root = useRef(null)
  const pill = useRef(null)
  const tabs = useRef([])
  const first = useRef(true)
  const [cat, setCat] = useState(0)
  const group = menu[cat]

  useGSAP(
    () => {
      // Tab xuống dòng khi hẹp → pill trượt cả ngang lẫn dọc; đổi cỡ màn hình thì đặt lại
      const place = (duration) => {
        const tab = tabs.current[cat]
        gsap.to(pill.current, { x: tab.offsetLeft, y: tab.offsetTop, width: tab.offsetWidth, height: tab.offsetHeight, duration, ease: 'power3.out' })
      }
      place(first.current || reduced ? 0 : 0.5)
      const onResize = () => place(0)
      addEventListener('resize', onResize)
      const cleanup = () => removeEventListener('resize', onResize)
      if (reduced) return cleanup
      // Món hiện lần lượt: lần đầu khi cuộn tới, sau đó mỗi lần đổi tab
      gsap.from('.menu-item', {
        y: 28, autoAlpha: 0, stagger: 0.035, duration: 0.6, ease: 'power3.out',
        scrollTrigger: first.current ? { trigger: '.menu-list', start: 'top bottom' } : undefined,
      })
      first.current = false
      return cleanup
    },
    { scope: root, dependencies: [cat] },
  )

  return (
    <section id="thuc-don" className="menu" ref={root} aria-labelledby="menu-title">
      <div className="wrap">
        <header className="menu-head">
          <h2 id="menu-title">Thực đơn</h2>
          <p className="lead">{count} món, {menu.length} nhóm. Giá tính bằng đồng, chưa gồm VAT.</p>
          <Sticker className="menu-sticker" text={`${count} MÓN • BÒ TƠ TƯƠI • ${count} MÓN • BÒ TƠ TƯƠI • `} />
        </header>

        <div className="menu-tabs" role="tablist" aria-label="Nhóm món">
          <span className="menu-pill" ref={pill} aria-hidden="true" />
          {menu.map((g, i) => (
            <button
              key={g.id}
              ref={(el) => (tabs.current[i] = el)}
              type="button"
              role="tab"
              id={`tab-${g.id}`}
              aria-selected={i === cat}
              aria-controls="menu-panel"
              onClick={() => setCat(i)}
            >
              {g.name}
            </button>
          ))}
        </div>

        <div id="menu-panel" role="tabpanel" aria-labelledby={`tab-${group.id}`}>
          <ul className="menu-list" key={group.id}>
            {group.items.map((it, i) => (
              <li className="menu-item" key={i}>
                <div>
                  <h3>{it.name}</h3>
                  {(it.tag || it.note) && (
                    <p>
                      {it.tag && <span className="menu-tag">{it.tag}</span>}
                      {it.tag && it.note && ' · '}
                      {it.note}
                    </p>
                  )}
                </div>
                <span className="menu-price num">{formatPrice(it.price)}{it.unit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
