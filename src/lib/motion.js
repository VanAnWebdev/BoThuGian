import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const media = (q) => typeof matchMedia !== 'undefined' && matchMedia(q).matches
export const reduced = media('(prefers-reduced-motion: reduce)')
export const finePointer = media('(hover: hover) and (pointer: fine)')
export const DESKTOP = '(min-width: 961px) and (prefers-reduced-motion: no-preference)'

// Cuộn mượt: Lenis chạy trên ticker của GSAP để ScrollTrigger khớp từng khung hình
export const lenis = reduced ? null : new Lenis({ lerp: 0.1, anchors: { offset: -72 } })
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}

// Intro chạy một lần mỗi phiên; hero chờ intro xong mới diễn cảnh mở màn
let resolveIntro
export const introDone = new Promise((r) => (resolveIntro = r))
export const finishIntro = () => resolveIntro()
export function shouldPlayIntro() {
  if (reduced || new URLSearchParams(location.search).has('nointro')) return false // ?nointro: bỏ qua khi QA
  try {
    return !sessionStorage.getItem('btg-intro')
  } catch {
    return false
  }
}

// Đếm số từ 0 tới data-to (giữ dấu phẩy thập phân kiểu Việt)
export function countUp(el, vars = {}) {
  const to = parseFloat(el.dataset.to)
  const dec = Number(el.dataset.dec || 0)
  const n = { v: 0 }
  return gsap.to(n, {
    v: to,
    duration: 1.6,
    ease: 'power2.out',
    ...vars,
    onUpdate: () => (el.textContent = n.v.toFixed(dec).replace('.', ',')),
  })
}

// Phần tử "hút" nhẹ theo con trỏ
export function useMagnetic(strength = 0.3) {
  const ref = useRef(null)
  useGSAP(() => {
    const el = ref.current
    if (!el || !finePointer) return
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      x((e.clientX - r.left - r.width / 2) * strength)
      y((e.clientY - r.top - r.height / 2) * strength)
    }
    const leave = () => (x(0), y(0))
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  })
  return ref
}

export { gsap, ScrollTrigger, useGSAP }
