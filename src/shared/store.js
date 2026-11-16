import { useSyncExternalStore } from 'react'

// Kho dữ liệu demo trong localStorage (chưa có backend).
// Mọi tab cùng trình duyệt dùng chung: tab khách gửi order → tab bếp thấy ngay (sự kiện "storage").
// shortcut: không đồng bộ giữa các máy khác nhau; khi có API thì thay get/set bằng gọi server.
const PREFIX = 'btg:'
const cache = new Map()
const rawCache = new Map()
const defaults = new Map()
const listeners = new Set()
const notify = () => listeners.forEach((l) => l())

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (cache.has(key) && rawCache.get(key) === raw) return cache.get(key)
    const value = raw ? JSON.parse(raw) : fallback
    rawCache.set(key, raw)
    return value
  } catch {
    return cache.has(key) ? cache.get(key) : fallback
  }
}

export function get(key, fallback) {
  defaults.set(key, fallback)
  cache.set(key, read(key, fallback))
  return cache.get(key)
}

export function set(key, value) {
  cache.set(key, value)
  try {
    const raw = JSON.stringify(value)
    localStorage.setItem(PREFIX + key, raw)
    rawCache.set(key, raw)
  } catch {
    /* bộ nhớ đầy / chế độ riêng tư: vẫn giữ trong phiên */
  }
  notify()
}

export const update = (key, fallback, fn) => set(key, fn(get(key, fallback)))

export function remove(key) {
  cache.delete(key)
  rawCache.delete(key)
  try { localStorage.removeItem(PREFIX + key) } catch { /* bỏ qua */ }
  notify()
}

if (typeof window !== 'undefined') {
  const refresh = () => {
    cache.clear()
    notify()
  }
  // Background tabs can miss storage events while suspended.
  window.addEventListener('focus', refresh)
  window.addEventListener('pageshow', refresh)
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') refresh()
  })
  window.addEventListener('storage', (e) => {
    if (e.key === null) cache.clear()
    else if (e.key.startsWith(PREFIX)) cache.delete(e.key.slice(PREFIX.length))
    else return
    notify()
  })
}

let poll
const subscribe = (l) => {
  listeners.add(l)
  // Reconcile even when Edge suspends or suppresses storage events.
  if (!poll) poll = setInterval(() => {
    let changed = false
    for (const [key, value] of cache) {
      if (get(key, defaults.get(key)) !== value) changed = true
    }
    if (changed) notify()
  }, 1000)
  return () => {
    listeners.delete(l)
    if (!listeners.size) { clearInterval(poll); poll = undefined }
  }
}

export function useStore(key, fallback) {
  return useSyncExternalStore(subscribe, () => get(key, fallback))
}
