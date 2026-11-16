# Quy trình làm Landing Page — mẫu từ dự án Bò Thư Giãn

Quy trình 10 giai đoạn, rút từ dự án Bò Thư Giãn (10/2026, được chấm 10/10). Dùng lại cho landing page chủ đề khác:
nhà hàng, quán cà phê, spa, sản phẩm, sự kiện…

- Code hiệu ứng (GSAP + Lenis), 10 luật nền và 15 công thức nằm trong skill **`landing-motion`**
  (`C:\Users\ADMIN\.claude\skills\landing-motion\SKILL.md`). File này là **quy trình**, skill là **cách code**.
- Code mẫu tham chiếu: repo `https://github.com/VanAnWebdev/BoThuGian`.

---

## Tổng quan

| # | Giai đoạn | Đầu ra |
|---|---|---|
| 1 | Thu thập dữ liệu | Logo, màu, nội dung, link tham khảo |
| 2 | Brand profile | `profile.md` |
| 3 | Chốt hướng với khách (hỏi 4 câu) | Phong cách, hiệu ứng, thư viện, tư liệu |
| 4 | Dựng khung dự án | Vite + React, cấu trúc thư mục |
| 5 | Xử lý tư liệu ảnh | `public/images/*.webp` |
| 6 | Dựng từng section + hiệu ứng | Trang chạy được |
| 7 | QA bằng máy đo + mắt | 0 lỗi thật ở 1440 / 768 / 390 |
| 8 | Git + deploy | Repo GitHub + link Vercel |
| 9 | Xuất Figma prototype | Link `figma.com/proto/...` |
| 10 | Bàn giao | Gửi link + danh sách cần xác nhận |

---

## 1. Thu thập dữ liệu đầu vào

### Checklist xin khách / tự chuẩn bị

- [ ] **Logo**: PNG nền trắng hoặc SVG. Có nhiều logo thì hỏi logo nào là chính.
- [ ] **Bảng màu**: mã HEX + ý nghĩa từng màu.
- [ ] **Slogan / tagline** đã chốt.
- [ ] **Nội dung sản phẩm**: menu, bảng giá, catalog (PDF cũng được).
- [ ] **Link tham khảo giao diện**: Figma, website mẫu.
- [ ] **Kênh liên hệ**: fanpage, Google Maps, hotline, giờ mở cửa.
- [ ] **Ảnh / video thật**: không gian, sản phẩm, con người.

### Lưu ý khi đọc nguồn

| Nguồn | Vấn đề gặp | Cách xử lý |
|---|---|---|
| Facebook fanpage | Chặn đọc tự động | Hỏi khách thông tin; ghi rõ "chưa đối chiếu fanpage" trong profile |
| Figma prototype | Cần đăng nhập, chỉ chụp được màn đầu | Xin khách ảnh chụp các màn chính; đọc cả comment (có thể là góp ý quan trọng) |
| PDF menu thiết kế | Chữ trích ra lỗi dấu tiếng Việt | Render trang thành ảnh, ghép 2×2 rồi đọc bằng mắt (xem mục 5) |
| Google Maps | Đọc được địa chỉ, giờ, số đánh giá, chủ đề review | Dùng số thật (★, số lượt đánh giá, chủ đề khách nhắc) làm phần "bằng chứng" |

---

## 2. Brand profile (`profile.md`)

Viết trước khi code. Khung mục:

1. **Nhận diện**: tên (và ý nghĩa tên), slogan, tagline, cam kết, loại hình, phân khúc giá, giá trị cốt lõi.
2. **Thông tin liên hệ**: địa chỉ, toạ độ, giờ mở cửa, hotline, mạng xã hội, điểm đánh giá.
3. **Bộ nhận diện hình ảnh**: logo, bảng màu + **vai trò trên web** (nền / chữ / nút / nhấn), font chữ, ngôn ngữ hình ảnh.
4. **Giọng nói thương hiệu**: câu chữ mẫu, từ khoá hay dùng.
5. **Sản phẩm**: số nhóm, số món/sản phẩm, bảng sản phẩm chủ lực kèm giá và nhãn.
6. **Khách hàng & cảm nhận**: chủ đề khách khen/chê (lấy từ review thật), chân dung khách.
7. **Vấn đề phát hiện**: lỗi trong tài liệu của khách (xem bên dưới).
8. **Mục tiêu website + sitemap**: hành động chính (đặt bàn, mua, liên hệ…), thứ tự section.
9. **Cần khách cung cấp / xác nhận.**

