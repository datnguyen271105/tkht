import { SHOWTIMES, formatDate, formatCurrency } from '../mock';

export default function ChooseShowtimeScreen({ onNavigate, selectedMovie, onSelectShowtime }) {
  if (!selectedMovie) {
    onNavigate('searchMovie');
    return null;
  }

  const showtimes = SHOWTIMES.filter(s => s.phimId === selectedMovie.id);

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('searchMovie')} className="text-gray-400 hover:text-white transition">← Quay lại</button>
          <h2 className="text-xl font-bold text-yellow-400">🕐 Chọn suất chiếu</h2>
        </div>

        {/* Movie info */}
        <div className="bg-gray-800 rounded-xl p-5 mb-6 border border-gray-700">
          <h3 className="text-white font-bold text-lg">{selectedMovie.ten}</h3>
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="text-gray-400 text-sm">🎭 {selectedMovie.theLoai}</span>
            <span className="text-gray-400 text-sm">⏱ {selectedMovie.thoiLuong} phút</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">{selectedMovie.moTa}</p>
        </div>

        {showtimes.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-lg">Phim này hiện chưa có suất chiếu.</p>
            <button
              onClick={() => onNavigate('searchMovie')}
              className="mt-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-2.5 rounded-xl transition"
            >
              Chọn phim khác
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {showtimes.map(st => (
              <button
                key={st.id}
                onClick={() => { onSelectShowtime(st); onNavigate('chooseSeat'); }}
                className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-yellow-500 rounded-xl p-4 text-left transition-all"
              >
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <p className="text-white font-semibold">{formatDate(st.ngay)}</p>
                    <p className="text-gray-400 text-sm mt-0.5">
                      🕐 {st.gioBD} – {st.gioKT} · 🏛 {st.phong}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-300 font-bold text-base">{formatCurrency(st.giaVeCoBan)}</p>
                    <p className="text-gray-500 text-xs">/ vé cơ bản</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
