// Logic thuần (không đụng DOM/kho) cho giỏ hàng, hoá đơn và thống kê — có test trong logic.test.js

export const lineTotal = (l) => l.price * l.qty
export const sumLines = (lines) => lines.reduce((s, l) => s + lineTotal(l), 0)
export const countLines = (lines) => lines.reduce((s, l) => s + l.qty, 0)

// ---- Giỏ hàng: mảng { id, name, price, unit, qty, note } ----
export function addItem(cart, item, qty = 1) {
  const found = cart.find((l) => l.id === item.id)
  if (found) return cart.map((l) => (l.id === item.id ? { ...l, qty: l.qty + qty } : l))
  return [...cart, { id: item.id, name: item.name, price: item.price, unit: item.unit || '', qty, note: '' }]
}
export const setQty = (cart, id, qty) =>
  qty <= 0 ? cart.filter((l) => l.id !== id) : cart.map((l) => (l.id === id ? { ...l, qty } : l))
export const setNote = (cart, id, note) => cart.map((l) => (l.id === id ? { ...l, note } : l))
export const removeLine = (cart, id) => cart.filter((l) => l.id !== id)
export const qtyOf = (cart, id) => cart.find((l) => l.id === id)?.qty || 0

// ---- Hoá đơn theo bàn ----
// bill = { session, status: 'open' | 'pay_requested' | 'paid', method, requestedAt, paidAt, feedbackDone }
export const isClosed = (bill) => !bill || (bill.status === 'paid' && bill.feedbackDone)

// Order của phiên hiện tại (bỏ order đã huỷ khi tính tiền)
export const sessionOrders = (orders, table, session) =>
  orders.filter((o) => o.table === table && o.session === session)
export const billTotal = (orders) =>
  orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + sumLines(o.lines), 0)

// ---- Thống kê từ lịch sử hoá đơn đã thanh toán: { table, total, lines, paidAt, method } ----
export function dayStats(history, now = Date.now()) {
  const d = new Date(now)
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const today = history.filter((h) => h.paidAt >= start && h.paidAt <= now)
  const revenue = today.reduce((s, h) => s + h.total, 0)
  return { revenue, bills: today.length, avg: today.length ? Math.round(revenue / today.length) : 0 }
}

export function topItems(history, limit = 5) {
  const qty = new Map()
  for (const h of history) for (const l of h.lines) qty.set(l.name, (qty.get(l.name) || 0) + l.qty)
  return [...qty].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([name, q]) => ({ name, qty: q }))
}

export const avgRating = (feedback) =>
  feedback.length ? Math.round((feedback.reduce((s, f) => s + f.rating, 0) / feedback.length) * 10) / 10 : 0
