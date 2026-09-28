import React, { useState } from 'react';
import { X, UserPlus, Save } from 'lucide-react';
import { Student } from '../../types';
import { useApp } from '../../context/AppContext';

interface StudentModalProps {
  student?: Student | null;
  onClose: () => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({ student, onClose }) => {
  const { addStudent, updateStudent } = useApp();

  const isEdit = Boolean(student);

  const [code, setCode] = useState(student?.code || `THQK-${Date.now().toString().slice(-4)}`);
  const [fullName, setFullName] = useState(student?.fullName || '');
  const [studentClass, setStudentClass] = useState(student?.class || '5A');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>(student?.gender || 'Nam');
  const [dob, setDob] = useState(student?.dob || '2014-05-10');
  const [parentName, setParentName] = useState(student?.parentName || '');
  const [parentPhone, setParentPhone] = useState(student?.parentPhone || '');
  const [address, setAddress] = useState(student?.address || 'Xã Trực Khang, Huyện Trực Ninh, Nam Định');
  const [conduct, setConduct] = useState<'Hoàn thành xuất sắc' | 'Hoàn thành tốt' | 'Hoàn thành'>(
    (student?.conduct as any) || 'Hoàn thành tốt'
  );
  const [avgScore, setAvgScore] = useState<number>(student?.avgScore ?? 8.5);
  const [notes, setNotes] = useState(student?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    if (isEdit && student) {
      updateStudent(student.id, {
        code,
        fullName: fullName.trim(),
        class: studentClass,
        gender,
        dob,
        parentName: parentName.trim(),
        parentPhone: parentPhone.trim(),
        address: address.trim(),
        conduct,
        avgScore,
        notes: notes.trim()
      });
    } else {
      addStudent({
        code,
        fullName: fullName.trim(),
        class: studentClass,
        gender,
        dob,
        parentName: parentName.trim() || 'Phụ huynh học sinh',
        parentPhone: parentPhone.trim() || '0912 000 000',
        address: address.trim(),
        avgScore,
        completionRate: 95,
        conduct,
        avatarSeed: fullName.replace(/\s+/g, ''),
        notes: notes.trim()
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-300" />
            <h2 className="text-base font-bold text-white">
              {isEdit ? 'Chỉnh Sửa Hồ Sơ Học Sinh' : 'Thêm Học Sinh Mới'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Họ và tên học sinh <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="VD: Nguyễn Văn An"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white text-xs font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mã học sinh</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lớp học</label>
              <select
                value={studentClass}
                onChange={e => setStudentClass(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold focus:outline-hidden focus:border-emerald-600"
              >
                <option value="5A">Lớp 5A</option>
                <option value="5B">Lớp 5B</option>
                <option value="4A">Lớp 4A</option>
                <option value="3B">Lớp 3B</option>
                <option value="2A">Lớp 2A</option>
                <option value="1A">Lớp 1A</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Giới tính</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ngày sinh</label>
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Họ tên phụ huynh</label>
              <input
                type="text"
                value={parentName}
                onChange={e => setParentName(e.target.value)}
                placeholder="VD: Nguyễn Văn Ba"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">SĐT liên hệ</label>
              <input
                type="text"
                value={parentPhone}
                onChange={e => setParentPhone(e.target.value)}
                placeholder="0912 xxx xxx"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Địa chỉ cư trú</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Điểm TB tích lũy</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={avgScore}
                onChange={e => setAvgScore(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Đánh giá rèn luyện</label>
              <select
                value={conduct}
                onChange={e => setConduct(e.target.value as any)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="Hoàn thành xuất sắc">Hoàn thành xuất sắc</option>
                <option value="Hoàn thành tốt">Hoàn thành tốt</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ghi chú của giáo viên chủ nhiệm</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Đặc điểm học tập, năng khiếu, lưu ý sức khỏe..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Cập nhật hồ sơ' : 'Lưu học sinh vào lớp'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
