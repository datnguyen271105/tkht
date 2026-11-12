import { useState } from 'react';
import { MOVIES } from '../mock';

export default function SearchMovieScreen({ onNavigate, onSelectMovie }) {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    setSearched(true);
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults(MOVIES);
      return;
    }
    setResults(MOVIES.filter(m => m.ten.toLowerCase().includes(q) || m.theLoai.toLowerCase().includes(q)));
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('main')} className="text-gray-400 hover:text-white transition">← Quay lại</button>
          <h2 className="text-xl font-bold text-yellow-400">🎬 Chọn phim</h2>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tên phim hoặc thể loại..."
            className="flex-1 bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-yellow-400 outline-none transition"
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-xl transition"
          >
            Tìm
          </button>
        </div>

        {!searched && (
          <div className="text-center text-gray-500 mt-12">
            <div className="text-5xl mb-3">🔍</div>
            <p>Nhập tên phim để tìm kiếm, hoặc bấm Tìm để xem tất cả</p>
          </div>
        )}

        {searched && results.length === 0 && (
          <div className="text-center text-gray-400 mt-12">
            <div className="text-5xl mb-3">😔</div>
            <p className="text-lg">Không tìm thấy phim nào phù hợp.</p>
            <p className="text-sm text-gray-500 mt-1">Thử tìm với từ khóa khác</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map(movie => (
              <button
                key={movie.id}
                onClick={() => { onSelectMovie(movie); onNavigate('chooseShowtime'); }}
                className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-yellow-500 rounded-xl p-4 text-left transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold text-base">{movie.ten}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{movie.theLoai}</p>
                  </div>
                  <div className="text-right ml-4">
                    <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                      ⏱ {movie.thoiLuong} phút
                    </span>
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
