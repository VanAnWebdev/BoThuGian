// Nguồn: menu PDF 24 trang (10/2026). Giá VNĐ, chưa gồm VAT.
// tag: nhãn in trên menu; note: mô tả ngắn; unit: hậu tố sau giá.

export const formatPrice = (n) => n.toLocaleString('vi-VN')

export const menu = [
  {
    id: 'khai-vi', name: 'Khai vị', items: [
      { name: 'Đậu khuôn chiên xốc mắm ớt', price: 59000 },
      { name: 'Gan bò rim', price: 59000 },
      { name: 'Khoai tây chiên', price: 59000 },
      { name: 'Bò sốt lá lốt xúc bánh tráng', price: 135000, tag: 'Must try' },
      { name: 'Lườn ngang sốt tiêu đen chanh dây', price: 105000 },
      { name: 'Nem chua bò tơ', price: 109000, tag: 'Best seller', note: 'da bò Duy Xuyên, ủ vỏ bắp' },
      { name: 'Lạp xưởng bò nướng chấm chẩm chéo', price: 159000, tag: 'Must try' },
      { name: 'Bò một nắng muối kiến', price: 139000, tag: 'Đặc sản Gia Lai' },
    ],
  },
  {
    id: 'goi', name: 'Gỏi', items: [
      { name: 'Larb bò', price: 135000, tag: 'Must try', note: 'cay' },
      { name: 'Salad rau má bò tơ', price: 125000, tag: 'Best seller' },
      { name: 'Gỏi rau muống bắp bò', price: 125000, tag: 'Must try' },
      { name: 'Lá sách bao tử trộn', price: 139000, note: 'cay' },
      { name: 'Bò tái chanh lá é', price: 119000, note: 'cay' },
      { name: 'Salad rong nho', price: 85000 },
    ],
  },
  {
    id: 'hap', name: 'Hấp', items: [
      { name: 'Bò tơ xông hơi', price: 165000, tag: 'Must try', note: 'xông đá nóng tại bàn' },
      { name: 'Hấp thập cẩm', price: 199000, tag: 'Best seller', note: 'lá sách, bao tử, dồi, huyết, gân' },
      { name: 'Bò cuộn cuốn rau rừng', price: 189000 },
      { name: 'Tai heo cuộn bắp bò ủ muối thảo mộc', price: 189000 },
      { name: 'Tủy ốc bò hấp tiêu xanh', price: 125000 },
      { name: 'Dồi tiết mỡ bò hấp hành', price: 105000 },
    ],
  },
  {
    id: 'nuong', name: 'Nướng', items: [
      { name: 'Bò tơ nướng', price: 75000, unit: '/100gr', tag: 'Best seller', note: 'gọi từ 200gr · có da hoặc không da' },
      { name: 'Lòng bò nướng hoa tiêu', price: 99000 },
      { name: 'Bò nướng lá lốt', price: 109000 },
      { name: 'Bò nướng mỡ chài', price: 109000 },
      { name: 'Combo bò cuốn', price: 169000, note: 'bò sụn lá lốt, bò mỡ chài, dồi tiết' },
      { name: 'Combo bò nướng 1', price: 209000, tag: 'Best seller', note: 'bò tơ nướng, lòng bò, dồi tiết' },
      { name: 'Combo bò nướng 2', price: 259000, note: 'xương bò, bò nướng tảng, lòng bò' },
      { name: 'Khoai tây nướng sốt bò phô mai', price: 125000 },
    ],
  },
  {
    id: 'suon', name: 'Sườn bò nướng', items: [
      { name: 'Sườn bò núi lửa', price: 299000, tag: 'Best seller', note: 'hầm chậm, ăn kèm bánh mì' },
      { name: 'Sườn tảng nướng sốt tiêu', price: 349000, tag: 'Best seller' },
      { name: 'Sườn que nướng', price: 169000, note: 'sốt riềng mẻ, mắm nhĩ hoặc muối ớt' },
    ],
  },
  {
    id: 'chien-xao', name: 'Chiên xào', items: [
      { name: 'Nội tâm xào xạc hương quê', price: 135000, tag: 'Must try', note: 'xào cà đắng hoặc lá lốt' },
      { name: 'Ba chỉ bò tơ xào nén', price: 149000, tag: 'Must try' },
      { name: 'Lòng bò chiên mắm', price: 105000 },
      { name: 'Khấu đuôi xào nghệ', price: 135000 },
      { name: 'Bò tơ cháy riềng lá chanh', price: 145000 },
      { name: 'Bò kéo pháo', price: 145000 },
      { name: 'Tủy ốc bò chiên trứng', price: 99000 },
      { name: 'Ram bò lá lốt', price: 135000 },
      { name: 'Lá sách, bao tử xào khế', price: 149000 },
      { name: 'Lưỡi bò xào măng cay', price: 139000 },
    ],
  },
  {
    id: 'ham-um', name: 'Hầm & um', items: [
      { name: 'Bò tơ um nén', price: 159000, tag: 'Must try' },
      { name: 'Bò dùm sốt pate', price: 159000, tag: 'Must try', note: 'pate quán tự làm' },
      { name: 'Gân đuôi bò um', price: 179000 },
      { name: 'Xáo bò viên bắp bò trụng', price: 169000 },
      { name: 'Xáo huyết bò tơ', price: 59000 },
    ],
  },
  {
    id: 'nhung', name: 'Bò nhúng', items: [
      { name: 'Set nhúng lẩu 2 ngăn', price: 379000, tag: 'Must try', note: 'thớt bò 1 mét, 5 loại bò, 6 loại rau' },
      { name: 'Ống tủy nhất dương', price: 199000, tag: 'Best seller' },
      { name: 'Bò nhúng mẻ', price: 199000, note: 'chua thanh' },
      { name: 'Bò nhúng ruốc', price: 199000, note: 'đậm đà ruốc Huế' },
      { name: 'Bò nhúng ớt', price: 199000, note: 'cay nồng' },
    ],
  },
  {
    id: 'lau', name: 'Lẩu', items: [
      { name: 'Lẩu bò nội tâm', price: 189000, note: 'nước dùng hầm xương 12 giờ' },
      { name: 'Lẩu bò vẫy đuôi thập cẩm', price: 299000 },
      { name: 'Lẩu riêu cua bắp bò', price: 299000 },
      { name: 'Lẩu sườn bò nấu khế', price: 299000 },
    ],
  },
  {
    id: 'ga-vit', name: 'Gà & vịt', items: [
      { name: 'Gà đen hấp mướp', price: 529000, unit: '/con', tag: 'Must try', note: 'gà đen Tây Bắc' },
      { name: 'Lẩu gà H’Mông lá é', price: 449000 },
      { name: 'Vịt cháy tỏi', price: 145000 },
    ],
  },
  {
    id: 'com', name: 'Cơm & mì', items: [
      { name: 'Cơm chiên bò kim chi', price: 119000, tag: 'Must try' },
      { name: 'Cơm chiên thịt ruốc', price: 119000 },
      { name: 'Cơm chiên bò dưa cải', price: 119000 },
      { name: 'Cơm chiên bò bơ tỏi', price: 109000 },
      { name: 'Cơm chiên trứng', price: 75000 },
      { name: 'Mì xào bò', price: 129000 },
    ],
  },
  {
    id: 'do-uong', name: 'Đồ uống', items: [
      { name: 'Bia Larue Bạc', price: 22000 },
      { name: 'Bia Tiger Bạc', price: 24000 },
      { name: 'Bia Heineken Bạc', price: 27000 },
      { name: 'Tiger lùn', price: 22000 },
      { name: 'Heineken lùn', price: 24000 },
      { name: 'Soju Hàn Quốc', price: 119000, note: 'truyền thống, đào, việt quất' },
      { name: 'Rượu nếp sữa, rượu mơ, táo mèo', price: 79000, note: 'chai 250ml' },
      { name: 'Rượu nếp sữa, rượu mơ, táo mèo', price: 149000, note: 'chai 500ml' },
      { name: 'Pepsi, 7 Up', price: 22000 },
      { name: 'Nước khoáng ngọt, lạt', price: 22000 },
      { name: 'Aquafina', price: 16000 },
    ],
  },
]