### Kiểm tra chéo tài liệu khách — đã bắt được ở dự án mẫu

- Menu còn **copy tên thương hiệu khác** ("tại A Phệ…") → không đưa lên web, báo khách sửa.
- **Hai logo** dùng song song → hỏi logo chính.
- **Lỗi chính tả** (Heneiken, Bơ tơ…).
- **Figma tham khảo là mẫu của thương hiệu khác** → chỉ lấy tinh thần, không chép nội dung.

---

## 3. Chốt hướng với khách — hỏi 4 câu trước khi code

**Không tự chọn phong cách tối giản.** Lần đầu dự án mẫu bị chê "như HTML/CSS bình thường, chả hiệu ứng gì"
vì tự chọn hướng nhẹ nhàng mà không hỏi.

1. **Hiệu ứng** (chọn nhiều): cuộn kể chuyện · intro mở trang · tương tác chuột/chạm · 3D/WebGL
2. **Phong cách** (kèm mockup): theo Figma/mẫu của khách · vui nhộn theo logo · tối sang · xin link mẫu
3. **Thư viện**: GSAP + Lenis (mặc định) · Motion · GSAP + Three.js · không thư viện
4. **Tư liệu**: có video · có ảnh chất lượng cao · cho dùng stock · chưa có gì

Kết quả dự án mẫu: cả 3 nhóm hiệu ứng (trừ 3D) + theo Figma (nền kem, header tối, nút pill cam, tiêu đề serif) + GSAP + Lenis.

**Font tiếng Việt**: chỉ chọn font Google có subset Vietnamese. Đã dùng tốt: **Fraunces** (tiêu đề serif) +
**Be Vietnam Pro** (chữ thường). Thay thế: Work Sans, Playfair Display, Lora.

---

## 4. Dựng khung dự án

```bash
npm create vite@latest ten-du-an -- --template react
cd ten-du-an
npm i gsap @gsap/react lenis
```

Cấu trúc thư mục (giữ nguyên cho mọi chủ đề):

```
├── index.html            # lang="vi", meta description, og:title, font Google
├── profile.md            # brand profile (giai đoạn 2)
├── public/images/        # ảnh đã xử lý (.webp), logo
└── src/
    ├── main.jsx          # import 'lenis/dist/lenis.css' + './lib/motion.js'
    ├── App.jsx           # ghép section theo thứ tự trang
    ├── data/
    │   ├── brand.js      # tên, slogan, địa chỉ, giờ, hotline, link, video — MỘT nguồn duy nhất
    │   └── products.js   # menu / bảng giá / sản phẩm dạng { name, price, tag, note }
    ├── lib/
    │   ├── motion.js     # copy từ skill landing-motion
    │   └── hours.js      # (nếu có giờ mở cửa) trạng thái mở/đóng theo giờ VN + test
    ├── styles/base.css   # token màu, cỡ chữ, nút pill, .w/.w-in, .star
    └── components/       # mỗi section một cặp .jsx + .css, cộng ui.jsx (Btn, Split, Sticker)
```

Nguyên tắc:
- **Mọi chữ của thương hiệu nằm trong `data/`.** Đổi slogan chỉ sửa một chỗ (`brand.slogan`) là đổi theo ở hero, băng chữ chạy và footer.
- `data/products.js` viết dạng object rõ ràng để sau này đổi sang gọi API là xong.
- Form chưa có backend: gom thành tin nhắn SMS/Zalo/gọi điện; để comment chỗ thay bằng `fetch('/api/...')`.

---

## 5. Xử lý tư liệu ảnh

### Trích ảnh từ PDF thiết kế (menu, catalog)

Ảnh món trong PDF thường là **ảnh cắt nền có mask riêng** → trích kèm mask được ngay ảnh nền trong suốt, rất hợp để đặt chồng lên đĩa màu hoặc ảnh khác.

Cài công cụ tạm (không dính vào dự án):

```bash
python -m pip install --target <thư-mục-tạm>/pylib pymupdf pillow
```

