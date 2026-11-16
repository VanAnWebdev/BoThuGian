import { useEffect, useRef, useState } from 'react'
import { update } from '../shared/store.js'
import { useMenu, categories, seedMenu, resetMenu } from '../shared/menuData.js'
import { formatPrice } from '../data/menu.js'
import { validateDish } from './menuForm.js'
import './menu-admin.css'

const TAGS = ['', 'Best seller', 'Must try', 'Đặc sản Gia Lai']
const blank = () => ({ name: '', cat: categories[0].id, price: '', unit: '', note: '', tag: '', img: '', available: true })
const searchText = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')

export default function MenuAdmin() {
  const items = useMenu()
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [availability, setAvailability] = useState('all')
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState('')
  const saveItems = (fn) => update('menu', seedMenu(), fn)
  const out = items.filter((it) => !it.available).length
  const shown = items.filter((it) => (cat === 'all' || it.cat === cat)
    && searchText(it.name).includes(searchText(q.trim()))
    && (availability === 'all' || it.available === (availability === 'available')))
  const save = (item) => {
    if (item.id && !items.some((it) => it.id === item.id)) return 'Món này đã bị xoá ở tab khác. Đóng form để xem lại thực đơn.'
    const saved = { ...item, id: item.id || crypto.randomUUID() }
    saveItems((list) => item.id ? list.map((it) => it.id === item.id ? saved : it) : [...list, saved])
    setMessage(`Đã ${item.id ? 'lưu' : 'thêm'} món ${item.name}.`)
    setEditing(null)
  }
  const remove = (item) => {
    if (!confirm(`Xoá món “${item.name}” khỏi thực đơn?`)) return
    saveItems((list) => list.filter((it) => it.id !== item.id))
    setMessage(`Đã xoá món ${item.name}.`)
  }
  const toggle = (item) => {
    saveItems((list) => list.map((it) => it.id === item.id ? { ...it, available: !it.available } : it))
    setMessage(`${item.name}: ${item.available ? 'đã đánh dấu hết món' : 'đã mở bán trở lại'}.`)
  }
  return (
    <div className="menu-admin">
      <header className="adm-head menu-admin-head">
        <div><h1>Thực đơn</h1><p>Quản lý món đang phục vụ tại Bò Thư Giãn.</p></div>
        <button type="button" className="btn" onClick={() => setEditing(blank())}>+ Thêm món</button>
      </header>
      <div className="menu-summary">
        <p><b>{items.length}</b> món trong thực đơn</p>
        <p><span className="menu-dot" />{items.length - out} đang phục vụ</p>
        <p><span className="menu-dot is-out" />{out} tạm hết</p>
      </div>
      <p className="menu-status" role="status" aria-live="polite">{message || 'Thay đổi đã lưu sẽ cập nhật trên trang gọi món cùng trình duyệt.'}</p>
      <div className="menu-filters">
        <label className="menu-search">Tìm món<input type="search" placeholder="Tên món, có hoặc không dấu…" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        <label>Nhóm món<select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">Tất cả nhóm</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select></label>
        <label>Trạng thái<select value={availability} onChange={(e) => setAvailability(e.target.value)}>
          <option value="all">Tất cả trạng thái</option><option value="available">Đang phục vụ</option><option value="out">Tạm hết</option>
        </select></label>
      </div>
      <div className="menu-list-head"><p>Hiển thị <b>{shown.length}</b> / {items.length} món</p>
        <button type="button" className="link" onClick={() => {
          if (confirm('Khôi phục thực đơn gốc? Món thêm và mọi chỉnh sửa thực đơn sẽ mất.')) { resetMenu(); setMessage('Đã khôi phục thực đơn gốc.') }
        }}>Khôi phục thực đơn gốc</button>
      </div>
      <div className="menu-table-wrap">
        <table className="menu-table">
          <caption className="sr-only">Danh sách món ăn và thao tác quản lý</caption>
          <thead><tr><th scope="col">Món ăn</th><th scope="col">Nhóm</th><th scope="col">Giá bán</th><th scope="col">Trạng thái</th><th scope="col"><span className="sr-only">Thao tác</span></th></tr></thead>
          <tbody>{shown.map((it) => <tr key={it.id}>
            <td><div className="menu-dish"><DishImage src={it.img} /><div><b>{it.name}</b>{it.note && <p>{it.note}</p>}{it.tag && <span className="menu-tag">{it.tag}</span>}</div></div></td>
            <td data-label="Nhóm">{categories.find((c) => c.id === it.cat)?.name}</td>
            <td data-label="Giá bán" className="menu-price">{formatPrice(it.price)}đ{it.unit && <small>{it.unit}</small>}</td>
            <td><button type="button" className={`menu-availability${it.available ? '' : ' is-out'}`} aria-pressed={it.available} aria-label={`${it.name}: ${it.available ? 'đang phục vụ, bấm để báo hết' : 'tạm hết, bấm để mở bán'}`} onClick={() => toggle(it)}><span />{it.available ? 'Đang phục vụ' : 'Tạm hết'}</button></td>
            <td><div className="menu-row-actions"><button type="button" className="menu-edit" aria-label={`Sửa ${it.name}`} onClick={() => setEditing({ ...blank(), ...it })}>Sửa</button><button type="button" className="link danger" aria-label={`Xoá ${it.name}`} onClick={() => remove(it)}>Xoá</button></div></td>
          </tr>)}</tbody>
        </table>
        {!shown.length && <div className="menu-empty"><h2>Không tìm thấy món</h2><p>Thử tên khác hoặc bỏ bộ lọc để xem lại thực đơn.</p><button className="btn btn--ghost" onClick={() => { setQ(''); setCat('all'); setAvailability('all') }}>Bỏ bộ lọc</button></div>}
      </div>
      {editing && <DishEditor initial={editing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  )
}

function DishImage({ src }) {
  const [broken, setBroken] = useState(false)
  useEffect(() => setBroken(false), [src])
  return <div className={`menu-thumb${!src || broken ? ' is-placeholder' : ''}`}><img src={src && !broken ? src : '/images/logo.webp'} alt="" loading="lazy" onError={() => setBroken(true)} /></div>
}

function DishEditor({ initial, onSave, onClose }) {
  const dialog = useRef(null)
  const [draft, setDraft] = useState(initial)
  const [error, setError] = useState('')
  useEffect(() => { dialog.current.showModal() }, [])
  const field = (key) => ({ value: draft[key], onChange: (e) => setDraft({ ...draft, [key]: e.target.value }) })
  const submit = (e) => {
    e.preventDefault()
    const result = validateDish(draft)
    if (result.error) return setError(result.error)
    const failure = onSave(result.item)
    if (failure) setError(failure)
  }
  return <dialog ref={dialog} className="dish-editor" aria-labelledby="dish-editor-title" onCancel={onClose}>
    <form onSubmit={submit}>
      <header><div><h2 id="dish-editor-title">{initial.id ? 'Sửa món' : 'Thêm món mới'}</h2><p>Thông tin hiển thị trên thực đơn gọi món.</p></div><button className="editor-close" type="button" onClick={onClose} aria-label="Đóng form">×</button></header>
      <div className="dish-editor-fields">
        <label className="editor-wide">Tên món<input autoFocus required maxLength={100} placeholder="Ví dụ: Nem chua bò tơ" {...field('name')} /></label>
        <label>Nhóm món<select {...field('cat')}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <label>Nhãn món<select {...field('tag')}>{[...new Set([...TAGS, draft.tag])].map((tag) => <option key={tag} value={tag}>{tag || 'Không gắn nhãn'}</option>)}</select></label>
        <label>Giá bán (đồng)<input required type="number" min="1000" step="1" placeholder="109000" {...field('price')} /></label>
        <label>Đơn vị giá<input maxLength={30} placeholder="Ví dụ: / phần, / kg" {...field('unit')} /></label>
        <label className="editor-wide">Mô tả món<textarea rows={3} maxLength={300} placeholder="Nguyên liệu, cách chế biến hoặc lưu ý món cay…" {...field('note')} /></label>
        <label className="editor-wide">Đường dẫn ảnh<input placeholder="/images/… hoặc https://…" {...field('img')} /><small>Để trống nếu chưa có ảnh món.</small></label>
        <div className="editor-preview editor-wide"><DishImage src={draft.img} /><span>{draft.name.trim() || 'Tên món'}<small>{Number(draft.price) > 0 ? `${formatPrice(Number(draft.price))}đ ${draft.unit}` : 'Chưa nhập giá'}</small></span></div>
        <label className="editor-check editor-wide"><input type="checkbox" checked={draft.available} onChange={(e) => setDraft({ ...draft, available: e.target.checked })} />Đang phục vụ món này</label>
      </div>
      {error && <p className="editor-error" role="alert">{error}</p>}
      <footer><button type="button" className="btn btn--ghost" onClick={onClose}>Huỷ</button><button className="btn" type="submit">{initial.id ? 'Lưu thay đổi' : 'Thêm món'}</button></footer>
    </form>
  </dialog>
}
