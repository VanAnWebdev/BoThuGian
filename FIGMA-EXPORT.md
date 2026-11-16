# Bàn giao giao diện sang Figma

File đích: https://www.figma.com/design/hCWTUKMt2QZGIExvva1Dbc/

Giữ nguyên landing đã có. Phần mới chia thành hai page: **Gọi món tại bàn** và **Quản lý nhà hàng**.

## Danh sách frame

Gọi món: ưu tiên khung rộng 390px, viewport cao 844px; nội dung dài cuộn dọc.

| Frame | Trang nguồn / trạng thái cần chuẩn bị |
| --- | --- |
| Quét QR / nhập bàn | `/order/` không có số bàn |
| Thực đơn bàn 01 | `/order/?ban=1#menu` |
| Giỏ món | `#cart`, giỏ có món, số lượng và ghi chú |
| Giỏ trống | `#cart`, giỏ chưa có món |
| Đơn của bàn | `#bill`, có order trong phiên đang mở |
| Chọn thanh toán | `#pay`, hoá đơn chưa gọi thanh toán |
| VietQR | Chọn VietQR trên màn thanh toán |
| Ví điện tử | Chọn MoMo / Zalopay |
| Tiền mặt | Chọn tiền mặt, chờ xác nhận thu |
| Thẻ ngân hàng | Chọn thẻ, chờ xác nhận thu |
| Cảm ơn và đánh giá | Nhân viên xác nhận đã thu; chưa gửi feedback |
| Đã gửi đánh giá | Chọn sao và gửi feedback |

Quản lý: ưu tiên khung rộng 1440px, viewport cao 1024px.

| Frame | Trang nguồn / trạng thái cần chuẩn bị |
| --- | --- |
| Order và sơ đồ bàn | `/admin/#orders`, có order và yêu cầu thanh toán |
| Mã QR từng bàn | `/admin/#tables` |
| Thực đơn | `/admin/#menu` |
| Thêm món | Mở nút Thêm món |
| Sửa món | Mở nút Sửa của một món |
| Không có kết quả | Tìm tên món không tồn tại |
| Đánh giá và doanh thu | `/admin/#insights`, có hoá đơn đã thanh toán và đánh giá |

## Lưu ý khi nhập

- Các trang hiện dùng localStorage. Chỉ dán URL `#cart`, `#bill`, `#pay` vào công cụ nhập chạy ở trình duyệt khác sẽ không mang theo dữ liệu bàn. Cần chụp đúng trạng thái đã chuẩn bị hoặc tạo bản xuất riêng có dữ liệu mẫu trước khi nhập hàng loạt.
- Phương thức thanh toán lấy từ dữ liệu hoá đơn, không lấy từ hash. Không dùng riêng `#pay/vietqr` để tạo màn VietQR.
- Không dùng dữ liệu thật của khách cho bộ frame mẫu.
- Font tiêu đề: Lucky Chunks bản có tiếng Việt tại `nguon/font/lucky-chunks/Lucky Chunks VN.ttf`. Font nội dung: Comfortaa, có trong `nguon/font/comfortaa/`.
- Không thay Lucky Chunks VN bằng bản gốc thiếu dấu. Kiểm tra dấu tiếng Việt sau khi nhập.
- Nếu làm giống lần trước: nhập bằng html.to.design, tắt Auto layout để ưu tiên giữ vị trí; bật tạo styles/variables và tên layer HTML. Đây là cấu hình đã dùng trước đây, cần đối chiếu giao diện plugin hiện tại.
- `?static` chỉ được triển khai cho landing hiện có; chưa coi tham số này là bộ xuất trạng thái cho app gọi món/admin.

## Prototype cần nối

Thực đơn → Giỏ món → Đơn của bàn → Chọn thanh toán → Phương thức thanh toán → Cảm ơn/feedback → Đã gửi đánh giá.

Quản lý: nối các mục thanh điều hướng; nút Thêm/Sửa mở form; Huỷ đóng form. Không tự đổi quyền chia sẻ file hoặc xuất bản prototype công khai.

## Trạng thái

Đã xác định file đích và danh sách màn. Chưa nhập frame vào Figma; phiên hiện tại chưa có kết nối Figma để ghi vào file.