```python
import io, pymupdf as fitz
from PIL import Image

doc = fitz.open('menu.pdf')
smask = {i[0]: i[1] for p in doc for i in p.get_images(full=True)}  # xref ảnh → xref mask

def extract(xref):
    pix = fitz.Pixmap(doc, xref)
    if pix.n - pix.alpha >= 4: pix = fitz.Pixmap(fitz.csRGB, pix)   # CMYK → RGB
    if pix.alpha: pix = fitz.Pixmap(pix, 0)
    if smask.get(xref): pix = fitz.Pixmap(pix, fitz.Pixmap(doc, smask[xref]))
    im = Image.open(io.BytesIO(pix.tobytes('png')))
    if smask.get(xref):                                                  # cắt sát phần có hình
        im = im.convert('RGBA'); im = im.crop(im.getchannel('A').getbbox())
    return im

extract(887).save('public/images/mon/ten-mon.webp', 'WEBP', quality=84, method=6)
```

Quy trình:
1. **Render từng trang + ghép 2×2** để đọc tên và giá (chữ trích ra hay lỗi dấu).
2. **Ghép bảng xem trước** mọi ảnh ≥300px kèm tên file + kích thước, có áp mask, trên nền màu thương hiệu → map ảnh ↔ món.
3. Bỏ ảnh nền đá, ảnh khói, ảnh mask (ảnh trắng đen hình dạng món).
4. Xuất **WebP** (q≈84); ghi `width/height` thật vào thẻ `<img>`.
5. Cuối dự án **xoá ảnh không dùng**: grep tên file trong `src/`.

### Logo tách nền trắng

Flood-fill từ góc ảnh (Pillow `ImageDraw.floodfill`, thresh≈60) → biến vùng đó thành trong suốt, làm mềm viền 2px.
Xuất thêm `logo.webp` bản nhỏ (~512px) cho web + `favicon.png` 96px. Xem thử trên nền tối của thương hiệu trước khi dùng.

### Quy tắc dùng ảnh

- Ảnh trong PDF chỉ 300–800px → **không** làm ảnh tràn toàn màn hình. Dùng thẻ bo góc vừa phải, ảnh polaroid, cắt nền chồng lớp.
- **Stock sai bối cảnh** (quán nước ngoài, sân sau nhà…) → không dùng. Chừa slot `brand.video = { src, poster }`.
- Ảnh không gian chưa có → dùng bản đồ Google nhúng cho phần liên hệ.

---

## 6. Dựng section + hiệu ứng

### Ý tưởng chủ đạo trước khi dựng

Liệt kê 8–12 thứ **chỉ thương hiệu này có** (tên và ý nghĩa tên, địa chỉ, con số, món đặc trưng, nghi thức, vật dụng…).
Chọn một thứ làm "nhân vật chính" của trang. Dự án mẫu chọn **"Thớt bò dài 1 mét"** → section ghim trượt ngang có thước đếm 0→100 cm.

### Thứ tự section và cách đổi chủ đề

| Section (Bò Thư Giãn) | Hiệu ứng (công thức trong skill) | Đổi sang chủ đề khác |
|---|---|---|
| Intro | Rót màu vào logo → kéo màn (A) | Giữ nguyên, đổi logo |
| Header | Pill theo section, ẩn/hiện khi cuộn, menu mobile (E) | Giữ nguyên |
| Hero | Chữ trồi từng từ (B), ảnh nhiều lớp theo chuột (F), nút magnetic (C), số đếm (L), tem xoay (O) | Slogan + 3 ý chính + 2 nút + 3 con số thật |
| Băng chữ chạy | Theo vận tốc cuộn (G) | 4–5 thông điệp ngắn + slogan |
| Ba chữ vàng | Ghim, lật 3 bước (H) | 3 giá trị cốt lõi / 3 bước quy trình |
| Thớt bò 1 mét | Ghim + trượt ngang + thước (I) | Sản phẩm/quy trình đặc trưng có "độ dài": hành trình, các bước, bộ sưu tập |
| Món phải thử | So le, xoay theo cuộn, nghiêng 3D (J) | 4 sản phẩm chủ lực |
| Chill đúng nghĩa | Ảnh polaroid rải → xếp lại (K), số + chip review (L) | Không gian / khách hàng / đánh giá thật |
| Thực đơn | Tab pill + món hiện lần lượt (M) | Bảng giá / danh mục / gói dịch vụ |
| Đặt bàn | Form + bản đồ + trạng thái mở cửa trực tiếp | Form liên hệ / đặt lịch / đăng ký |
| Footer | Logo, slogan, liên hệ, link | Giữ nguyên |
| Con trỏ | Nhãn theo vùng `data-cursor` (D) | Đổi nhãn theo ngữ cảnh ("Xem", "Đặt"…) |

