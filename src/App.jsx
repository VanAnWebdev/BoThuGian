import { useEffect } from 'react'
import { ScrollTrigger, staticMode } from './lib/motion.js'
import Intro from './components/Intro.jsx'
import Cursor from './components/Cursor.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Story from './components/Story.jsx'
import Board from './components/Board.jsx'
import Signature from './components/Signature.jsx'
import Space from './components/Space.jsx'
import Menu from './components/Menu.jsx'
import Booking from './components/Booking.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  // Tính lại vị trí các đoạn ghim khi font/ảnh tải xong (chiều cao trang thay đổi)
  useEffect(() => {
    // Chế độ chụp: tải hết ảnh ngay, không chờ cuộn tới
    if (staticMode) document.querySelectorAll('img[loading="lazy"]').forEach((img) => (img.loading = 'eager'))
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <>
      <Intro />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Story />
        <Board />
        <Signature />
        <Space />
        <Menu />
        <Booking />
      </main>
      <Footer />
    </>
  )
}
