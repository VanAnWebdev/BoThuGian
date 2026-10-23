import { useRef } from 'react'
import { gsap, useGSAP, finePointer, reduced } from '../lib/motion.js'
import { signature, formatPrice } from '../data/menu.js'
import './Signature.css'

export default function Signature() {
  const root = useRef(null)

  useGSAP(
    () => {
      if (reduced) return
      const cleanups = []
      gsap.from('.sig-head > *', {
        y: 40, autoAlpha: 0, stagger: 0.1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.sig-head', start: 'top 80%' },
      })

      gsap.utils.toArray('.sig-row', root.current).forEach((row) => {
        const visual = row.querySelector('.sig-visual')
        // Vào khung: đĩa nở ra, món xoay vào, chữ trồi lên lần lượt
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: 'top 75%' } })
          .from(row.querySelector('.sig-disc'), { scale: 0, duration: 1.1, ease: 'expo.out' })
          .from(row.querySelector('.sig-dish'), { scale: 0.5, rotate: -60, autoAlpha: 0, duration: 1.3, ease: 'back.out(1.3)' }, '<0.1')
          .from(row.querySelectorAll('.sig-text > *'), { y: 36, autoAlpha: 0, stagger: 0.08, duration: 0.9, ease: 'power3.out' }, '<0.15')
          .from(row.querySelector('.sig-tag'), { scale: 0, rotate: 40, duration: 0.7, ease: 'back.out(3)' }, 0.3)

        // Cuộn qua: món xoay chậm như đặt trên mâm quay
        gsap.fromTo(row.querySelector('.sig-spin'), { rotate: -10 }, {
          rotate: 10, ease: 'none',
          scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
        })

        // Rê chuột: cả đĩa nghiêng 3D theo con trỏ
        if (!finePointer) return
        gsap.set(visual, { transformPerspective: 900 })
        const rx = gsap.quickTo(visual, 'rotationX', { duration: 0.6, ease: 'power3' })
        const ry = gsap.quickTo(visual, 'rotationY', { duration: 0.6, ease: 'power3' })
        const move = (e) => {
          const r = visual.getBoundingClientRect()
          ry(((e.clientX - r.left) / r.width - 0.5) * 18)
          rx(-((e.clientY - r.top) / r.height - 0.5) * 18)
        }
        const leave = () => (rx(0), ry(0))
        visual.addEventListener('pointermove', move)
        visual.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          visual.removeEventListener('pointermove', move)
          visual.removeEventListener('pointerleave', leave)
        })
      })
      return () => cleanups.forEach((fn) => fn())
    },
    { scope: root },
  )

  return (
    <section id="mon-ngon" className="sig" ref={root} aria-labelledby="sig-title">
      <header className="sig-head wrap">
        <h2 id="sig-title">Món phải thử</h2>
        <p className="lead">Những món mang nhãn Best seller và Must try trên thực đơn của quán.</p>
      </header>

      {signature.map((d, i) => (
        <article className={`sig-row wrap${i % 2 ? ' is-flip' : ''}`} key={d.name}>
          <div className="sig-visual" style={{ '--disc': d.disc }} data-cursor="Ngon!">
            <div className="sig-disc" />
            <div className="sig-spin">
              <img className="sig-dish" src={`/images/mon/${d.img}.webp`} alt={d.name} width={d.w} height={d.h} loading="lazy" />
            </div>
            <span className="sig-tag">{d.tag}</span>
          </div>
          <div className="sig-text">
            <h3>{d.name}</h3>
            <p className="lead">{d.fact}</p>
            <p className="sig-price num">{formatPrice(d.price)}đ</p>
            <a className="sig-link" href="#dat-ban">Đặt bàn thử món này <span aria-hidden="true">→</span></a>
          </div>
        </article>
      ))}
    </section>
  )
}
