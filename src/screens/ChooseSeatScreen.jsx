import { useState } from 'react';
import { ROWS, COLS, VIP_ROWS, VIP_SURCHARGE, genOrderCode, formatCurrency } from '../mock';

function getSeatKey(showtimeId, row, col) {
  return `${showtimeId}-${row}${col}`;
}

export default function ChooseSeatScreen({ onNavigate, selectedMovie, selectedShowtime, seatStatus, onConfirmSeats }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  if (!selectedMovie || !selectedShowtime) {
    onNavigate('searchMovie');
    return null;
  }

  const getStatus = (row, col) => {
    const key = getSeatKey(selectedShowtime.id, row, col);
    return seatStatus[key] || 'trong';
  };

  const toggleSeat = (row, col) => {
    const status = getStatus(row, col);
    if (status === 'da_ban' || status === 'tam_giu') return;
    const label = `${row}${col}`;
    setSelectedSeats(prev =>
      prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
    );
  };

  const getSeatColor = (row, col) => {
    const status = getStatus(row, col);
    const label = `${row}${col}`;
    if (status === 'da_ban') return 'bg-gray-600 cursor-not-allowed opacity-60';
    if (status === 'tam_giu') return 'bg-yellow-500 cursor-not-allowed';
    if (selectedSeats.includes(label)) return 'bg-green-500 hover:bg-green-400 cursor-pointer ring-2 ring-white';
    return 'bg-blue-700 hover:bg-blue-500 cursor-pointer';
  };

  const handleConfirm = () => {
    const orderCode = genOrderCode();
    const now = new Date();
    const order = {
      id: orderCode,
      phim: selectedMovie,
      suat: selectedShowtime,
      ghes: selectedSeats,
      trangThai: 'Cho_thanh_toan',
      thoiDiemTao: now,
    };
    onConfirmSeats(order);
    onNavigate('confirmOrder');
  };

  const isVip = (row) => VIP_ROWS.includes(row);

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => onNavigate('chooseShowtime')} className="text-gray-400 hover:text-white transition">← Quay lại</button>
          <h2 className="text-xl font-bold text-yellow-400">💺 Chọn ghế</h2>
        </div>

        {/* Movie + showtime mini info */}
        <div className="bg-gray-800 rounded-xl p-4 mb-5 border border-gray-700 text-sm">
          <p className="text-white font-semibold">{selectedMovie.ten}</p>
          <p className="text-gray-400 mt-0.5">📅 {selectedShowtime.ngay} · 🕐 {selectedShowtime.gioBD}–{selectedShowtime.gioKT} · 🏛 {selectedShowtime.phong}</p>
        </div>

        {/* Screen label */}
        <div className="text-center mb-4">
          <div className="inline-block bg-gray-600 text-gray-300 text-xs px-10 py-1.5 rounded-t-none rounded-b-lg tracking-widest">
            MÀN HÌNH
          </div>
        </div>

        {/* Seat grid */}
        <div className="bg-gray-800 rounded-xl p-4 overflow-x-auto">
          <div className="inline-block min-w-full">
            {ROWS.map(row => (
              <div key={row} className="flex items-center gap-1.5 mb-1.5">
                <span className={`w-5 text-xs font-bold flex-shrink-0 ${isVip(row) ? 'text-yellow-400' : 'text-gray-500'}`}>{row}</span>
                {COLS.map(col => (
                  <button
                    key={col}
                    onClick={() => toggleSeat(row, col)}
                    disabled={getStatus(row, col) === 'da_ban' || getStatus(row, col) === 'tam_giu'}
                    className={`w-9 h-8 rounded text-xs font-semibold text-white transition-all ${getSeatColor(row, col)}`}
                    title={`${row}${col}${isVip(row) ? ' (VIP)' : ''}`}
                  >
                    {col}
                  </button>
                ))}
                {isVip(row) && <span className="text-yellow-400 text-xs ml-1 flex-shrink-0">VIP</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center text-xs text-gray-400">
          <LegendItem color="bg-blue-700" label="Trống" />
          <LegendItem color="bg-green-500" label="Đang chọn" />
          <LegendItem color="bg-yellow-500" label="Tạm giữ" />
          <LegendItem color="bg-gray-600" label="Đã bán" />
          <LegendItem color="bg-transparent border border-yellow-400 text-yellow-400" label="VIP hàng E-F (+20.000đ)" />
        </div>

        {/* Selected seats summary */}
        {selectedSeats.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-4 mt-4 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Ghế đã chọn ({selectedSeats.length}):</p>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map(s => {
                const isV = VIP_ROWS.includes(s[0]);
                const price = selectedShowtime.giaVeCoBan + (isV ? VIP_SURCHARGE : 0);
                return (
                  <span key={s} className={`text-xs px-2.5 py-1 rounded-full font-semibold ${isV ? 'bg-yellow-900/60 text-yellow-300' : 'bg-blue-900/60 text-blue-300'}`}>
                    {s} · {formatCurrency(price)}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={selectedSeats.length === 0}
          className="mt-4 w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-xl transition"
        >
          {selectedSeats.length === 0 ? 'Chưa chọn ghế' : `Xác nhận ${selectedSeats.length} ghế →`}
        </button>
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-4 h-4 rounded ${color}`}></div>
      <span>{label}</span>
    </div>
  );
}
