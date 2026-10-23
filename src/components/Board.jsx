import { useRef } from 'react'
import { gsap, useGSAP, DESKTOP } from '../lib/motion.js'
import { Btn } from './ui.jsx'
import './Board.css'

// Năm phần thịt trên thớt (ảnh trang 19 menu). Mô tả phần thịt: cần quán duyệt.
const cuts = [
  ['bap', 'Bắp bò', 'Gân giòn sần sật, nhúng vừa tái là ngon nhất.', 360, 480],
  ['nam', 'Nạm bò', 'Thớ thịt xen gân mỏng, ngọt và dai nhẹ.', 300, 400],
  ['gu', 'Gù bò', 'Phần u vai mềm, vân mỡ đều, béo mà không ngấy.', 360, 480],
  ['gau', 'Gầu bò', 'Mỡ giòn béo ngậy, càng nhúng càng thơm.', 300, 400],
  ['phile', 'Bò phile', 'Thăn nạc mềm, ngọt thịt, hợp người ăn ít béo.', 300, 400],
]

export default function Board() {
  const root = useRef(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      // Máy tính: ghim section, cuộn dọc → thớt trượt ngang, thước đếm 0 → 100 cm
      mm.add(DESKTOP, () => {
        root.current.classList.add('is-pinned')
        const track = q('.board-track')[0]
        const cm = q('.board-cm b')[0]
        const bar = gsap.quickSetter(q('.board-bar i')[0], 'scaleX')
        const distance = () => track.scrollWidth - window.innerWidth
        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              cm.textContent = Math.round(self.progress * 100)
              bar(self.progress)
            },
          },
        })
        // Ảnh trong từng khung trôi ngược chiều → chiều sâu
        q('.board-img img').forEach((img) =>
          gsap.fromTo(img, { xPercent: -10 }, {
            xPercent: 10, ease: 'none',
            scrollTrigger: { trigger: img.parentNode, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
          }),
        )
        // Mỗi khung nhún lên khi trượt vào giữa màn hình
        q('.board-cut, .board-panel').forEach((card) =>
          gsap.from(card, {
            yPercent: 14, rotate: 4, autoAlpha: 0.3, ease: 'power2.out',
            scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left 95%', end: 'left 55%', scrub: true },
          }),
        )
        return () => root.current?.classList.remove('is-pinned')
      })
    },
    { scope: root },
  )

  return (
    <section id="thot-bo" className="board" ref={root} aria-labelledby="board-title">
      <div className="board-track">
        <div className="board-intro">
          <h2 id="board-title">Thớt bò dài 1 mét</h2>
          <p className="lead">
            Set nhúng lẩu 2 ngăn: năm loại bò tươi xếp trên một thớt gỗ dài một mét, sáu loại rau đồng nội và hai
            vị nước lẩu tuỳ chọn.
          </p>
          <p className="board-price num">379.000đ</p>
          <Btn href="#dat-ban" data-cursor="Đặt bàn">Đặt set này</Btn>
          <p className="board-hint">
            <span className="board-hint-scroll">Cuộn xuống để kéo hết thớt</span>
            <span className="board-hint-swipe">Vuốt sang để xem hết thớt</span> <span aria-hidden="true">→</span>
          </p>
        </div>

        {cuts.map(([file, name, text, w, h]) => (
          <figure className="board-cut" key={file} data-cursor="Tươi!">
            <div className="board-img">
              <img src={`/images/thot/${file}.webp`} alt={`${name} tươi thái mỏng trên thớt gỗ`} width={w} height={h} loading="lazy" />
            </div>
            <figcaption>
              <h3>{name}</h3>
              <p>{text}</p>
            </figcaption>
          </figure>
        ))}

        <div className="board-panel board-rau">
          <img src="/images/rau/dia-rau.webp" alt="Mâm rau nhúng lẩu" width="540" height="534" loading="lazy" />
          <h3>6 loại rau đồng nội</h3>
          <p>Rau muống, rau đắng, tần ô, cải xoong, mướp và thân chuối bào.</p>
        </div>

        <div className="board-panel board-nuoc">
          <img src="/images/mon/lau-2-ngan.webp" alt="Nồi lẩu hai ngăn" width="591" height="458" loading="lazy" />
          <h3>Hai ngăn, chọn hai vị</h3>
          <ul>
            <li><b>Nhúng mẻ</b> chua thanh, dịu nhẹ</li>
            <li><b>Nhúng ruốc</b> đậm đà ruốc Huế</li>
            <li><b>Nhúng ớt</b> cay nồng thử thách</li>
          </ul>
        </div>
      </div>

      <div className="board-ruler" aria-hidden="true">
        <span className="board-cm num"><b>0</b> cm</span>
        <div className="board-bar"><i /></div>
        <span className="num">100 cm</span>
      </div>
    </section>
  )
}
