# Bàn giao giao diện sang Figma

File đích: https://www.figma.com/design/hCWTUKMt2QZGIExvva1Dbc/

Giữ nguyên landing đã có. Phần mới chia thành hai page: **Gọi món tại bàn** và **Quản lý nhà hàng**.

## Danh sách frame và URL đầy đủ

Mỗi màn có một URL dán thẳng vào html.to.design. Tham số `?demo=<trạng thái>` tự dựng dữ liệu mẫu cho màn đó (code: `src/shared/demo.js`).

Landing (đã nhập): `https://bothugian.vercel.app/?static` — khung 1440 và 390.

Gọi món — khung rộng 390px:

| Frame | URL |
| --- | --- |
| Quét QR / nhập bàn | `https://bothugian.vercel.app/order/` |
| Thực đơn bàn 01 | `https://bothugian.vercel.app/order/?ban=1` |
| Giỏ món | `https://bothugian.vercel.app/order/?ban=1&demo=cart` |
| Giỏ trống | `https://bothugian.vercel.app/order/?ban=1&demo=cart-empty` |
| Đơn của bàn | `https://bothugian.vercel.app/order/?ban=1&demo=bill` |
| Chọn thanh toán | `https://bothugian.vercel.app/order/?ban=1&demo=pay` |
| VietQR | `https://bothugian.vercel.app/order/?ban=1&demo=vietqr` |
| Ví điện tử | `https://bothugian.vercel.app/order/?ban=1&demo=wallet` |
| Tiền mặt | `https://bothugian.vercel.app/order/?ban=1&demo=cash` |
| Thẻ ngân hàng | `https://bothugian.vercel.app/order/?ban=1&demo=card` |
| Cảm ơn và đánh giá | `https://bothugian.vercel.app/order/?ban=1&demo=thanks` |
| Đã gửi đánh giá | `https://bothugian.vercel.app/order/?ban=1&demo=thanks-done` |

Quản lý — khung rộng 1440px:

| Frame | URL |
| --- | --- |
| Order và sơ đồ bàn | `https://bothugian.vercel.app/admin/?demo=orders` |
| Mã QR từng bàn | `https://bothugian.vercel.app/admin/#tables` |
| Thực đơn | `https://bothugian.vercel.app/admin/#menu` |
| Thêm món | `https://bothugian.vercel.app/admin/?demo=menu-add` |
| Sửa món | `https://bothugian.vercel.app/admin/?demo=menu-edit` |
| Không có kết quả | `https://bothugian.vercel.app/admin/?demo=menu-empty` |
| Đánh giá và doanh thu | `https://bothugian.vercel.app/admin/?demo=insights` |

## Lưu ý khi nhập

- Mở một link `?demo=` sẽ xoá order, hoá đơn, đánh giá demo đang có trong trình duyệt đó rồi dựng lại dữ liệu mẫu. Không gửi link `?demo=` cho khách thật.
- Giờ trong dữ liệu mẫu tính theo lúc mở trang, nên mỗi lần nhập giờ hiển thị sẽ khác.
- Không dùng dữ liệu thật của khách cho bộ frame mẫu.
- Font tiêu đề: Lucky Chunks bản có tiếng Việt tại `nguon/font/lucky-chunks/Lucky Chunks VN.ttf`. Font nội dung: Comfortaa, có trong `nguon/font/comfortaa/`.
- Không thay Lucky Chunks VN bằng bản gốc thiếu dấu. Kiểm tra dấu tiếng Việt sau khi nhập.
- Nếu làm giống lần trước: nhập bằng html.to.design, tắt Auto layout để ưu tiên giữ vị trí; bật tạo styles/variables và tên layer HTML. Đây là cấu hình đã dùng trước đây, cần đối chiếu giao diện plugin hiện tại.

## Prototype cần nối

Thực đơn → Giỏ món → Đơn của bàn → Chọn thanh toán → Phương thức thanh toán → Cảm ơn/feedback → Đã gửi đánh giá.

Quản lý: nối các mục thanh điều hướng; nút Thêm/Sửa mở form; Huỷ đóng form. Không tự đổi quyền chia sẻ file hoặc xuất bản prototype công khai.

## Trạng thái

Đã có URL cho cả 19 màn (kiểm tra trên bản build ngày 17/11/2026). Chưa nhập frame vào Figma: Claude không có kết nối ghi vào Figma, người làm tự nhập bằng html.to.design.
