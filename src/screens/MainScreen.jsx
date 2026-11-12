export default function MainScreen({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-8 p-6">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-yellow-400 tracking-widest">🎬 CineMan</h1>
        <p className="text-gray-400 mt-2 text-sm">Phần mềm quản lý rạp chiếu phim</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
        <button
          onClick={() => onNavigate('register')}
          className="flex-1 flex flex-col items-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold text-lg py-10 px-6 rounded-2xl shadow-lg transition-all duration-200 hover:scale-105"
        >
          <span className="text-4xl">🪪</span>
          <span>Đăng ký thành viên</span>
        </button>

        <button
          onClick={() => onNavigate('searchMovie')}
          className="flex-1 flex flex-col items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg py-10 px-6 rounded-2xl shadow-lg transition-all duration-200 hover:scale-105"
        >
          <span className="text-4xl">🎟️</span>
          <span>Bán vé</span>
        </button>
      </div>

      <p className="text-gray-600 text-xs mt-8">Nhân viên bán hàng · CineMan v1.0</p>
    </div>
  );
}
