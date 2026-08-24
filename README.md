# Đổ Xăng Online ⛽

Website mô phỏng quá trình chọn phương tiện, chọn loại nhiên liệu và đổ xăng trực tuyến. Dự án được viết bằng HTML, CSS và JavaScript thuần, không cần cài framework hay thư viện build.

> Đây là website giải trí. Việc đổ xăng và số tiền hiển thị chỉ là mô phỏng.

## Chức năng chính

- Chọn xe máy, ô tô hoặc phương tiện đặc biệt.
- Hiển thị dung tích bình xăng của từng xe.
- Lấy giá nhiên liệu mới từ API `giaxanghomnay.com`.
- Tự động dùng giá dự phòng khi API không truy cập được.
- Chọn đổ đầy bình hoặc nhập số tiền muốn đổ.
- Các mức tiền nhanh: 20k, 50k, 100k, 200k và 500k.
- Mô phỏng tiến độ đổ xăng, số lít và tổng tiền.
- Hỗ trợ giao diện responsive trên máy tính và điện thoại.

## Cấu trúc dự án

```text
do-xang-oline/
├── index.html   # Giao diện, CSS và logic tương tác/mô phỏng
├── fuel-api.js  # Gọi API và chuẩn hóa dữ liệu giá nhiên liệu
└── README.md     # Tài liệu tổng quan dự án
```

### `index.html`

Chứa:

- Toàn bộ bố cục và kiểu hiển thị của website.
- Danh sách phương tiện và dung tích bình xăng.
- Giá nhiên liệu dự phòng.
- Logic chọn xe, chọn nhiên liệu và nhập số tiền.
- Logic mô phỏng quá trình đổ xăng.
- Trạng thái loading, thành công và lỗi trên giao diện.

### `fuel-api.js`

Đây là tầng giao tiếp dữ liệu, không thao tác trực tiếp với DOM. File này phụ trách:

- Tạo URL API theo ngày hiện tại.
- Gọi API với thời gian chờ tối đa 10 giây.
- Chọn các loại nhiên liệu cần hiển thị.
- Ưu tiên giá `zone1_price` của Vùng 1.
- Chuẩn hóa response thành cấu trúc đơn giản:

```js
{
  name: 'Xăng E5 RON 92-II',
  price: 21830,
  icon: '🔥'
}
```

Module cung cấp đối tượng toàn cục `FuelApi` với ba hàm:

```js
FuelApi.fetchFuelPrices();
FuelApi.getLocalDate();
FuelApi.parseFuelData(data, requestedDate);
```

## Luồng lấy giá xăng

1. `index.html` nạp `fuel-api.js`.
2. Khi trang mở, hàm `loadFuelPrices()` được gọi.
3. `FuelApi.fetchFuelPrices()` gửi request đến:

   ```text
   https://giaxanghomnay.com/api/pvdate/YYYY-MM-DD
   ```

4. Dữ liệu được lọc và chuẩn hóa trong `fuel-api.js`.
5. `index.html` nhận danh sách nhiên liệu rồi cập nhật giao diện.
6. Nếu request thất bại hoặc không có dữ liệu phù hợp, website dùng `FALLBACK_FUELS` trong `index.html`.

## Cách chạy

Nên chạy dự án qua một web server cục bộ thay vì mở trực tiếp file HTML để tránh giới hạn liên quan đến CORS hoặc việc tải file JavaScript.

Nếu máy có Python:

```bash
python3 -m http.server 8000
```

Sau đó mở:

```text
http://localhost:8000
```

Không cần chạy `npm install` hoặc build dự án.

## Chỉnh sửa nhanh

### Thêm hoặc sửa phương tiện

Chỉnh mảng `xeData` trong `index.html`:

```js
{
  group: 'Ô tô',
  name: 'Toyota Vios',
  desc: 'Sedan phổ thông',
  tank: 42,
  icon: '🚗'
}
```

### Thay đổi loại nhiên liệu lấy từ API

Chỉnh `FUEL_CONFIG` trong `fuel-api.js`. Giá trị `title` phải khớp với tên do API trả về:

```js
const FUEL_CONFIG = [
  { title: 'Xăng RON 95-III', icon: '⛽' },
  { title: 'Xăng E5 RON 92-II', icon: '🔥' },
  { title: 'DO 0,05S-II', icon: '🪣' },
];
```

### Thay đổi giá dự phòng

Chỉnh `FALLBACK_FUELS` trong `index.html`. Các giá này chỉ được sử dụng khi API gặp lỗi hoặc không trả về dữ liệu phù hợp.

## Nguồn dữ liệu

Giá nhiên liệu được lấy từ API của [giaxanghomnay.com](https://giaxanghomnay.com/). Khả năng truy cập API còn phụ thuộc vào kết nối mạng, chính sách CORS và trạng thái của dịch vụ bên ngoài.
