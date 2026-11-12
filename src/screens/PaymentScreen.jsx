import { useState, useEffect } from 'react';
import { genInvoiceCode, formatCurrency } from '../mock';

const TIMEOUT_SECONDS = 600;
const PAYMENT_METHODS = ['Tiền mặt', 'Thẻ ngân hàng', 'Chuyển khoản'];

export default function PaymentScreen({ onNavigate, currentOrder, onPaymentSuccess, onCancelOrder }) {
  const [method, setMethod] = useState('Tiền mặt');
  const [simSuccess, setSimSuccess] = useState(true);
  const [status, setStatus] = useState('idle'); // idle | success | fail
  const [invoice, setInvoice] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_SECONDS);
  const [expired, setExpired] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (status === 'success') return;
    if (timeLeft <= 0) { setExpired(true); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, status]);

  useEffect(() => {
    if (expired) {
      onCancelOrder();
      setTimeout(() => onNavigate('main'), 2000);
    }
  }, [expired]);

  if (!currentOrder) { onNavigate('main'); return null; }

  const totalAfter = currentOrder.totalAfter ?? currentOrder.ghes.reduce((s, seat) => {
    const isVip = ['E', 'F'].includes(seat[0]);
    return s + currentOrder.suat.giaVeCoBan + (isVip ? 20000 : 0);
  }, 0);

  const handlePay = () => {
    if (simSuccess) {
      const invoiceCode = genInvoiceCode();
      const now = new Date();
      const inv = { id: invoiceCode, thoiDiem: now, tongTien: totalAfter };
      setInvoice(inv);
      setStatus('success');
      onPaymentSuccess(currentOrder, inv);
    } else {
      setStatus('fail');
    }
  };

  const handleCancel = () => {
    onCancelOrder();
    onNavigate('main');
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');
  const timerColor = timeLeft <= 60 ? 'text-red-400' : timeLeft <= 180 ? 'text-yellow-400' : 'text-green-400';

  if (expired) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏰</div>
          <p className="text-red-400 text-xl font-bold">Đơn đã hết hạn!</p>
          <p className="text-gray-400 text-sm mt-2">Đang chuyển về màn hình chính...</p>
        </div>
      </div>
    );
  }

  if (status === 'success' && invoice) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-2xl p-6 border border-green-700 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl font-bold text-green-400 mb-1">Thanh toán thành công!</h2>
            <p className="text-gray-400 text-sm mb-6">Trạng thái đơn: <span className="text-green-400 font-semibold">Đã thanh toán</span></p>

            <div className="bg-gray-700/50 rounded-xl p-5 text-left space-y-2 mb-6">
              <InfoRow label="Mã hóa đơn" value={<span className="text-yellow-300 font-mono font-bold">{invoice.id}</span>} />
              <InfoRow label="Mã đơn hàng" value={<span className="text-gray-200 font-mono">{currentOrder.id}</span>} />
              <InfoRow label="Phim" value={currentOrder.phim.ten} />
              <InfoRow label="Suất" value={`${currentOrder.suat.ngay} · ${currentOrder.suat.gioBD}`} />
              <InfoRow label="Phòng" value={currentOrder.suat.phong} />
              <InfoRow label="Ghế" value={currentOrder.ghes.join(', ')} />
              <InfoRow label="Phương thức" value={method} />
              <InfoRow label="Thời điểm lập" value={invoice.thoiDiem.toLocaleString('vi-VN')} />
              <div className="border-t border-gray-600 pt-2 mt-2">
                <InfoRow label={<span className="text-white font-bold">Tổng tiền</span>} value={<span className="text-yellow-300 font-bold text-lg">{formatCurrency(invoice.tongTien)}</span>} />
              </div>
            </div>

            <div className="flex gap-3 mb-3">
              <button
                onClick={() => { alert(`In vé: ${currentOrder.ghes.join(', ')} – ${currentOrder.phim.ten} – ${currentOrder.suat.gioBD}`); window.print(); }}
                className="flex-1 bg-blue-700 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl transition text-sm"
              >
                🖨️ In vé
              </button>
              <button
                onClick={() => { alert(`In hóa đơn: ${invoice.id} – Tổng: ${formatCurrency(invoice.tongTien)}`); window.print(); }}
                className="flex-1 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition text-sm"
              >
                🧾 In hóa đơn
              </button>
            </div>
            <button
              onClick={() => onNavigate('main')}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl transition"
            >
              Hoàn tất
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      {/* Sim toggle */}
      <div className="fixed top-3 right-3 z-50 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 flex items-center gap-2 text-xs shadow-lg">
        <span className="text-gray-400">Giả lập:</span>
        <button
          onClick={() => setSimSuccess(true)}
          className={`px-2 py-0.5 rounded-full font-semibold transition ${simSuccess ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}
        >Thành công</button>
        <button
          onClick={() => setSimSuccess(false)}
          className={`px-2 py-0.5 rounded-full font-semibold transition ${!simSuccess ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400'}`}
        >Thất bại</button>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('confirmOrder')} className="text-gray-400 hover:text-white transition">← Quay lại</button>
            <h2 className="text-xl font-bold text-yellow-400">💳 Thanh toán</h2>
          </div>
          <div className={`font-mono font-bold text-lg ${timerColor}`}>⏱ {mm}:{ss}</div>
        </div>

        {/* Order summary */}
        <div className="bg-gray-800 rounded-xl p-5 mb-4 border border-gray-700 space-y-2">
          <InfoRow label="Mã đơn" value={<span className="text-yellow-300 font-mono font-bold">{currentOrder.id}</span>} />
          <InfoRow label="Phim" value={currentOrder.phim.ten} />
          <InfoRow label="Suất" value={`${currentOrder.suat.ngay} · ${currentOrder.suat.gioBD}–${currentOrder.suat.gioKT}`} />
          <InfoRow label="Phòng" value={currentOrder.suat.phong} />
          <InfoRow label="Ghế" value={currentOrder.ghes.join(', ')} />
          {currentOrder.appliedCard && (
            <InfoRow label="Thẻ ưu đãi" value={<span className="text-green-400">{currentOrder.appliedCard.code} (–{currentOrder.discount}%)</span>} />
          )}
          <div className="border-t border-gray-600 pt-2">
            <InfoRow
              label={<span className="text-white font-bold text-base">Tổng phải trả</span>}
              value={<span className="text-yellow-300 font-bold text-xl">{formatCurrency(totalAfter)}</span>}
            />
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-gray-800 rounded-xl p-5 mb-4 border border-gray-700">
          <p className="text-gray-400 text-sm font-semibold mb-3">Phương thức thanh toán</p>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map(m => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`flex-1 min-w-[100px] py-2.5 rounded-xl font-semibold text-sm transition ${method === m ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                {m === 'Tiền mặt' ? '💵' : m === 'Thẻ ngân hàng' ? '💳' : '📲'} {m}
              </button>
            ))}
          </div>
        </div>

        {/* Fail status */}
        {status === 'fail' && (
          <div className="bg-red-900/40 border border-red-600 rounded-xl p-4 mb-4 text-center">
            <p className="text-red-400 font-bold text-base">❌ Thanh toán thất bại!</p>
            <p className="text-gray-400 text-sm mt-1">Đơn hàng vẫn ở trạng thái <span className="text-yellow-300">Chờ thanh toán</span>.</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition"
          >
            Hủy đơn
          </button>
          {status === 'fail' ? (
            <button
              onClick={handlePay}
              className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition"
            >
              Thanh toán lại
            </button>
          ) : (
            <button
              onClick={handlePay}
              className="flex-[2] bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl transition"
            >
              Xác nhận thanh toán
            </button>
          )}
        </div>
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="text-4xl mb-3">❓</div>
            <h3 className="text-white font-bold text-lg mb-2">Hủy đơn hàng?</h3>
            <p className="text-gray-400 text-sm mb-5">Ghế đã chọn sẽ được giải phóng.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelConfirm(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-xl transition">
                Không
              </button>
              <button onClick={handleCancel} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl transition">
                Hủy đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-gray-200 text-sm">{value}</span>
    </div>
  );
}
