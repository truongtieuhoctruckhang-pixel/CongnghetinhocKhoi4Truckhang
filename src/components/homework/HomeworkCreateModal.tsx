import React, { useState } from 'react';
import { X, Plus, Calendar, BookOpen } from 'lucide-react';
import { Subject, GradeLevel } from '../../types';
import { useApp } from '../../context/AppContext';

interface HomeworkCreateModalProps {
  onClose: () => void;
}

const SUBJECTS: Subject[] = [
  'Tin học',
  'Công nghệ'
];

export const HomeworkCreateModal: React.FC<HomeworkCreateModalProps> = ({ onClose }) => {
  const { addHomework } = useApp();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState(`BTVN-${Date.now().toString().slice(-4)}`);
  const [subject, setSubject] = useState<Subject>('Tin học');
  const [grade, setGrade] = useState<GradeLevel>(4);
  const [targetClass, setTargetClass] = useState('4C');
  const [deadline, setDeadline] = useState('2026-03-30 20:00');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addHomework({
      code,
      title: title.trim(),
      subject,
      grade,
      targetClass,
      assignedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      deadline,
      description: description.trim() || 'Học sinh hoàn thành bài tập theo hướng dẫn và nộp trước hạn.',
      status: 'active',
      maxScore: 10
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-300" />
            <h2 className="text-base font-bold text-white">Giao Bài Tập Về Nhà Mới</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tiêu đề bài tập <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="VD: Bài tập tự rèn: Ôn tập phép nhân và chia số thập phân"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Môn học</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value as Subject)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-hidden focus:border-emerald-600"
              >
                {SUBJECTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Khối lớp</label>
              <select
                value={grade}
                onChange={e => setGrade(Number(e.target.value) as GradeLevel)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-hidden focus:border-emerald-600"
              >
                {[1, 2, 3, 4, 5].map(g => (
                  <option key={g} value={g}>Khối {g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lớp được giao</label>
              <select
                value={targetClass}
                onChange={e => setTargetClass(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-hidden focus:border-emerald-600 font-semibold"
              >
                <option value="5A">Lớp 5A</option>
                <option value="5B">Lớp 5B</option>
                <option value="4A">Lớp 4A</option>
                <option value="3B">Lớp 3B</option>
                <option value="2A">Lớp 2A</option>
                <option value="1A">Lớp 1A</option>
                <option value="Tất cả">Tất cả các lớp</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hạn nộp bài</span>
              </label>
              <input
                type="text"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                placeholder="YYYY-MM-DD HH:mm"
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nội dung yêu cầu & bài tập cần làm
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ghi rõ số trang sách giáo khoa, câu hỏi hoặc yêu cầu viết văn..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs resize-none"
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
              className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-all"
            >
              Phát bài tập cho học sinh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
