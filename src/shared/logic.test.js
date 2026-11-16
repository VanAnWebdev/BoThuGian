import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  addItem, setQty, setNote, removeLine, qtyOf, sumLines, countLines,
  sessionOrders, billTotal, isClosed, dayStats, topItems, avgRating,
} from './logic.js'

const nem = { id: 'khai-vi-5', name: 'Nem chua bò tơ', price: 109000 }
const larb = { id: 'goi-0', name: 'Larb bò', price: 135000 }

test('giỏ hàng: thêm, cộng dồn, đổi số lượng, xoá', () => {
  let cart = addItem([], nem)
  cart = addItem(cart, nem)
  cart = addItem(cart, larb, 2)
  assert.equal(qtyOf(cart, nem.id), 2)
  assert.equal(countLines(cart), 4)
  assert.equal(sumLines(cart), 2 * 109000 + 2 * 135000)
  cart = setQty(cart, larb.id, 1)
  assert.equal(qtyOf(cart, larb.id), 1)
  cart = setQty(cart, larb.id, 0) // về 0 thì bỏ khỏi giỏ
  assert.equal(cart.length, 1)
  cart = setNote(cart, nem.id, 'ít cay')
  assert.equal(cart[0].note, 'ít cay')
  assert.deepEqual(removeLine(cart, nem.id), [])
})

test('hoá đơn theo bàn: chỉ tính phiên hiện tại, bỏ order huỷ', () => {
  const orders = [
    { table: 5, session: 'a', status: 'served', lines: [{ price: 100, qty: 2 }] },
    { table: 5, session: 'a', status: 'cancelled', lines: [{ price: 999, qty: 1 }] },
    { table: 5, session: 'old', status: 'served', lines: [{ price: 50, qty: 1 }] },
    { table: 6, session: 'a', status: 'new', lines: [{ price: 70, qty: 1 }] },
  ]
  const mine = sessionOrders(orders, 5, 'a')
  assert.equal(mine.length, 2)
  assert.equal(billTotal(mine), 200)
  assert.equal(isClosed(undefined), true)
  assert.equal(isClosed({ status: 'paid', feedbackDone: false }), false)
  assert.equal(isClosed({ status: 'paid', feedbackDone: true }), true)
})

test('thống kê trong ngày, món bán chạy, điểm đánh giá', () => {
  const now = new Date(2026, 10, 17, 21, 0).getTime()
  const history = [
    { total: 300000, paidAt: new Date(2026, 10, 17, 19, 0).getTime(), lines: [{ name: 'Larb bò', qty: 1 }, { name: 'Nem chua bò tơ', qty: 2 }] },
    { total: 500000, paidAt: new Date(2026, 10, 17, 20, 0).getTime(), lines: [{ name: 'Nem chua bò tơ', qty: 1 }] },
    { total: 900000, paidAt: new Date(2026, 10, 16, 20, 0).getTime(), lines: [{ name: 'Larb bò', qty: 5 }] }, // hôm qua
  ]
  assert.deepEqual(dayStats(history, now), { revenue: 800000, bills: 2, avg: 400000 })
  assert.deepEqual(topItems(history, 2), [{ name: 'Larb bò', qty: 6 }, { name: 'Nem chua bò tơ', qty: 3 }])
  assert.equal(avgRating([{ rating: 5 }, { rating: 4 }, { rating: 4 }]), 4.3)
  assert.equal(avgRating([]), 0)
})