Xen kẽ nền sáng/tối giữa các section để nhịp cuộn rõ (kem → cam → kem → xanh tối → kem → kem → xanh tối → kem → xanh tối).

### Hai tham số URL bắt buộc có

- `?nointro` — bỏ qua intro khi test.
- `?static` — tắt mọi hiệu ứng, hiện đủ nội dung ở trạng thái cuối, ảnh tải ngay. Dùng khi chụp màn hình và **nhập vào Figma**.
  Bố cục ghim chỉ bật bằng class JS (`.is-pinned`); mặc định phải là bố cục tĩnh đọc được.

---

## 7. QA — máy đo + mắt

```bash
npm run build
npm test                                   # node --test, cho logic như giờ mở cửa
npx vite preview --port 4173               # chạy nền
node ~/.claude/skills/taste-skill/scripts/inspect.mjs "http://localhost:4173/?nointro" --allow palette-claude,shadow,eyebrow
node ~/.claude/skills/taste-skill/scripts/inspect.mjs "http://localhost:4173/?static"  --allow palette-claude,shadow,eyebrow
```

- Inspector phải chạy trên **bản build qua URL**. Mở thẳng `dist/index.html` sẽ ra trang trắng vì đường dẫn `/assets`.
- `--allow palette-claude,shadow,eyebrow`: màu thương hiệu kem + cam, đổ bóng và nút trên số liệu là chủ ý của phong cách Figma.
- **Đọc ảnh chụp ở cả 3 cỡ**: 1440 / 768 / 390.

### Lỗi đã gặp và cách sửa

| Triệu chứng | Nguyên nhân | Sửa |
|---|---|---|
| Trang tràn ngang 20–30px | Băng chữ chạy / món nhô ra mép | `html, body { overflow-x: clip }` |
| Dấu tiếng Việt bị cắt (ỗ, ầ) | Mặt nạ chữ `overflow: hidden`, line-height 1 | `.w` có padding .16em trên; băng chữ line-height ≥ 1.3; không xoay nghiêng băng |
| Chữ header trùng màu nền lúc chuyển mục | Đổi màu chữ theo pill đang trượt | Mục active tô bằng CSS `[aria-current]`; pill trượt dùng màu trong mờ |
| Chữ cam nhỏ thiếu tương phản (2.9:1) | Cam sáng trên nền kem | Cam đậm `#a3480b` cho chữ nhỏ/giá; cam sáng chỉ cho nút |
| Tiêu đề ngắt giữa từ ("tử / tế") | Wrap tự do | Mỗi vế một dòng (`display: block`), dính 2 từ cuối bằng `\u00a0` |
| Tem đè lên chữ trên mobile | Vị trí tuyệt đối | Đẩy tem lên trên tiêu đề ở breakpoint mobile |
| Ký tự ★ bị coi là emoji | — | Ngôi sao 4 cánh bằng `clip-path` (lấy từ logo) |
| Máy đo báo "khoảng trống" ở nội dung chờ cuộn | Nội dung đang ẩn chờ ScrollTrigger | Bình thường; kiểm lại bằng `?static` |
| Hero bị che trong ảnh chụp | Intro đang chạy | Chụp bằng `?nointro` |

Báo khách thật những gì **chưa thử bằng tay**: nút magnetic, nghiêng 3D, con trỏ, gửi form.

---

## 8. Git + deploy

```bash
git init -b main
# .gitignore: node_modules  dist  .taste-skill
git add -A && git commit -m "..."
git remote add origin https://github.com/<user>/<repo>.git
git ls-remote origin          # trống mới push, tránh xung đột lịch sử
git push -u origin main
```

- Repo trên GitHub phải tạo **trống** (không README).
- Repo public thì ai cũng xem được ảnh, số điện thoại và `profile.md` (có ghi lỗi trong tài liệu của khách) → cân nhắc để private.

