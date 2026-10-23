// Giờ mở cửa theo giờ Việt Nam (UTC+7, không đổi giờ mùa hè), bất kể múi giờ máy khách.
export const OPEN = 16 * 60
export const CLOSE = 23 * 60
const LAST_SEATING = 22 * 60

const vn = (d) => new Date(d.getTime() + 7 * 3600e3)
export const vnMinutes = (d) => vn(d).getUTCHours() * 60 + vn(d).getUTCMinutes()
export const vnDate = (d) => vn(d).toISOString().slice(0, 10)

const duration = (m) =>
  [m >= 60 && `${Math.floor(m / 60)} giờ`, m % 60 && `${m % 60} phút`].filter(Boolean).join(' ')

export function openStatus(d = new Date()) {
  const m = vnMinutes(d)
  if (m >= OPEN && m < CLOSE) return { open: true, text: `Đang mở · còn ${duration(CLOSE - m)} đến 23:00` }
  if (m < OPEN) return { open: false, text: `Mở lúc 16:00 hôm nay · còn ${duration(OPEN - m)}` }
  return { open: false, text: 'Đã đóng · mở lại 16:00 ngày mai' }
}

// Sau giờ nhận khách cuối, gợi ý đặt cho ngày mai.
export const defaultBookingDate = (d = new Date()) =>
  vnDate(vnMinutes(d) >= LAST_SEATING ? new Date(d.getTime() + 864e5) : d)

export const slots = Array.from({ length: (LAST_SEATING - OPEN) / 30 + 1 }, (_, i) => {
  const m = OPEN + i * 30
  return `${Math.floor(m / 60)}:${m % 60 ? '30' : '00'}`
})
