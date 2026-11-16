import { test } from 'node:test'
import assert from 'node:assert/strict'

test('table order reaches admin, payment changes, receipt and feedback share one session', async () => {
  const data = new Map()
  globalThis.localStorage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  }
  const store = await import('./store.js')
  const { submitOrder, requestPay, markPaid, submitFeedback, openBill } = await import('./actions.js')
  submitOrder(1, [{ id: 'dish-1', name: 'Test dish', price: 126500, qty: 2, note: '' }])
  const admin = await import('./store.js?admin-actions-test')
  const bill = admin.get('bills', {})[1]
  assert.equal(admin.get('orders', [])[0].session, bill.session)
  assert.equal(admin.get('orders', [])[0].table, 1)
  requestPay(1, 'cash')
  assert.equal(admin.get('bills', {})[1].method, 'cash')
  requestPay(1, 'card')
  assert.equal(admin.get('bills', {})[1].method, 'card')
  markPaid(1)
  markPaid(1)
  assert.equal(store.get('history', []).length, 1)
  assert.equal(admin.get('bills', {})[1].total, 253000)
  assert.equal(admin.get('bills', {})[1].status, 'paid')
  submitFeedback(1, { rating: 5, tags: [], comment: '' })
  assert.equal(admin.get('feedback', [])[0].session, bill.session)
  assert.equal(openBill(admin.get('bills', {}), 1), null)
  submitOrder(1, [{ id: 'dish-2', name: 'Next meal', price: 50000, qty: 1, note: '' }])
  assert.notEqual(admin.get('bills', {})[1].session, bill.session)
})
