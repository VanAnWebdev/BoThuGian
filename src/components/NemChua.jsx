import { useRef } from 'react'
import { gsap, useGSAP, reduced } from '../lib/motion.js'
import { menu, formatPrice } from '../data/menu.js'
import { Btn, Split, Sticker } from './ui.jsx'
import './NemChua.css'

const price = menu.flatMap((g) => g.items).find((it) => it.name === 'Nem chua bò tơ').price

// Cách làm theo bài "Nem chua bò tơ 2 Phệ", Travel+ số 01/2022, tr. 140–141
const steps = [
  'Da bò tơ Duy Xuyên làm sạch, hầm kỹ rồi thái sợi mỏng',
  'Trộn thịt bò tươi thái mỏng với riềng, ớt, nước cốt chanh, nước mắm',
  'Gói chặt trong vỏ bắp, phơi nắng 4–5 tiếng cho nem lên men tự nhiên',
]

export default function NemChua() {
  const root = useRef(null)

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)
      gsap
        .timeline({ scrollTrigger: { trigger: q('.nem-top')[0], start: 'top 70%' } })
        .from(q('.nem-dish'), { clipPath: 'inset(100% 0% 0% 0% round 28px)', duration: 1.3, ease: 'power4.out' })
        .from(q('.nem-dish img'), { scale: 1.3, duration: 1.6, ease: 'power3.out' }, 0)
        .from(q('.nem-sticker'), { scale: 0, rotate: -60, duration: 0.9, ease: 'back.out(2)' }, 0.5)
        .from(q('.nem-text h2 .w-in'), { yPercent: 115, stagger: 0.06, duration: 1, ease: 'power4.out' }, 0.1)
        .from(q('.nem-text > :not(h2), .nem-steps li'), { y: 30, autoAlpha: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out' }, 0.4)

      // Hai ảnh mang về: trồi lên lệch nhau, cuộn tiếp thì trôi ngược chiều
      q('.nem-pack figure').forEach((fig, i) => {
        gsap.from(fig, { y: 80, rotate: i ? 4 : -4, autoAlpha: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: fig, start: 'top 85%' } })
        gsap.fromTo(fig.querySelector('img'), { yPercent: -6 }, {
          yPercent: 6, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })

      gsap
        .timeline({ scrollTrigger: { trigger: q('.nem-press')[0], start: 'top 75%' } })
        .from(q('.nem-mag'), { y: 100, rotate: -10, autoAlpha: 0, duration: 1.2, ease: 'power4.out' })
        .from(q('.nem-quote > *'), { y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out' }, 0.3)
    },
    { scope: root },
  )

  return (
    <section id="nem-chua" className="nem" ref={root} aria-labelledby="nem-title">
      <div className="nem-top wrap">
        <figure className="nem-dish" data-cursor="Thử nem!">
          <img src="/images/nem-chua/dia-nem.webp" alt="Nem chua bò tơ gói trong vỏ bắp, bày trên mẹt tre với ớt và chanh" width="1400" height="1553" loading="lazy" />
          <Sticker className="nem-sticker" text={`BEST SELLER • ${formatPrice(price)}Đ • `} />
        </figure>

        <div className="nem-text">
          <h2 id="nem-title"><Split text="Nem chua bò tơ" /></h2>
          <p className="lead">
            Món khai vị được nhiều khách gọi nhất: giữ trọn vị ngọt của thịt bò tươi, độ dai giòn của da bò tơ, cay nhẹ của ớt
            và thơm nồng của riềng.
          </p>
          <ul className="nem-steps">
            {steps.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <p className="nem-price num">{formatPrice(price)}đ</p>
          <Btn href="#dat-ban" data-cursor="Đặt bàn">Đặt bàn thử nem</Btn>
        </div>
      </div>

      <div className="nem-pack wrap">
        <figure>
          <div className="nem-pack-img">
            <img src="/images/nem-chua/dong-goi.webp" alt="Nem chua bò tơ đóng gói hút chân không" width="1100" height="1467" loading="lazy" />
          </div>
          <figcaption><h3>Đóng gói hút chân không</h3><p>Từng trái nem được hút chân không, giữ vị chua tự nhiên khi mang về.</p></figcaption>
        </figure>
        <figure>
          <div className="nem-pack-img">
            <img src="/images/nem-chua/gio-qua.webp" alt="Giỏ tre đựng nem chua bò tơ đã đóng gói" width="1100" height="1467" loading="lazy" />
          </div>
          <figcaption><h3>Giỏ nem làm quà</h3><p>Nem xếp trong giỏ tre, tiện mang về hoặc biếu bạn bè.</p></figcaption>
        </figure>
      </div>

      <div className="nem-press wrap">
        <div className="nem-press-inner">
          <img className="nem-mag" src="/images/nem-chua/bao-travel.webp" alt="Tạp chí Travel+ số 01/2022 mở trang bài Nem chua bò tơ" width="1600" height="1200" loading="lazy" />
          <blockquote className="nem-quote">
            <p className="nem-press-label">Travel+ số 01/2022 · Đi đâu, ăn gì cùng Vua đầu bếp</p>
            <p className="nem-quote-text">
              “Khi dừng chân tại vùng đất Duy Xuyên - Quảng Nam, tôi vô cùng ấn tượng với hình ảnh những đàn bò được chăn thả tự
              nhiên trên những cánh đồng đầy nắng và gió.”
            </p>
            <footer>Chef Phạm Tuấn Hải, giám khảo Vua Đầu Bếp Việt Nam</footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
