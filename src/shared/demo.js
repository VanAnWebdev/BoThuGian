import { set, remove } from './store.js'
import { seedDemo, clearAll } from './actions.js'
import { seedMenu } from './menuData.js'

// ?demo=<trạng thái>: dựng sẵn dữ liệu mẫu cho một màn để mỗi màn có URL đầy đủ
// (nhập vào Figma bằng html.to.design, chụp màn hình, demo cho khách).
// Lưu ý: mở link ?demo sẽ XOÁ dữ liệu demo đang có trong trình duyệt đó.
export const demo = typeof location === 'undefined' ? null : new URLSearchParams(location.search).get('demo')

const MIN = 60e3

export function applyDemo() {
  if (!demo) return
  const menu = seedMenu()
  const line = (name, qty, note = '') => {
    const m = menu.find((x) => x.name === name)
    return { id: m.id, name, price: m.price, unit: m.unit || '', qty, note }
  }
  const total = (lines) => lines.reduce((s, l) => s + l.price * l.qty, 0)
  const now = Date.now()
  const table = Number(new URLSearchParams(location.search).get('ban')) || 1
  const hash = (h) => history.replaceState(null, '', location.pathname + location.search + '#' + h)

  clearAll()
  remove(`cart:${table}`)
  const first = [line('Sườn bò núi lửa', 1), line('Salad rau má bò tơ', 1), line('Bia Tiger Bạc', 4)]
  const second = [line('Ống tủy nhất dương', 1, 'thêm bánh mì')]
  const myOrders = [
    { id: 'd1', table, session: 'demo', status: 'served', at: now - 35 * MIN, lines: first },
    { id: 'd2', table, session: 'demo', status: 'cooking', at: now - 8 * MIN, lines: second },
  ]
  const bill = (patch) => {
    set('orders', myOrders)
    set('bills', { [table]: { session: 'demo', status: 'open', openedAt: now - 40 * MIN, ...patch } })
  }
  const paid = { status: 'paid', method: 'vietqr', paidAt: now, total: total([...first, ...second]) }

  const states = {
    // ---- /order/?ban=N ----
    cart: () => (set(`cart:${table}`, [line('Nem chua bò tơ', 2, 'ít cay'), line('Set nhúng lẩu 2 ngăn', 1), line('Bia Tiger Bạc', 6)]), hash('cart')),
    'cart-empty': () => hash('cart'),
    bill: () => (bill(), hash('bill')),
    pay: () => (bill(), hash('pay')),
    vietqr: () => (bill({ status: 'pay_requested', method: 'vietqr', requestedAt: now }), hash('pay')),
    wallet: () => (bill({ status: 'pay_requested', method: 'wallet', requestedAt: now }), hash('pay')),
    cash: () => (bill({ status: 'pay_requested', method: 'cash', requestedAt: now }), hash('pay')),
    card: () => (bill({ status: 'pay_requested', method: 'card', requestedAt: now }), hash('pay')),
    thanks: () => bill(paid),
    'thanks-done': () => (bill({ ...paid, feedbackDone: true }), hash('thanks')),
    // ---- /admin/ ----
    orders: () => {
      set('orders', [
        { id: 'a1', table: 5, session: 's5', status: 'served', at: now - 35 * MIN, lines: first },
        { id: 'a2', table: 5, session: 's5', status: 'cooking', at: now - 8 * MIN, lines: second },
        { id: 'a3', table: 7, session: 's7', status: 'served', at: now - 50 * MIN, lines: [line('Lẩu bò nội tâm', 1), line('Bia Heineken Bạc', 8)] },
        { id: 'a4', table: 12, session: 's12', status: 'new', at: now - 2 * MIN, lines: [line('Bò sốt lá lốt xúc bánh tráng', 1), line('Bò tơ nướng', 3, 'có da')] },
      ])
      set('bills', {
        5: { session: 's5', status: 'open' },
        7: { session: 's7', status: 'pay_requested', method: 'cash', requestedAt: now - 3 * MIN },
        12: { session: 's12', status: 'open' },
      })
      hash('orders')
    },
    insights: () => (seedDemo(), hash('insights')),
    'menu-add': () => hash('menu'),
    'menu-edit': () => hash('menu'),
    'menu-empty': () => hash('menu'),
  }
  states[demo]?.()
}
