import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateDish } from './menuForm.js'

const draft = { name: '  Nem chua  ', cat: 'khai-vi', price: '109000', note: '', unit: '/ phần', img: '', tag: '', available: true }
test('dish form trims fields and converts price before saving', () => {
  const result = validateDish(draft)
  assert.equal(result.error, undefined)
  assert.equal(result.item.name, 'Nem chua')
  assert.equal(result.item.price, 109000)
  assert.equal(result.item.unit, '/ phần')
})
test('invalid dish cannot replace a saved menu item', () => {
  for (const patch of [{ name: '   ' }, { price: '' }, { price: '-1' }, { price: 'NaN' }, { price: '1500.5' }, { cat: 'unknown' }, { img: 'javascript:alert(1)' }]) {
    assert.ok(validateDish({ ...draft, ...patch }).error)
  }
  assert.ok(validateDish({ ...draft, img: '/images/mon/suon-nui-lua.webp' }).item)
  assert.ok(validateDish({ ...draft, img: 'https://example.com/dish.webp' }).item)
})
