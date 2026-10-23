import { brand } from '../data/brand.js'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-top wrap">
        <div className="foot-brand">
          <img src="/images/logo.webp" alt={brand.name} width="446" height="512" loading="lazy" />
          <p>{brand.slogan}</p>
        </div>
        <dl className="foot-facts">
          <div><dt>Địa chỉ</dt><dd>{brand.street}, {brand.city}</dd></div>
          <div><dt>Mở cửa</dt><dd className="num">{brand.hours} mỗi ngày</dd></div>
          <div><dt>Hotline</dt><dd><a className="num" href={`tel:${brand.tel}`}>{brand.phone}</a></dd></div>
        </dl>
        <nav className="foot-links" aria-label="Liên kết cuối trang">
          <a href="#thuc-don">Thực đơn</a>
          <a href="#dat-ban">Đặt bàn</a>
          <a href={brand.facebook} target="_blank" rel="noreferrer">Facebook</a>
          <a href={brand.maps} target="_blank" rel="noreferrer">Google Maps</a>
        </nav>
      </div>
      <p className="foot-copy wrap">© {new Date().getFullYear()} {brand.name}</p>
    </footer>
  )
}
