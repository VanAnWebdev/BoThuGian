import { get, set, update, remove } from './store.js'
import { sessionOrders, billTotal, isClosed } from './logic.js'
import { seedMenu } from './menuData.js'

const uid = () => globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36)

// Khoá dữ liệu: orders [], bills { [bàn]: bill }, history [] (hoá đơn đã thu), feedback []
const patchBill = (table, patch) => update('bills', {}, (b) => ({ ...b, [table]: { ...b[table], ...patch } }))

// Phiên đang mở của bàn (null nếu bàn trống / phiên trước đã xong)
export const openBill = (bills, table) => (isClosed(bills[table]) ? null : bills[table])

// Gửi giỏ cho bếp: mở phiên mới nếu bàn đang trống
export function submitOrder(table, lines) {
  const bills = get('bills', {})
  let bill = openBill(bills, table)
  if (!bill) {
    bill = { session: uid(), status: 'open', openedAt: Date.now() }
    set('bills', { ...bills, [table]: bill })
  }
  update('orders', [], (o) => [...o, { id: uid(), table, session: bill.session, lines, status: 'new', at: Date.now() }])
}

export const setOrderStatus = (id, status) => update('orders', [], (o) => o.map((x) => (x.id === id ? { ...x, status } : x)))

export const requestPay = (table, method) => patchBill(table, { status: 'pay_requested', method, requestedAt: Date.now() })
export const cancelPay = (table) => patchBill(table, { status: 'open', method: null })

// Thu tiền xong: ghi lịch sử (doanh thu) và đánh dấu bàn đã thanh toán
export function markPaid(table) {
  const bill = get('bills', {})[table]
  if (!bill || bill.status === 'paid') return
  const orders = sessionOrders(get('orders', []), table, bill.session).filter((o) => o.status !== 'cancelled')
  const total = billTotal(orders)
  update('history', [], (h) => [
    ...h,
    { id: bill.session, table, total, method: bill.method || 'cash', paidAt: Date.now(), lines: orders.flatMap((o) => o.lines) },
  ])
  patchBill(table, { status: 'paid', paidAt: Date.now(), total })
}

export function submitFeedback(table, feedback) {
  const bill = get('bills', {})[table]
  update('feedback', [], (f) => [...f, { id: uid(), table, session: bill?.session, total: bill?.total || 0, at: Date.now(), ...feedback }])
  patchBill(table, { feedbackDone: true })
}

// Đóng phiên (khách bỏ qua đánh giá / nhân viên dọn bàn)
export const closeTable = (table) => patchBill(table, { feedbackDone: true, status: 'paid' })

// ---- Dữ liệu mẫu cho buổi demo ----
export function seedDemo() {
  const menu = seedMenu()
  const pick = (name) => menu.find((m) => m.name === name)
  const line = (name, qty) => ({ id: pick(name).id, name, price: pick(name).price, unit: pick(name).unit || '', qty, note: '' })
  const h = 3600e3
  const now = Date.now()
  const bills = [
    [3, [line('Set nhúng lẩu 2 ngăn', 1), line('Nem chua bò tơ', 2), line('Bia Tiger Bạc', 6)], 'vietqr', 3 * h],
    [7, [line('Sườn bò núi lửa', 1), line('Ống tủy nhất dương', 1), line('Bia Heineken Bạc', 4)], 'cash', 2 * h],
    [12, [line('Lẩu bò nội tâm', 1), line('Larb bò', 1), line('Nem chua bò tơ', 1)], 'wallet', 1 * h],
  ]
  update('history', [], (old) => [
    ...old,
    ...bills.map(([table, lines, method, ago]) => ({
      id: uid(), table, method, lines, paidAt: now - ago, total: lines.reduce((s, l) => s + l.price * l.qty, 0),
    })),
  ])
  update('feedback', [], (old) => [
    ...old,
    { id: uid(), table: 3, rating: 5, tags: ['Món ngon', 'Nhân viên dễ thương'], comment: 'Thớt bò tươi, lẩu ngọt nước.', at: now - 3 * h },
    { id: uid(), table: 7, rating: 4, tags: ['Không gian chill'], comment: 'Sườn núi lửa ngon, lên món hơi lâu.', at: now - 2 * h },
  ])
}

export function clearAll() {
  for (const k of ['orders', 'bills', 'history', 'feedback']) remove(k)
}
