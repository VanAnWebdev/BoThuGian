import { useRef } from 'react'
import { gsap, useGSAP, introDone, finePointer, reduced, countUp } from '../lib/motion.js'
import { openStatus } from '../lib/hours.js'
import { brand } from '../data/brand.js'
import { Btn, Split, Sticker } from './ui.jsx'
import './Hero.css'

export default function Hero() {
  const root = useRef(null)
  const status = openStatus()

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      // Cảnh mở màn: chờ intro kéo màn xong mới chạy
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out', duration: 1.1 } })
      tl.from(q('h1 .w-in'), { yPercent: 115, rotate: 4, stagger: 0.07 })
        .from(q('.hero-lede, .hero-points li, .hero-ctas, .hero-stats'), { y: 28, autoAlpha: 0, stagger: 0.08, duration: 0.9 }, '-=0.8')
        .from(q('.hero-card'), { clipPath: 'inset(100% 0% 0% 0% round 28px)', duration: 1.3 }, 0.1)
        .from(q('.hero-card img'), { scale: 1.35, duration: 1.8 }, 0.1)
        .from(q('.hero-pop'), { scale: 0, rotate: -40, stagger: 0.12, duration: 1, ease: 'back.out(1.6)' }, 0.7)
      q('.hero-stats b').forEach((el) => tl.add(countUp(el), 0.3))
      introDone.then(() => (reduced ? tl.progress(1) : tl.play()))

      // Rời màn đầu: khung ảnh trôi lên chậm hơn chữ
      gsap.to(q('.hero-visual'), {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })

      // Parallax theo chuột: mỗi lớp lệch theo độ sâu data-depth
      if (!finePointer || reduced) return
      const layers = q('[data-depth]').map((el) => ({
        x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3' }),
        d: Number(el.dataset.depth),
      }))
      const move = (e) => {
        const nx = e.clientX / innerWidth - 0.5
        const ny = e.clientY / innerHeight - 0.5
        layers.forEach((l) => (l.x(nx * l.d * 48), l.y(ny * l.d * 48)))
      }
      root.current.addEventListener('pointermove', move)
      return () => root.current?.removeEventListener('pointermove', move)
    },
    { scope: root },
  )

  return (
    <section id="top" className="hero wrap" ref={root}>
      <div className="hero-text">
        <h1>
          <span className="sr-only">{brand.name}: </span>
          <Split text="Bò ngon từ thịt," /> <Split text="ngọt từ xương" />
        </h1>
        <p className="hero-lede lead">
          <strong>{brand.name}</strong> — quán bò tơ tươi và lẩu ở {brand.street}, {brand.city}.
        </p>
        <ul className="hero-points">
          <li>Bò tơ tươi về mỗi ngày, nói không với đông lạnh</li>
          <li>Nước lẩu hầm từ xương suốt 12 giờ</li>
          <li>Nước chấm, pate quán tự tay làm</li>
        </ul>
        <div className="hero-ctas">
          <Btn href="#dat-ban" data-cursor="Đặt bàn">Đặt bàn ngay</Btn>
          <Btn href="#thuc-don" className="btn--ghost">Xem thực đơn</Btn>
        </div>
        <dl className="hero-stats">
          <div><dt>sao trên Google</dt><dd><b className="num" data-to="4.6" data-dec="1">4,6</b> <i className="star" /></dd></div>
          <div><dt>đánh giá</dt><dd><b className="num" data-to={brand.reviews}>{brand.reviews}</b></dd></div>
          <div><dt>bò tươi</dt><dd><b className="num" data-to="100">100</b>%</dd></div>
        </dl>
      </div>

      <div className="hero-visual">
        <div className="hero-card" data-depth="0.35" data-cursor="Ngon!">
          <img src="/images/anh/lau-ban.webp" alt="Những mâm lẩu bò đầy ắp được bưng ra bàn" width="679" height="800" fetchPriority="high" />
        </div>
        <img className="hero-pop hero-dish" data-depth="1.3" src="/images/mon/suon-nui-lua.webp" alt="Sườn bò núi lửa" width="666" height="585" />
        <img className="hero-pop hero-bone" data-depth="0.9" src="/images/mon/ong-tuy.webp" alt="Ống tủy nhất dương" width="525" height="622" />
        <Sticker className="hero-pop hero-sticker" data-depth="1.6" text="MUST TRY • BEST SELLER • BÒ TƠ TƯƠI • " />
        <p className={`hero-pop hero-open${status.open ? ' is-open' : ''}`} data-depth="0.6">
          <i aria-hidden="true" />
          {status.open ? 'Đang mở · đến 23:00' : `Mở cửa ${brand.hours}`}
        </p>
      </div>
    </section>
  )
}
