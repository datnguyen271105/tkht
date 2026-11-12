// ===================== MOCK DATA =====================

export const MEMBERS = [
  {
    id: 'CM0001',
    hoTen: 'Nguyễn Văn A',
    ngaySinh: '1990-01-15',
    diaChi: '123 Lê Lợi, Quận 1, TP.HCM',
    sdt: '0900000001',
    email: 'a@test.com',
    hang: 'Vàng',
    trangThai: 'Có hiệu lực',
    giamGia: 10,
    ngayCap: '2024-01-01',
  },
  {
    id: 'CM0002',
    hoTen: 'Trần Thị B',
    ngaySinh: '1995-06-20',
    diaChi: '456 Nguyễn Huệ, Quận 1, TP.HCM',
    sdt: '0900000002',
    email: 'b@test.com',
    hang: 'Bạch Kim',
    trangThai: 'Hết hiệu lực',
    giamGia: 15,
    ngayCap: '2023-01-01',
  },
];

export const MOVIES = [
  {
    id: 'M001',
    ten: 'Avengers: Doomsday',
    theLoai: 'Hành động / Siêu anh hùng',
    thoiLuong: 150,
    moTa: 'Các siêu anh hùng tập hợp để đối mặt với mối đe dọa lớn nhất từ trước đến nay.',
  },
  {
    id: 'M002',
    ten: 'Lật Mặt 8',
    theLoai: 'Hài / Hành động',
    thoiLuong: 128,
    moTa: 'Phần tiếp theo của thương hiệu phim Lật Mặt nổi tiếng.',
  },
  {
    id: 'M003',
    ten: 'Interstellar 2',
    theLoai: 'Khoa học viễn tưởng',
    thoiLuong: 170,
    moTa: 'Hành trình xuyên không gian và thời gian để cứu nhân loại.',
  },
  {
    id: 'M004',
    ten: 'Cô Gái Từ Quá Khứ',
    theLoai: 'Tình cảm / Lãng mạn',
    thoiLuong: 110,
    moTa: 'Câu chuyện tình yêu vượt thời gian đầy cảm xúc.',
  },
  {
    id: 'M005',
    ten: 'Quái Vật Đại Dương',
    theLoai: 'Kinh dị / Hồi hộp',
    thoiLuong: 115,
    moTa: 'Bí ẩn từ đáy đại dương đe dọa một thành phố ven biển.',
  },
];

export const SHOWTIMES = [
  // M001 showtimes
  { id: 'ST001', phimId: 'M001', ngay: '2026-11-14', gioBD: '09:00', gioKT: '11:30', phong: 'Phòng 1', giaVeCoBan: 90000 },
  { id: 'ST002', phimId: 'M001', ngay: '2026-11-14', gioBD: '14:00', gioKT: '16:30', phong: 'Phòng 2', giaVeCoBan: 100000 },
  { id: 'ST003', phimId: 'M001', ngay: '2026-11-15', gioBD: '19:00', gioKT: '21:30', phong: 'Phòng 1', giaVeCoBan: 120000 },
  // M002 showtimes
  { id: 'ST004', phimId: 'M002', ngay: '2026-11-14', gioBD: '10:00', gioKT: '12:08', phong: 'Phòng 3', giaVeCoBan: 90000 },
  { id: 'ST005', phimId: 'M002', ngay: '2026-11-15', gioBD: '15:30', gioKT: '17:38', phong: 'Phòng 3', giaVeCoBan: 100000 },
  // M003 showtimes
  { id: 'ST006', phimId: 'M003', ngay: '2026-11-14', gioBD: '19:30', gioKT: '22:20', phong: 'Phòng 2', giaVeCoBan: 110000 },
  // M004 - no showtimes (empty)
  // M005 showtimes
  { id: 'ST007', phimId: 'M005', ngay: '2026-11-15', gioBD: '20:00', gioKT: '21:55', phong: 'Phòng 4', giaVeCoBan: 95000 },
];

// Ghế: trạng thái ban đầu - một số ghế "đã bán" hoặc "tạm giữ" để demo
// key: `${showtimeId}-${ghe}`, value: 'trong' | 'tam_giu' | 'da_ban'
export const INITIAL_SEAT_STATUS = {
  'ST001-B3': 'da_ban',
  'ST001-B4': 'da_ban',
  'ST001-C5': 'tam_giu',
  'ST001-D2': 'da_ban',
  'ST001-E1': 'da_ban',
  'ST002-A1': 'da_ban',
  'ST002-C3': 'tam_giu',
  'ST002-F4': 'da_ban',
  'ST006-D5': 'da_ban',
  'ST006-D6': 'da_ban',
  'ST006-E3': 'tam_giu',
};

export const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
export const COLS = [1, 2, 3, 4, 5, 6, 7, 8];
export const VIP_ROWS = ['E', 'F'];
export const VIP_SURCHARGE = 20000;

export const MEMBER_CARDS = {
  CM0001: { valid: true, discount: 10, hang: 'Vàng', hoTen: 'Nguyễn Văn A' },
  CM0002: { valid: false, discount: 0, hang: 'Bạch Kim', hoTen: 'Trần Thị B' },
};

// Hàm tự sinh mã thẻ
let memberCounter = MEMBERS.length + 1;
export function genMemberCode() {
  const code = `CM${String(memberCounter).padStart(4, '0')}`;
  memberCounter++;
  return code;
}

// Hàm tự sinh mã đơn
let orderCounter = 1;
export function genOrderCode() {
  const code = `DH${String(orderCounter).padStart(5, '0')}`;
  orderCounter++;
  return code;
}

// Hàm tự sinh mã hóa đơn
let invoiceCounter = 1;
export function genInvoiceCode() {
  const code = `HD${String(invoiceCounter).padStart(5, '0')}`;
  invoiceCounter++;
  return code;
}

export function formatCurrency(amount) {
  return amount.toLocaleString('vi-VN') + 'đ';
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}
