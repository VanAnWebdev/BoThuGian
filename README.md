# Bò Thư Giãn — Website (Frontend)

One-page site cho quán bò tơ Bò Thư Giãn, 128 Tố Hữu, Đà Nẵng. Thông tin thương hiệu: [profile.md](profile.md).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # xuất ra dist/
npm test         # test logic giờ mở cửa / đặt bàn (node:test, không cần thư viện)
```

## Cấu trúc

```
├── index.html              # meta SEO, font Work Sans (có tiếng Việt)
├── profile.md              # brand profile
├── public/
│   ├── favicon.png
│   └── images/
│       ├── logo.png        # logo gốc đã tách nền (dùng cho in ấn / og:image)
│       ├── logo.webp       # bản nhẹ cho thanh điều hướng
│       ├── dau-bep.webp    # chân dung đầu bếp (trang 11 menu)
│       ├── thot/           # 5 phần thịt của "thớt bò 1 mét" (hero)
│       └── mon/            # ảnh món cắt nền + khói (trích từ menu PDF)
└── src/
    ├── main.jsx · App.jsx  # ghép các section theo thứ tự trang
    ├── data/
    │   ├── brand.js        # địa chỉ, giờ, hotline, link — sửa 1 chỗ dùng mọi nơi
    │   └── menu.js         # 12 nhóm, 75 món + 6 món "phải thử"
    ├── lib/
    │   ├── motion.js       # GSAP + ScrollTrigger + Lenis (cuộn mượt), intro, nút hút chuột, đếm số
    │   ├── hours.js        # trạng thái mở/đóng theo giờ VN, khung giờ đặt bàn
    │   └── hours.test.js
    ├── styles/base.css     # token màu, cỡ chữ, nút pill, chữ tách từ
    └── components/         # mỗi section 1 cặp .jsx + .css
        ├── ui.jsx          # Btn (magnetic), Split (tách từ), Sticker (tem xoay)
        ├── Intro           # rót bia vào logo → kéo màn mở trang (1 lần / phiên)
        ├── Cursor          # con trỏ tuỳ biến, nhãn theo vùng data-cursor
        ├── Nav             # pill trượt theo mục đang xem, ẩn/hiện khi cuộn, menu mobile
        ├── Hero            # chữ trồi từng từ, ảnh + món cắt nền parallax theo chuột
        ├── Marquee         # băng chữ chạy theo vận tốc cuộn
        ├── Story           # Ba chữ vàng: ghim + lật Tươi → Chill → Tâm
        ├── Board           # Thớt bò 1 mét: ghim + trượt ngang + thước cm
        ├── Signature       # món phải thử so le, xoay theo cuộn, nghiêng 3D theo chuột
        ├── Space           # ảnh polaroid bay vào xếp lại, số đếm đánh giá
        ├── Menu            # tab 12 nhóm, pill trượt, món hiện lần lượt
        ├── Booking         # form đặt bàn + bản đồ + trạng thái mở cửa
        └── Footer          # tên quán trồi từng chữ
```

Thêm `?nointro` vào URL để bỏ qua màn intro khi test. Thêm `?static` để tắt mọi hiệu ứng và hiện đủ nội dung ở trạng thái cuối — dùng khi nhập trang vào Figma (plugin html.to.design) hoặc chụp màn hình. Hiệu ứng tự tắt khi máy bật "giảm chuyển động".

## Thay tư liệu thật

- **Video quán:** chép file vào `public/media/`, điền `video: { src, poster }` trong [src/data/brand.js](src/data/brand.js) → tự hiện ở section "Chill đúng nghĩa".
- **Ảnh chất lượng cao:** thay file cùng tên trong `public/images/` (ảnh hiện tại trích từ menu PDF, 300–800px).

## Nối backend sau này

- **Đặt bàn:** `submit()` trong [src/components/Visit.jsx](src/components/Visit.jsx) hiện gom form thành tin nhắn SMS gửi hotline. Khi có API, thay `setMessage(...)` bằng `fetch('/api/bookings', …)`.
- **Thực đơn:** [src/data/menu.js](src/data/menu.js) đã ở dạng JSON-friendly (`{ name, price, tag, note, unit }`) — đổi sang fetch từ API là đủ.
