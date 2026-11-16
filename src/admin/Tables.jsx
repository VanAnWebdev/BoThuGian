import { set } from '../shared/store.js'
import { useSettings } from '../shared/menuData.js'
import QR from '../shared/QR.jsx'
import { brand } from '../data/brand.js'

export default function Tables() {
  const settings = useSettings()
  const base = `${location.origin}/order/?ban=`
  const setTables = (n) => set('settings', { ...settings, tables: Math.min(100, Math.max(1, n || 1)) })
  const printTable = (table) => {
    const grid = document.querySelector('.qrgrid')
    if (table) grid.dataset.printTable = String(table)
    else delete grid.dataset.printTable
    const card = table ? grid.querySelector(`[data-table="${table}"]`) : null
    card?.classList.add('is-printing')
    try { window.print() } finally {
      delete grid.dataset.printTable
      card?.classList.remove('is-printing')
    }
  }

  return (
    <div>
      <header className="adm-head no-print">
        <h1>Mã QR bàn</h1>
        <p>Khách quét mã để mở thực đơn và gọi món cho đúng bàn.</p>
        <div className="toolbar">
          <label>
            Số bàn
            <input type="number" min="1" max="100" value={settings.tables} onChange={(e) => setTables(Number(e.target.value))} />
          </label>
          <button type="button" className="btn" onClick={() => printTable()}>In tất cả mã QR</button>
        </div>
        <p className="muted">Mã trỏ tới <code>{base}…</code>. Đưa web lên tên miền thật (Vercel) rồi mới in để mã dùng được trên mọi điện thoại.</p>
      </header>

      <ul className="qrgrid">
        {Array.from({ length: settings.tables }, (_, i) => i + 1).map((t) => (
          <li key={t} className="qrcard" data-table={t}>
            <img src="/images/logo.webp" alt="" width="640" height="543" />
            <b className="num">Bàn {String(t).padStart(2, '0')}</b>
            <QR text={base + t} size={150} label={`Mã QR gọi món bàn ${t}`} />
            <span>Quét để xem thực đơn & gọi món</span>
            <small>{brand.name} · {brand.phone}</small>
            <a className="no-print" href={`/order/?ban=${t}`} target="_blank" rel="noreferrer">Mở thử</a>
            <button type="button" className="btn btn--ghost no-print" onClick={() => printTable(t)}>In bàn {String(t).padStart(2, '0')}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
