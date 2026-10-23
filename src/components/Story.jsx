import { useRef } from 'react'
import { gsap, useGSAP, DESKTOP, MOBILE } from '../lib/motion.js'
import './Story.css'

// "Ba chữ vàng" trang 2 menu
const steps = [
  {
    word: 'Tươi', en: 'True taste',
    text: 'Nói không với đông lạnh dài ngày. Quán chỉ chọn bò tươi rói về mỗi ngày để giữ vị ngọt tự nhiên, đậm đà và mọng nước trong từng thớ thịt.',
    img: '/images/mon/thit-tuoi.webp', w: 727, h: 430, alt: 'Đĩa thịt bò tơ tươi thái mỏng', cutout: true,
  },
  {
    word: 'Chill', en: 'Relaxed mind',
    text: 'Đúng như cái tên Thư Giãn: từ không gian, tiếng nhạc đến cách phục vụ đều để bạn rũ bỏ áp lực, tận hưởng khoảnh khắc ở đây và bây giờ.',
    img: '/images/anh/noi-nhung.webp', w: 591, h: 800, alt: 'Ba nồi nước nhúng bốc khói trên bếp than nhỏ',
  },
  {
    word: 'Tâm', en: 'Pure heart',
    text: 'Sạch sẽ, an toàn và tử tế. Từng món ăn, từng chén nước chấm độc quyền được chăm chút như nấu cho chính người thân.',
    img: '/images/anh/dau-bep.webp', w: 583, h: 800, alt: 'Đầu bếp của quán nâng nguyên giàn xương sườn bò tươi',
  },
]

export default function Story() {
  const root = useRef(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      // Máy tính: ghim section, cuộn để lật qua Tươi → Chill → Tâm
      mm.add(DESKTOP, () => {
        const words = q('.story-word'), descs = q('.story-desc'), figs = q('.story-fig')
        root.current.classList.add('is-pinned')
        gsap.set([words.slice(1), descs.slice(1)], { yPercent: 80, autoAlpha: 0 })
        gsap.set(figs.slice(1), { clipPath: 'inset(100% 0% 0% 0% round 28px)' })
        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=160%',
            pin: true,
            scrub: 1,
            snap: { snapTo: 'labels', duration: { min: 0.3, max: 0.8 }, ease: 'power2.inOut' },
          },
        })
        tl.addLabel('s0')
        for (let i = 1; i < steps.length; i++) {
          tl.to(words[i - 1], { yPercent: -80, autoAlpha: 0 })
            .to(descs[i - 1], { yPercent: -40, autoAlpha: 0 }, '<')
            .to(figs[i], { clipPath: 'inset(0% 0% 0% 0% round 28px)' }, '<')
            .fromTo(figs[i].querySelector('img'), { scale: 1.3 }, { scale: 1 }, '<')
            .to(figs[i - 1], { scale: 0.9, autoAlpha: 0.4 }, '<')
            .to(words[i], { yPercent: 0, autoAlpha: 1 }, '<0.2')
            .to(descs[i], { yPercent: 0, autoAlpha: 1 }, '<0.1')
            .addLabel(`s${i}`)
        }
        tl.fromTo(q('.story-bar i'), { scaleX: 1 / steps.length }, { scaleX: 1, ease: 'none', duration: tl.duration() }, 0)
        return () => root.current?.classList.remove('is-pinned')
      })

      // Điện thoại: không ghim, từng khối hiện dần khi cuộn tới
      mm.add(MOBILE, () => {
        q('.story-step').forEach((step) =>
          gsap.from(step.children, {
            y: 40, autoAlpha: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 80%' },
          }),
        )
      })
    },
    { scope: root },
  )

  return (
    <section id="gioi-thieu" className="story" ref={root}>
      <div className="story-inner wrap">
        <header className="story-head">
          <h2>Ba chữ “vàng” tại Bò Thư Giãn</h2>
          <div className="story-bar" aria-hidden="true"><i /></div>
        </header>
        <div className="story-steps">
          {steps.map((s) => (
            <article className="story-step" key={s.word}>
              <figure className={`story-fig${s.cutout ? ' is-cutout' : ''}`}>
                <img src={s.img} alt={s.alt} width={s.w} height={s.h} loading="lazy" />
              </figure>
              <h3 className="story-word">{s.word}<small>{s.en}</small></h3>
              <p className="story-desc lead">{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
