import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

// Mã QR dạng SVG (sắc nét khi in), màu xanh rêu thương hiệu
export default function QR({ text, size = 180, label }) {
  const [svg, setSvg] = useState('')
  useEffect(() => {
    let alive = true
    QRCode.toString(text, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#09321d', light: '#ffffff' } })
      .then((s) => alive && setSvg(s))
    return () => { alive = false }
  }, [text])
  return (
    <div className="qr" style={{ width: size, height: size }} role="img" aria-label={label || `Mã QR: ${text}`}
      dangerouslySetInnerHTML={{ __html: svg }} />
  )
}
