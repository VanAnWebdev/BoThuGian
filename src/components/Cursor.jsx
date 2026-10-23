import { useRef } from 'react'
import { gsap, useGSAP, finePointer } from '../lib/motion.js'
import './Cursor.css'

// Con trỏ tuỳ biến (chỉ máy có chuột). Vùng có data-cursor="..." hiện nhãn trong vòng tròn.
export default function Cursor() {
  const root = useRef(null)

  useGSAP(() => {
    if (!finePointer) return
    const el = root.current
    const dot = el.querySelector('.cursor-dot')
    const ring = el.querySelector('.cursor-ring')
    const label = el.querySelector('.cursor-label')
    document.documentElement.classList.add('has-cursor')

    const dx = gsap.quickTo(dot, 'x', { duration: 0.12 })
    const dy = gsap.quickTo(dot, 'y', { duration: 0.12 })
    const rx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' })
    const ry = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' })

    const move = (e) => {
      el.classList.add('is-on')
      dx(e.clientX), dy(e.clientY), rx(e.clientX), ry(e.clientY)
    }
    const over = (e) => {
      const target = e.target.closest('[data-cursor], a, button, select, label')
      const text = target?.closest('[data-cursor]')?.dataset.cursor
      el.classList.toggle('is-label', !!text)
      el.classList.toggle('is-link', !!target && !text)
      if (text) label.textContent = text
    }
    const out = () => el.classList.remove('is-on')

    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', over)
    document.documentElement.addEventListener('pointerleave', out)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', out)
      document.documentElement.classList.remove('has-cursor')
    }
  })

  return (
    <div className="cursor" ref={root} aria-hidden="true">
      <div className="cursor-ring"><span className="cursor-label" /></div>
      <div className="cursor-dot" />
    </div>
  )
}
