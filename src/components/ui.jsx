import { useId } from 'react'
import { useMagnetic } from '../lib/motion.js'

// Nút pill có hiệu ứng hút theo chuột; có href thì là link
export function Btn({ className = '', ...props }) {
  const ref = useMagnetic()
  const Tag = props.href ? 'a' : 'button'
  return <Tag ref={ref} className={`btn ${className}`} {...props} />
}

// Tách câu thành từng từ để animate (.w-in)
export function Split({ text }) {
  return text.split(' ').map((word, i) => (
    <span key={i}>
      <span className="w"><span className="w-in">{word}</span></span>{' '}
    </span>
  ))
}

// Tem tròn chữ chạy vòng quanh, dùng ở hero và món ngon
export function Sticker({ text, className = '', ...props }) {
  const ring = 'ring' + useId().replace(/\W/g, '')
  return (
    <svg className={`sticker ${className}`} viewBox="0 0 120 120" aria-hidden="true" {...props}>
      <defs>
        <path id={ring} d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="var(--orange)" />
      <g className="sticker-spin">
        <text fontSize="11" fontWeight="600" letterSpacing="2.2" fill="var(--green)" fontFamily="var(--sans)">
          <textPath href={`#${ring}`}>{text}</textPath>
        </text>
      </g>
      <path d="M60 38 L66 54 L82 60 L66 66 L60 82 L54 66 L38 60 L54 54 Z" fill="var(--cream)" />
    </svg>
  )
}
