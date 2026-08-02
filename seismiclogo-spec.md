# SeismicLogo — Spec: Mode Selection + Layout Mới

## 0. Bối cảnh
App hiện tại (seismiclogo.xyz) là công cụ chèn logo/PFP lên ảnh: chọn ảnh, kéo-thả logo, zoom/xoay bằng 2 ngón, thêm text, lưu ảnh, có toggle EN/VI. Spec này mô tả bản nâng cấp: thêm màn hình chọn chế độ khi vào app, đổi layout theo lưới 10 hàng, thêm popup "Add more PFP", và nâng cấp tính năng Add Text.

## 1. Màu sắc chủ đạo
- Nền chính (background): trắng
- Chữ (text): nâu
- Background của khu vực nội dung: trắng

## 2. Màn hình chọn chế độ (hiện khi vào app / "log in")
Popup nằm giữa màn hình, hỏi:

**"Bạn chọn chế độ sử dụng nào"**

- `[Seismic logo & PFP]` — kèm chú thích: gồm các PFP và logo của cộng đồng Seismic
- `[Personal PFP and logo]` — kèm chú thích: custom theo sở thích của bạn

Chọn xong mới vào layout chính (mục 3).

- Nếu chọn **Seismic logo & PFP** → app load sẵn 10 asset mặc định (xem mục 8).
- Nếu chọn **Personal PFP and logo** → hàng 8 và 9 (khu PFP) trống hoàn toàn, người dùng tự add qua "Add more PFP".

## 3. Layout tổng thể — lưới 10 hàng dọc bằng nhau

### Hàng 1
- 2/3 bên trái: tiêu đề "Seismic logo & PFP" căn giữa
- 1/3 bên phải: nút chọn ngôn ngữ `[EN | VI]` căn phải

### 1/3 cuối hàng 1 + hàng 2, 3, 4, 5, 6 + 2/3 đầu hàng 7
- Vùng xám lớn "Tap to choose a photo"
- Bấm vào để chọn ảnh nền từ kho ảnh (thư viện ảnh máy)

### 1/3 cuối hàng 7
- Vùng spacing, chứa dòng hướng dẫn (căn giữa, chữ nhỏ):
  `"Choose a photo, pick a PFP, drag anywhere to move – 2 fingers to zoom & rotate – X to delete"`

### Hàng 8
- 5 ô vuông chứa PFP (PFP luôn là hình vuông)
- Ô nào chưa có logo/PFP → hiển thị ô xám (placeholder)

### Hàng 9
- 5 ô vuông tiếp theo, cùng logic với hàng 8

**Thứ tự điền PFP vào 10 ô (trên → dưới, rồi trái → phải):**
```
1  3  5  7  9   (hàng 8)
2  4  6  8  10  (hàng 9)
```

### Hàng 10
- 3 nút chia đều nhau, **kích thước bằng nhau tuyệt đối** (không có nút to nút nhỏ):
  `[Add more PFP]` `[Add text]` `[Save image]`

## 4. Swipe ngang khi PFP đầy 2 hàng (10/10 ô đã có ảnh)
- Khi cả 10 ô đã full và còn PFP khác chưa hiển thị (do người dùng add nhiều hơn 10), khu vực 2 hàng PFP cho phép **swipe ngang** để xem thêm.
- Mũi tên chỉ hướng xuất hiện trong vùng spacing cạnh lưới PFP (cách lề 20px, cùng vùng spacing mô tả ở hàng 7):
  - Ở vị trí đầu danh sách (chưa swipe): chỉ hiện mũi tên bên **phải** (còn nội dung để xem tiếp bên phải).
  - Ở vị trí cuối danh sách (swipe hết cỡ sang phải): chỉ hiện mũi tên bên **trái**.
  - Ở vị trí giữa: hiện **cả hai** mũi tên trái và phải.

## 5. Popup "Add more PFP"
Bấm nút `[Add more PFP]` ở hàng 10 → hiện popup giữa màn hình:

```
[  Nhập link X hoặc handle...  ]   ← ô nhập, nền xám (thể hiện là ô lõm/input)
[     Đã chọn N ảnh / Nhập ảnh từ kho ảnh     ]   ← nút, có drop shadow (thể hiện là nút bấm được)
[Cancel]              [Add]
```