// Món phải thử: ảnh cắt nền trích từ menu PDF (public/images/mon)
export const signature = [
  { name: 'Sườn bò núi lửa', price: 299000, tag: 'Best seller', img: 'suon-nui-lua', w: 666, h: 585, disc: 'var(--clay)',
    fact: 'Sườn bò tươi hầm chậm tới khi thớ thịt mềm mượt mà vẫn dai ngọt. Lớp mỡ mỏng quyện trong nạc, sốt ngọt thanh hậu chua nhẹ, chấm cùng bánh mì giòn rụm.' },
  { name: 'Ống tủy nhất dương', price: 199000, tag: 'Best seller', img: 'ong-tuy', w: 525, h: 622, disc: 'var(--leaf)',
    fact: 'Xương ống hầm trong nước dùng đậu đen, phục vụ kèm ống hút lớn để hút phần tủy béo ngậy nóng hổi bên trong.' },
  { name: 'Bò tơ xông hơi', price: 165000, tag: 'Must try', img: 'xong-hoi', w: 540, h: 488, disc: 'var(--orange)',
    fact: 'Bò tơ tươi tẩm ướp gia vị, xông hơi ngay tại bàn bằng đá nóng, thơm nghi ngút mùi sả và lá tía tô.' },
  { name: 'Nem chua bò tơ', price: 109000, tag: 'Best seller', img: 'nem-chua', w: 477, h: 661, disc: 'var(--leaf)',
    fact: 'Da bò tơ Duy Xuyên thái mỏng, trộn đều thịt bò tươi ngọt mềm, lên men tự nhiên bằng vỏ bắp tươi.' },
]
