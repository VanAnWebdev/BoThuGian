import { useEffect, useRef, useState } from 'react'
import { useMenu, categories } from '../shared/menuData.js'
import { addItem, setQty, qtyOf } from '../shared/logic.js'
import { formatPrice } from '../data/menu.js'
import Stepper from './Stepper.jsx'

export default function MenuView({ cart, setCart, flash }) {
  const items = useMenu()
  const [active, setActive] = useState(categories[0].id)
  const chips = useRef(null)

  // Nhóm đang xem: nhóm cuối cùng có tiêu đề đã qua đỉnh màn hình
  useEffect(() => {
    const onScroll = () => {
      let cur = categories[0].id
      for (const c of categories) {
        const el = document.getElementById(`cat-${c.id}`)
        if (el && el.getBoundingClientRect().top <= 140) cur = c.id
      }
      setActive(cur)
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])
  // Chip của nhóm đang xem luôn nằm trong tầm mắt
  useEffect(() => {
    chips.current?.querySelector(`[data-cat="${active}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [active])

  const add = (it) => {
    setCart(addItem(cart, it))
    flash(`Đã thêm ${it.name}`)
  }

  return (
    <>
      <nav className="cats" ref={chips} aria-label="Nhóm món">
        {categories.map((c) => (
          <a key={c.id} href={`#cat-${c.id}`} data-cat={c.id} className={c.id === active ? 'is-on' : undefined}
            onClick={(e) => (e.preventDefault(), document.getElementById(`cat-${c.id}`).scrollIntoView({ behavior: 'smooth' }))}>
            {c.name}
          </a>
        ))}
      </nav>

      {categories.map((c) => {
        const list = items.filter((it) => it.cat === c.id)
        if (!list.length) return null
        return (
          <section key={c.id} id={`cat-${c.id}`} className="cat" aria-labelledby={`h-${c.id}`}>
            <h2 id={`h-${c.id}`}>{c.name}</h2>
            <ul>
              {list.map((it) => {
                const q = qtyOf(cart, it.id)
                return (
                  <li key={it.id} className={`dish${it.available ? '' : ' is-out'}`}>
                    {it.img && <img src={it.img} alt="" width="72" height="72" loading="lazy" />}
                    <div className="dish-info">
                      <h3>{it.name}</h3>
                      {(it.tag || it.note) && (
                        <p>{it.tag && <span className="tag">{it.tag}</span>}{it.tag && it.note && ' · '}{it.note}</p>
                      )}
                      <b className="price num">{formatPrice(it.price)}đ{it.unit}</b>
                    </div>
                    {!it.available ? (
                      <span className="out">Hết món</span>
                    ) : q ? (
                      <Stepper value={q} onChange={(n) => setCart(setQty(cart, it.id, n))} label={it.name} />
                    ) : (
                      <button type="button" className="add" onClick={() => add(it)} aria-label={`Thêm ${it.name}`}>+</button>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </>
  )
}