Chi tiết hành vi:
- **Ô nhập link X/handle**: nền xám khi rỗng. Bấm vào → hiện bàn phím để người dùng gõ tay hoặc paste. Mỗi lần add chỉ nhập **1 link/handle**.
- **Nút nhập ảnh từ kho ảnh**: mở thư viện ảnh, cho phép **chọn nhiều ảnh cùng lúc**. Sau khi chọn xong, label nút đổi từ `Nhập ảnh từ kho ảnh` → `Đã chọn N ảnh` (N = số ảnh đã chọn).
- **Cancel**: đóng popup, không thêm gì.
- **Add**: thêm (các) ảnh/link đã chọn vào cuối danh sách PFP hiện có, theo đúng thứ tự điền ở mục 3 (1,3,5,7,9 / 2,4,6,8,10, tiếp tục nối dài nếu vượt quá 10 ô → dùng cơ chế swipe ở mục 4).

## 6. Add Text — nâng cấp
Logic nhập text hiện tại còn sơ sài (bản build đầu). Yêu cầu Claude Code tối ưu lại theo hướng giống tính năng thêm chữ lên ảnh của Facebook, cụ thể cần có:
- Nhập text trực tiếp trên canvas, con trỏ nhấp nháy, resize khung theo nội dung
- Kéo để di chuyển vị trí text
- Pinch để zoom cỡ chữ, xoay bằng 2 ngón (đồng bộ với logic zoom/rotate của logo, xem mục 7)
- Có thể chỉnh màu chữ (tối thiểu WHITE/BLACK như logo, có thể mở rộng thêm nếu Claude Code thấy hợp lý)
- Có nút xóa riêng cho từng khối text, theo cùng cơ chế nút xóa ở mục 7

## 7. Logic chọn / chỉnh sửa logo-PFP-text trên canvas (giữ nguyên như cũ)
Khi một logo/PFP/text đang được chọn trên ảnh:
- Viền: stroke màu xanh dạ quang (neon)
- Góc trái-trên: nút xoay (rotate handle)
- Góc phải-trên: nút xóa (delete handle)
- Zoom to/nhỏ: pinch 2 ngón trên mobile, hoặc scroll wheel chuột trên PC

## 8. Danh sách asset mặc định — chế độ "Seismic logo & PFP"
Khi chọn chế độ này, 10 ô PFP (hàng 8-9) tự động điền sẵn theo đúng thứ tự 1→10 mô tả ở mục 3:

1. Logo Seismic chuẩn 1
2. Logo Seismic 2
3. Logo Seismic 3
4. Logo Seismic 4
5. Logo Seismic cách điệu
6. Đầu rocky cách điệu
7. PFP của Lyron
8. PFP mod 1
9. PFP mod 2
10. PFP mod 3

Ghi chú: trong 10 asset trên, 6 cái là ảnh tĩnh do người dùng (owner) cung cấp trực tiếp, 4 cái còn lại là link/handle X (cần fetch ảnh từ X). Claude Code cần thiết kế sẵn chỗ để nhét 6 file ảnh + 4 link X này vào (constant/config file), phần nội dung thật sẽ được cung cấp sau.

## 9. Chế độ "Personal PFP and logo"
Không có asset mặc định nào. Hàng 8 và 9 hoàn toàn trống (toàn bộ 10 ô đều là ô xám placeholder) cho tới khi người dùng tự bấm `[Add more PFP]` để thêm.

## 10. Lưu ý cho Claude Code
- Đây là spec UI/UX + hành vi, không kèm code hiện tại — Claude Code cần đọc source hiện có trong project trước khi sửa, để giữ đúng logic cũ ở phần chọn ảnh nền, kéo-thả, zoom/rotate, save image, và toggle EN/VI.
- Ưu tiên giữ nguyên các phần chưa được nhắc tới trong spec này (không refactor ngoài phạm vi).
- Layout 10 hàng cần responsive tốt trên mobile lẫn desktop, vì app dùng cả pinch-zoom (mobile) và scroll-wheel zoom (desktop).
