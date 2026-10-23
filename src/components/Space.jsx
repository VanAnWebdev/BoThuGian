import { useRef } from 'react'
import { gsap, useGSAP, reduced, countUp } from '../lib/motion.js'
import { brand } from '../data/brand.js'
import './Space.css'

// Ảnh trong menu, bày như ảnh chụp rải trên bàn nhậu rồi xếp lại khi cuộn
const photos = [
  ['noi-nhung', 'Bò nhúng ba vị', 591, 800, -14, -26],
  ['lau-noi-tam', 'Lẩu bò nội tâm', 530, 800, 9, -8],
  ['bo-nuong', 'Bò tơ nướng than', 564, 800, -7, 10],
  ['suon-que', 'Sườn que nướng', 448, 800, 15, 28],
]

// Chủ đề khách nhắc trong đánh giá Google Maps (đếm ngày 23/10/2026)
const topics = [
  ['nhân viên nhiệt tình', 80], ['không gian thoáng', 34], ['lẩu', 25], ['nhân viên dễ thương', 9],
  ['không gian ấm cúng', 5], ['sườn bò núi lửa', 4], ['bò mềm', 3], ['lẩu sườn bò nấu khế', 2],
]

export default function Space() {
  const root = useRef(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      if (reduced) return
      // Ảnh từ hai bên bay vào, xoay lệch → xếp gọn khi tới giữa màn hình
      q('.polaroid').forEach((el, i) => {
        const [, , , , rot, x] = photos[i] ?? [0, 0, 0, 0, 0, 0]
        gsap.fromTo(el, { rotate: rot * 2, xPercent: x * 6, y: 160 }, {
          rotate: rot * 0.35, xPercent: 0, y: 0, ease: 'power2.out',
          scrollTrigger: { trigger: q('.space-table')[0], start: 'top bottom', end: 'center 60%', scrub: 1 },
        })
      })
      gsap.from(q('.space-head > *'), {
        y: 40, autoAlpha: 0, stagger: 0.1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
      // Số đếm chạy + chủ đề đánh giá nảy ra lần lượt
      const tl = gsap.timeline({ scrollTrigger: { trigger: q('.space-stats')[0], start: 'top 85%' } })
      q('.space-stats b').forEach((el) => tl.add(countUp(el, { duration: 2 }), 0))
      tl.from(q('.space-topics li'), { scale: 0.4, autoAlpha: 0, stagger: 0.06, duration: 0.6, ease: 'back.out(2.5)' }, 0.3)
    },
    { scope: root },
  )

  return (
    <section id="danh-gia" className="space" ref={root} aria-labelledby="space-title">
      <header className="space-head wrap">
        <h2 id="space-title">Chill đúng nghĩa</h2>
        <p className="lead">
          Không gian thoáng, nhạc nhẹ, nhân viên nhiệt tình. Đó là điều khách nhắc nhiều nhất khi chấm điểm quán trên Google.
        </p>
      </header>

      <div className="space-table" data-cursor="Chill">
        {brand.video && (
          <video className="polaroid space-video" src={brand.video.src} poster={brand.video.poster} autoPlay muted loop playsInline />
        )}
        {photos.map(([file, caption, w, h]) => (
          <figure className="polaroid" key={file}>
            <img src={`/images/anh/${file}.webp`} alt={caption} width={w} height={h} loading="lazy" />
            <figcaption>{caption}</figcaption>
          </figure>
        ))}
      </div>

      <div className="space-proof wrap">
        <dl className="space-stats">
          <div><dt>điểm trung bình trên Google</dt><dd><b className="num" data-to="4.6" data-dec="1">4,6</b> <i className="star" /></dd></div>
          <div><dt>lượt đánh giá</dt><dd><b className="num" data-to={brand.reviews}>{brand.reviews}</b></dd></div>
          <div><dt>lần khen “nhân viên nhiệt tình”</dt><dd><b className="num" data-to="80">80</b></dd></div>
        </dl>
        <ul className="space-topics" aria-label="Chủ đề khách nhắc trong đánh giá">
          {topics.map(([t, n]) => <li key={t}>{t} <b className="num">{n}</b></li>)}
        </ul>
        <a className="btn btn--ghost" href={brand.maps} target="_blank" rel="noreferrer">Đọc đánh giá trên Google Maps</a>
      </div>
    </section>
  )
}