**Vercel** (link xem online, tự cập nhật mỗi lần push):
1. vercel.com → đăng nhập bằng GitHub.
2. **Add New… → Project** → Import repo → Vercel tự nhận preset Vite (`npm run build`, `dist`) → **Deploy**.

---

## 9. Xuất link Figma prototype (để gửi giảng viên / khách)

Claude **không ghi trực tiếp được vào Figma**, nên phần này người làm tự thao tác.

### Nhập web vào Figma bằng plugin html.to.design

1. Figma → tạo Design file mới → **Shift + I** → tab Plugins → **html.to.design** → Run.
2. Dán URL Vercel **có `?static`**: `https://<link>.vercel.app/?static`.
3. Bảng **Import options**:

| Tuỳ chọn | Chọn | Lý do |
|---|---|---|
| Use Autolayout | Tắt | Trang có nhiều lớp chồng nhau; tắt để giữ đúng vị trí |
| Create styles & variables | **Bật** | Figma tự tạo màu và kiểu chữ thương hiệu |
| Use existing local styles | Tắt | File mới |
| For hover effects | Tắt | Chậm, prototype không cần |
| High-res images (PRO) | Tắt | Cần trả phí; ảnh gốc cũng không lớn hơn |
| Add hyperlinks | Tắt | Bấm sẽ mở web thật; dùng "Scroll to" thay thế |
| HTML layer names | **Bật** | Layer có tên dễ đọc |

4. Chọn khung Desktop 1440 (+ Mobile 390) → **Proceed**.
5. Bảng "Missing font mapping: Google Sans Text → Inter" là font của bản đồ Google nhúng → bấm **OK**.

### Tạo link prototype

1. Bấm icon **File** ở thanh trái để mở bảng Layers.
2. Chọn frame Desktop bằng cách bấm vào **tên frame** trên canvas, không bấm vào nội dung bên trong.
3. Tab **Prototype** → **Flow starting point** → **+**.
   Nếu không thấy mục này: plugin đã bọc các frame trong một khung ngoài → chọn frame Desktop → **Ctrl + X** → bấm chỗ trống → **Ctrl + V** để đưa frame ra ngoài, rồi chọn lại.
4. **Prototype settings** → Device: **Desktop** để trang dài cuộn được khi trình chiếu.
5. (Tuỳ chọn) Chữ trên header → kéo **+** tới section → **On click → Scroll to**.
6. **▶ Present** → **Share prototype** → *Anyone with the link · can view* → **Copy link**.
7. Muốn vừa khung như link mẫu: Options → **Fit / Scale down to fit**.

Lưu ý: Figma chỉ giữ hình tĩnh, mất toàn bộ hiệu ứng GSAP; bản đồ nhúng có thể thành ô trống.

---

## 10. Bàn giao

Gửi **2 link**:
- **Figma prototype**: xem thiết kế.
- **Vercel**: xem bản chạy thật với hiệu ứng.

Kèm danh sách **cần khách xác nhận** (lấy từ mục 9 của `profile.md`): logo chính, giá/tên sản phẩm, mô tả do mình tự viết,
ảnh chất lượng cao, video thật, kênh đặt hàng (Zalo/API).

---

## Phụ lục — prompt khởi động dự án mới (copy cho Claude)

```
Tôi làm landing page cho [TÊN THƯƠNG HIỆU] — [lĩnh vực], theo đúng quy trình trong
F:\self\BothuGian\QUY-TRINH-LANDING.md và skill landing-motion.

Dataset:
- Ảnh 1: logo
- Ảnh 2: bảng màu thương hiệu
- Link giao diện tham khảo: [Figma / web mẫu]
- Fanpage: [link]
- Thông tin sản phẩm / bảng giá: [link Drive / PDF]
- Google Maps: [link]
- Slogan: "[...]"

Việc cần làm:
1. Check dữ liệu và lập profile.md
2. Hỏi tôi 4 câu chốt hướng (hiệu ứng, phong cách, thư viện, tư liệu) TRƯỚC khi code
3. Dựng khung Vite + React + GSAP + Lenis, chế độ ?nointro và ?static
4. Code các section, QA bằng inspector ở 1440/768/390
5. Commit, chờ tôi gửi link GitHub để push
```
