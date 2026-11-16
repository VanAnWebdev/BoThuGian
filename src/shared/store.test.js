import { test } from 'node:test'
import assert from 'node:assert/strict'

// Browser storage is the boundary; exercise the actual store with two module instances.
test('admin receives orders and payment changes from another tab, and refreshes after focus', async () => {
  const data = new Map()
  globalThis.localStorage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  }
  globalThis.window = new EventTarget()
  const admin = await import('./store.js?admin-test')
  const guest = await import('./store.js?guest-test')
  const storage = (key) => {
    const event = new Event('storage')
    event.key = `btg:${key}`
    window.dispatchEvent(event)
  }
  assert.deepEqual(admin.get('orders', []), [])
  guest.set('orders', [{ id: 'order-1', table: 1 }])
  storage('orders')
  assert.equal(admin.get('orders', [])[0].table, 1)
  admin.get('bills', {})
  guest.set('bills', { 1: { status: 'pay_requested', method: 'cash' } })
  storage('bills')
  assert.equal(admin.get('bills', {})[1].method, 'cash')
  guest.set('bills', { 1: { status: 'paid', total: 253000 } })
  // Returning from a suspended tab must reread storage even if an event was missed.
  window.dispatchEvent(new Event('focus'))
  assert.equal(admin.get('bills', {})[1].status, 'paid')
  // A second write before the storage event must append to the latest order list.
  guest.set('orders', [{ id: 'order-1', table: 1 }, { id: 'order-2', table: 1 }])
  admin.update('orders', [], (orders) => [...orders, { id: 'order-3', table: 2 }])
  assert.equal(guest.get('orders', []).length, 3)
  guest.remove('orders')
  assert.deepEqual(admin.get('orders', []), [])
})
