// Nguồn: Google Maps + bìa menu (xem profile.md)
const place = 'Bò Thư Giãn, 128 Tố Hữu, Hòa Cường, Đà Nẵng'

export const brand = {
  name: 'Bò Thư Giãn',
  slogan: 'Nguyên liệu tử tế, Chế biến tử tế',
  street: '128 Tố Hữu, P. Hòa Cường',
  city: 'Đà Nẵng',
  hours: '16:00 – 23:00',
  phone: '0935 000 828',
  tel: '+84935000828',
  facebook: 'https://www.facebook.com/Bothugian128ToHuu',
  maps: 'https://maps.app.goo.gl/mPuJ5VAu8ZQ24KTMA',
  mapEmbed: `https://www.google.com/maps?q=${encodeURIComponent(place)}&ll=16.0343683,108.2172805&z=16&output=embed`,
  rating: '4,6',
  reviews: 459,
  // ⚠️ Thông tin chuyển khoản MINH HOẠ cho giao diện thanh toán — thay bằng tài khoản thật của quán
  bank: { name: 'Ngân hàng (cập nhật)', account: '0000 0000 0000', holder: 'BO THU GIAN' },
  // Video thật của quán (đặt file vào public/media/). null = dùng ảnh.
  video: null, // ví dụ: { src: '/media/quan.mp4', poster: '/media/quan.jpg' }
}
