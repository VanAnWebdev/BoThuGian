import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, lenis, finishIntro, shouldPlayIntro } from '../lib/motion.js'
import './Intro.css'

// Màn mở trang: "rót" màu vào logo cốc bia từ đáy lên, logo nảy, rồi màn kéo lên mở trang.
export default function Intro() {
  const [show, setShow] = useState(shouldPlayIntro)
  const root = useRef(null)

  useEffect(() => {
    if (!show) finishIntro()
  }, [show])

  useGSAP(
    () => {
      if (!show) return
      lenis?.stop()
      const pct = { v: 0 }
      const label = root.current.querySelector('.intro-pct')
      gsap
        .timeline({
          onComplete: () => {
            try { sessionStorage.setItem('btg-intro', '1') } catch { /* chế độ riêng tư */ }
            lenis?.start()
            setShow(false)
          },
        })
        .from('.intro-logo', { y: 40, autoAlpha: 0, duration: 0.5, ease: 'back.out(2)' })
        .to('.intro-fill', { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'power2.inOut' })
        .to(pct, { v: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: () => (label.textContent = Math.round(pct.v)) }, '<')
        .to('.intro-logo', { scale: 1.12, duration: 0.18, ease: 'power2.out' })
        .to('.intro-logo', { scale: 1, duration: 0.5, ease: 'elastic.out(1.2, 0.4)' })
        .to('.intro-note', { autoAlpha: 0, duration: 0.2 }, '<')
        .add(finishIntro, '+=0.05')
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power4.inOut' }, '<')
        .to('.intro-logo', { yPercent: -60, autoAlpha: 0, duration: 0.6, ease: 'power3.in' }, '<')
    },
    { scope: root, dependencies: [show] },
  )

  if (!show) return null
  return (
    <div className="intro" ref={root} aria-hidden="true">
      <div className="intro-logo">
        <img className="intro-ghost" src="/images/logo.webp" alt="" width="446" height="512" />
        <img className="intro-fill" src="/images/logo.webp" alt="" width="446" height="512" />
      </div>
      <p className="intro-note">Đang rót bia… <span className="intro-pct num">0</span>%</p>
    </div>
  )
}
