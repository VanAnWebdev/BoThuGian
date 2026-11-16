import { menu } from '../data/menu.js'
import { useStore, set } from './store.js'

// Ảnh có sẵn trong dự án cho một số món
const IMAGES = {
  'Nem chua bò tơ': '/images/nem-chua/dia-nem.webp',
  'Sườn bò núi lửa': '/images/mon/suon-nui-lua.webp',
  'Ống tủy nhất dương': '/images/mon/ong-tuy.webp',
  'Bò tơ xông hơi': '/images/mon/xong-hoi.webp',
  'Set nhúng lẩu 2 ngăn': '/images/mon/lau-2-ngan.webp',
  'Lẩu bò nội tâm': '/images/anh/lau-noi-tam.webp',
  'Bò tơ nướng': '/images/anh/bo-nuong.webp',
  'Sườn que nướng': '/images/anh/suon-que.webp',
}

export const categories = menu.map((g) => ({ id: g.id, name: g.name }))

// Thực đơn gốc từ data/menu.js, gắn mã món ổn định "<nhóm>-<thứ tự>"
export const seedMenu = () =>
  menu.flatMap((g) =>
    g.items.map((it, i) => ({ id: `${g.id}-${i}`, cat: g.id, ...it, img: IMAGES[it.name] || '', available: true })),
  )

// Thực đơn đang dùng: bản quản lý đã sửa (nếu có), không thì bản gốc
const SEED = seedMenu()
export const useMenu = () => useStore('menu', SEED)
export const resetMenu = () => set('menu', seedMenu())

export const settingsDefault = { tables: 20 }
export const useSettings = () => useStore('settings', settingsDefault)
