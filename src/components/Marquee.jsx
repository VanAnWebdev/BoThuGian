import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, reduced } from '../lib/motion.js'
import { brand } from '../data/brand.js'
import './Marquee.css'

const items = ['Bò tơ tươi mỗi ngày', 'Lẩu hầm xương 12 giờ', 'Mở 16:00 – 23:00', '128 Tố Hữu, Đà Nẵng', brand.slogan]

// Băng chữ chạy: cuộn càng nhanh chạy càng nhanh, cuộn ngược thì chạy ngược
export default function Marquee() {
  const root = useRef(null)

  useGSAP(
    () => {
      if (reduced) return
      const loop = gsap.to('.mq-track', { xPercent: -50, ease: 'none', duration: 30, repeat: -1 })
      loop.totalTime(loop.duration() * 50) // chừa chỗ để chạy lùi
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 8)
          gsap.to(loop, {
            timeScale: self.direction * boost,
            duration: 0.2,
            overwrite: true,
            onComplete: () => gsap.to(loop, { timeScale: self.direction, duration: 1.2 }),
          })
        },
      })
    },
    { scope: root },
  )

  return (
    <div className="mq" ref={root}>
      <p className="sr-only">{items.join('. ')}</p>
      <div className="mq-track" aria-hidden="true">
        {[...items, ...items].map((t, i) => (
          <span key={i}>{t}<i className="star" /></span>
        ))}
      </div>
    </div>
  )
}
