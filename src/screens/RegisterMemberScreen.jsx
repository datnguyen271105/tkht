import { useState } from 'react';
import { MEMBERS, genMemberCode, formatDate } from '../mock';

function validate(form) {
  const errors = {};
  if (!form.hoTen.trim()) errors.hoTen = 'Vui lòng nhập họ tên.';
  if (!form.ngaySinh) {
    errors.ngaySinh = 'Vui lòng nhập ngày sinh.';
  } else if (new Date(form.ngaySinh) >= new Date()) {
    errors.ngaySinh = 'Ngày sinh không được ở tương lai.';
  }
  if (!form.diaChi.trim()) errors.diaChi = 'Vui lòng nhập địa chỉ.';
  if (!form.sdt.trim()) {
    errors.sdt = 'Vui lòng nhập số điện thoại.';
  } else if (!/^0\d{9}$/.test(form.sdt.trim())) {
    errors.sdt = 'SĐT phải 10 số và bắt đầu bằng 0.';
  }
  if (!form.email.trim()) {
    errors.email = 'Vui lòng nhập email.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Email không đúng định dạng.';
  }
  return errors;
}

export default function RegisterMemberScreen({ onNavigate, members, onMemberAdded }) {
  const [form, setForm] = useState({ hoTen: '', ngaySinh: '', diaChi: '', sdt: '', email: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
  };

  const handleSubmit = () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const allMembers = [...MEMBERS, ...members];
    if (allMembers.find(m => m.sdt === form.sdt.trim())) {
      setServerError('Trùng số điện thoại. SĐT này đã được đăng ký.');
      return;
    }
    if (allMembers.find(m => m.email.toLowerCase() === form.email.trim().toLowerCase())) {
      setServerError('Trùng email. Email này đã được đăng ký.');
      return;
    }

    const id = genMemberCode();
    const today = new Date().toISOString().split('T')[0];
    const newMember = {
      id,
      hoTen: form.hoTen.trim(),
      ngaySinh: form.ngaySinh,
      diaChi: form.diaChi.trim(),
      sdt: form.sdt.trim(),
      email: form.email.trim(),
      hang: 'Đồng',
      trangThai: 'Có hiệu lực',
      giamGia: 5,
      ngayCap: today,
    };
    onMemberAdded(newMember);
    setResult(newMember);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-xl text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Đăng ký thành công!</h2>
          <div className="bg-gray-700 rounded-xl p-5 text-left space-y-3 mt-4">
            <Row label="Mã thẻ" value={<span className="text-yellow-300 font-bold text-lg">{result.id}</span>} />
            <Row label="Họ tên" value={result.hoTen} />
            <Row label="Hạng thẻ" value={<span className="text-orange-400 font-semibold">{result.hang}</span>} />
            <Row label="Trạng thái" value={<span className="text-green-400 font-semibold">{result.trangThai}</span>} />
            <Row label="Ưu đãi" value={`Giảm ${result.giamGia}% mỗi lần mua vé`} />
            <Row label="Ngày cấp" value={formatDate(result.ngayCap)} />
          </div>
          <button
            onClick={() => onNavigate('main')}
            className="mt-6 w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl transition"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('main')} className="text-gray-400 hover:text-white transition">← Quay lại</button>
          <h2 className="text-xl font-bold text-yellow-400">Đăng ký thành viên</h2>
        </div>

        {serverError && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 rounded-lg p-3 mb-4 text-sm">
            ⚠️ {serverError}
          </div>
        )}

        <div className="space-y-4">
          <Field label="Họ tên *" error={errors.hoTen}>
            <input name="hoTen" value={form.hoTen} onChange={handleChange} placeholder="Nguyễn Văn A" className={input(errors.hoTen)} />
          </Field>
          <Field label="Ngày sinh *" error={errors.ngaySinh}>
            <input type="date" name="ngaySinh" value={form.ngaySinh} onChange={handleChange} className={input(errors.ngaySinh)} />
          </Field>
          <Field label="Địa chỉ *" error={errors.diaChi}>
            <input name="diaChi" value={form.diaChi} onChange={handleChange} placeholder="123 Đường ABC, Quận 1" className={input(errors.diaChi)} />
          </Field>
          <Field label="Số điện thoại *" error={errors.sdt}>
            <input name="sdt" value={form.sdt} onChange={handleChange} placeholder="0912345678" className={input(errors.sdt)} />
          </Field>
          <Field label="Email *" error={errors.email}>
            <input name="email" value={form.email} onChange={handleChange} placeholder="example@email.com" className={input(errors.email)} />
          </Field>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl transition"
        >
          Xác nhận đăng ký
        </button>
      </div>
    </div>
  );
}

function input(err) {
  return `w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 border outline-none focus:border-yellow-400 transition ${err ? 'border-red-500' : 'border-gray-600'}`;
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-gray-300 text-sm mb-1 block">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white text-sm font-medium">{value}</span>
    </div>
  );
}
