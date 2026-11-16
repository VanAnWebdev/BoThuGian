import { test } from 'node:test'
import assert from 'node:assert/strict'
import { openStatus, vnDate, defaultBookingDate, slots } from './hours.js'

const at = (iso) => new Date(iso) // mốc UTC; giờ VN = UTC + 7

test('mở 16:00–23:00 giờ VN', () => {
  assert.equal(openStatus(at('2026-10-23T09:00:00Z')).open, true) // 16:00
  assert.equal(openStatus(at('2026-10-23T15:59:00Z')).open, true) // 22:59
  assert.equal(openStatus(at('2026-10-23T16:00:00Z')).open, false) // 23:00
  assert.equal(openStatus(at('2026-10-23T08:59:00Z')).open, false) // 15:59
})

test('đếm ngược dễ đọc', () => {
  assert.equal(openStatus(at('2026-10-23T08:15:00Z')).text, 'Mở lúc 16:00 hôm nay · còn 45 phút')
  assert.equal(openStatus(at('2026-10-23T13:30:00Z')).text, 'Đang mở · còn 2 giờ 30 phút đến 23:00')
  assert.equal(openStatus(at('2026-10-23T14:00:00Z')).text, 'Đang mở · còn 2 giờ đến 23:00')
  assert.equal(openStatus(at('2026-10-23T16:30:00Z')).text, 'Đã đóng · mở lại 16:00 ngày mai')
})

test('ngày VN và ngày đặt mặc định', () => {
  assert.equal(vnDate(at('2026-10-23T16:59:00Z')), '2026-10-23')
  assert.equal(vnDate(at('2026-10-23T17:00:00Z')), '2026-10-24')
  assert.equal(defaultBookingDate(at('2026-10-23T10:00:00Z')), '2026-10-23') // 17:00
  assert.equal(defaultBookingDate(at('2026-10-23T15:30:00Z')), '2026-10-24') // 22:30
})

test('khung giờ đặt bàn 16:00 → 22:00 mỗi 30 phút', () => {
  assert.equal(slots.length, 13)
  assert.equal(slots[0], '16:00')
  assert.equal(slots[1], '16:30')
  assert.equal(slots.at(-1), '22:00')
})

test('danh sách ngày đặt bàn', async () => {
  const { bookingDays } = await import('./hours.js')
  const days = bookingDays(at('2026-11-17T10:00:00Z')) // 17:00 thứ Ba 17/11 giờ VN
  assert.equal(days.length, 14)
  assert.deepEqual(days[0], { value: '2026-11-17', label: 'Hôm nay', date: '17/11' })
  assert.deepEqual(days[1], { value: '2026-11-18', label: 'Ngày mai', date: '18/11' })
  assert.deepEqual(days[2], { value: '2026-11-19', label: 'T5', date: '19/11' })
  assert.equal(days[5].label, 'CN') // 22/11/2026 là Chủ nhật
  assert.equal(days[13].value, '2026-11-30')
  // 22:30 → không còn nhận khách hôm nay, bắt đầu từ ngày mai
  assert.deepEqual(bookingDays(at('2026-11-17T15:30:00Z'))[0], { value: '2026-11-18', label: 'Ngày mai', date: '18/11' })
})

test('giờ đã qua bị ẩn khi đặt cho hôm nay', async () => {
  const { slotsFor } = await import('./hours.js')
  const now = at('2026-11-17T11:10:00Z') // 18:10 VN
  assert.equal(slotsFor('2026-11-17', now)[0], '18:30')
  assert.equal(slotsFor('2026-11-18', now).length, 13)
})
