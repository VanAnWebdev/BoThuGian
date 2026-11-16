import { categories } from '../shared/menuData.js'

export function validateDish(draft) {
  const name = draft.name.trim()
  const price = Number(draft.price)
  if (!name || name.length > 100) return { error: 'Nhập tên món từ 1 đến 100 ký tự.' }
  if (!Number.isSafeInteger(price) || price < 1000) return { error: 'Giá món phải là số nguyên từ 1.000đ trở lên.' }
  if (!categories.some((c) => c.id === draft.cat)) return { error: 'Chọn nhóm món hợp lệ.' }
  const img = (draft.img || '').trim()
  if (img && !/^\/(?!\/)/.test(img)) {
    try { if (new URL(img).protocol !== 'https:') throw new Error() }
    catch { return { error: 'Ảnh món cần là đường dẫn /images/… hoặc đường link https://…' } }
  }
  return { item: { ...draft, name, price, img, note: (draft.note || '').trim(), unit: (draft.unit || '').trim() } }
}
