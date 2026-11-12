import { useState, useEffect, useCallback } from 'react';
import { VIP_ROWS, VIP_SURCHARGE, MEMBER_CARDS, formatCurrency, formatDate } from '../mock';

const TIMEOUT_SECONDS = 600; // 10 minutes

export default function ConfirmOrderScreen({ onNavigate, currentOrder, onUpdateOrder, onCancelOrder }) {
  const [cardInput, setCardInput] = useState('');
  const [appliedCard, setAppliedCard] = useState(null);
  const [cardError, setCardError] = useState('');
  const [discount, setDiscount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_SECONDS);
  const [expired, setExpired] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) { setExpired(true); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  useEffect(() => {
    if (expired) {
      onCancelOrder();
      setTimeout(() => onNavigate('main'), 2000);
    }
  }, [expired]);

  if (!currentOrder) { onNavigate('main'); return null; }

  const { phim, suat, ghes } = currentOrder;

  const computePrice = (seat) => {
    const isVip = VIP_ROWS.includes(seat[0]);
    return suat.giaVeCoBan + (isVip ? VIP_SURCHARGE : 0);
  };

  const totalBefore = ghes.reduce((sum, s) => sum + computePrice(s), 0);
  const discountAmount = Math.round(totalBefore * discount / 100);
  const totalAfter = totalBefore - discountAmount;

  const handleApplyCard = () => {
    setCardError('');
    const code = cardInput.trim().toUpperCase();
    if (!code) { setCardError('Vui lòng nhập mã thẻ.'); return; }
    const card = MEMBER_CARDS[code];
    if (!card) {
      setCardError('Thẻ không tồn tại. Tiếp tục không được giảm giá.');
      setDiscount(0);
      setAppliedCard(null);
      return;
    }
    if (!card.valid) {
      setCardError(`Thẻ ${code} đã hết hiệu lực. Tiếp tục không được giảm giá.`);
      setDiscount(0);
      setAppliedCard(null);
      return;
    }
    setAppliedCard({ code, ...card });
    setDiscount(card.discount);
    setCardError('');
  };

  const handleConfirm = () => {
    onUpdateOrder({ ...currentOrder, discount, totalAfter, appliedCard });
    onNavigate('payment');
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

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCancelConfirm(true)} className="text-gray-400 hover:text-white transition">← Quay lại</button>
            <h2 className="text-xl font-bold text-yellow-400">📋 Xác nhận đơn</h2>
          </div>
          <div className={`font-mono font-bold text-lg ${timerColor}`}>⏱ {mm}:{ss}</div>
        </div>

        {/* Order info */}
        <div className="bg-gray-800 rounded-xl p-5 mb-4 border border-gray-700 space-y-2">
          <InfoRow label="Phim" value={<span className="text-white font-semibold">{phim.ten}</span>} />
          <InfoRow label="Suất chiếu" value={`${formatDate(suat.ngay)} · ${suat.gioBD}–${suat.gioKT}`} />
          <InfoRow label="Phòng" value={suat.phong} />
          <InfoRow label="Mã đơn" value={<span className="text-yellow-300 font-mono font-bold">{currentOrder.id}</span>} />
        </div>

        {/* Seats */}
        <div className="bg-gray-800 rounded-xl p-5 mb-4 border border-gray-700">
          <p className="text-gray-400 text-sm font-semibold mb-3">Danh sách ghế</p>
          <div className="space-y-2">
            {ghes.map(seat => {
              const isVip = VIP_ROWS.includes(seat[0]);
              const price = computePrice(seat);
              return (
                <div key={seat} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono font-semibold">{seat}</span>
                    {isVip && <span className="text-xs bg-yellow-900/60 text-yellow-300 px-1.5 py-0.5 rounded">VIP</span>}
                  </div>
                  <div className="text-right text-sm text-gray-300">
                    {isVip ? (
                      <span className="text-xs text-gray-500 mr-2">{formatCurrency(suat.giaVeCoBan)} + {formatCurrency(VIP_SURCHARGE)}</span>
                    ) : null}
                    <span className="text-white font-semibold">{formatCurrency(price)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card input */}
        <div className="bg-gray-800 rounded-xl p-5 mb-4 border border-gray-700">
          <p className="text-gray-400 text-sm font-semibold mb-3">Áp dụng thẻ thành viên</p>
          <div className="flex gap-2">
            <input
              value={cardInput}
              onChange={e => { setCardInput(e.target.value); setCardError(''); }}
              placeholder="Nhập mã thẻ (vd: CM0001)"
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2.5 border border-gray-600 focus:border-yellow-400 outline-none transition text-sm"
            />
            <button
              onClick={handleApplyCard}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-lg transition text-sm"
            >
              Áp dụng
            </button>
          </div>
          {cardError && <p className="text-red-400 text-xs mt-2">⚠️ {cardError}</p>}
          {appliedCard && (
            <div className="mt-2 bg-green-900/30 border border-green-700 rounded-lg p-2.5 text-sm">
              <p className="text-green-400 font-semibold">✅ Thẻ {appliedCard.code} – {appliedCard.hoTen}</p>
              <p className="text-green-300 text-xs">Hạng {appliedCard.hang} · Giảm {appliedCard.discount}%</p>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="bg-gray-800 rounded-xl p-5 mb-5 border border-gray-700 space-y-2">
          <InfoRow label="Tổng trước giảm" value={formatCurrency(totalBefore)} />
          <InfoRow
            label={`Giảm giá (${discount}%)`}
            value={<span className="text-green-400">– {formatCurrency(discountAmount)}</span>}
          />
          <div className="border-t border-gray-600 pt-2 mt-2">
            <InfoRow
              label={<span className="text-white font-bold text-base">Tổng phải trả</span>}
              value={<span className="text-yellow-300 font-bold text-xl">{formatCurrency(totalAfter)}</span>}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition"
          >
            Hủy đơn
          </button>
          <button
            onClick={handleConfirm}
            className="flex-2 flex-[2] bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl transition"
          >
            Xác nhận đơn →
          </button>
        </div>
      </div>

      {/* Cancel modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="text-4xl mb-3">❓</div>
            <h3 className="text-white font-bold text-lg mb-2">Hủy đơn hàng?</h3>
            <p className="text-gray-400 text-sm mb-5">Ghế đã chọn sẽ được giải phóng và bạn sẽ về màn hình chính.</p>
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
