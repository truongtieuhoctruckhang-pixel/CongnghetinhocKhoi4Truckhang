import React, { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { Subject, GradeLevel } from '../../types';
import { useApp } from '../../context/AppContext';

interface AutoExamFromBankModalProps {
  onClose: () => void;
}

export const AutoExamFromBankModal: React.FC<AutoExamFromBankModalProps> = ({ onClose }) => {
  const { questions, addExam, setActiveTab, showToast } = useApp();

  const [subject, setSubject] = useState<Subject>('Tin học');
  const [grade, setGrade] = useState<GradeLevel>(4);
  const [title, setTitle] = useState('Đề Kiểm Tra Tổng Hợp Tự Động - EduPlay');
  const [durationMinutes, setDurationMinutes] = useState(35);
  const [countEasy, setCountEasy] = useState(2);
  const [countMedium, setCountMedium] = useState(2);
  const [countHard, setCountHard] = useState(1);

  // Available questions pool
  const pool = questions.filter(q => q.subject === subject && q.grade === grade);
  const easyPool = pool.filter(q => q.difficulty === 'easy');
  const mediumPool = pool.filter(q => q.difficulty === 'medium');
  const hardPool = pool.filter(q => q.difficulty === 'hard' || q.difficulty === 'expert');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    // Pick questions
    const pickedEasy = easyPool.slice(0, countEasy).map(q => q.id);
    const pickedMedium = mediumPool.slice(0, countMedium).map(q => q.id);
    const pickedHard = hardPool.slice(0, countHard).map(q => q.id);

    let allPicked = [...pickedEasy, ...pickedMedium, ...pickedHard];

    // Fallback if not enough matching matrix
    if (allPicked.length === 0) {
      allPicked = pool.slice(0, 4).map(q => q.id);
    }

    if (allPicked.length === 0) {
      showToast(`Không đủ câu hỏi môn ${subject} khối ${grade} trong ngân hàng để lập ma trận!`, 'warning');
      return;
    }

    addExam({
      code: `AUTO-${Date.now().toString().slice(-4)}`,
      title: title.trim() || `Đề Ma Trận Chuẩn Môn ${subject} Khối ${grade}`,
      subject,
      grade,
      academicTerm: 'Học kỳ II',
      schoolYear: '2025 - 2026',
      durationMinutes,
      totalPoints: 10,
      questionIds: allPicked,
      status: 'ongoing',
      instructions: 'Đề thi được khởi tạo tự động theo ma trận 4 mức độ nhận thức của Bộ Giáo dục & Đào tạo.'
    });

    onClose();
    setActiveTab('exams');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-300" />
            <h2 className="text-base font-bold text-white">Tạo Đề Thi Tự Động Theo Ma Trận</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tên đề kiểm tra
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Môn học</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value as Subject)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="Tin học">Tin học</option>
                <option value="Công nghệ">Công nghệ</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Khối lớp</label>
              <select
                value={grade}
                onChange={e => setGrade(Number(e.target.value) as GradeLevel)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                {[1, 2, 3, 4, 5].map(g => (
                  <option key={g} value={g}>Khối {g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Thời gian (phút)</label>
              <input
                type="number"
                min={10}
                max={90}
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>

          {/* Matrix Controls */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-emerald-200 text-xs font-bold text-emerald-950">
              <span>Cấu Hình Ma Trận Độ Khó</span>
              <span className="font-mono">Kho hiện có: {pool.length} câu</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Nhận biết (Có {easyPool.length})
                </span>
                <input
                  type="number"
                  min={0}
                  max={easyPool.length || 10}
                  value={countEasy}
                  onChange={e => setCountEasy(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-200 rounded text-center font-bold text-xs"
                />
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Thông hiểu (Có {mediumPool.length})
                </span>
                <input
                  type="number"
                  min={0}
                  max={mediumPool.length || 10}
                  value={countMedium}
                  onChange={e => setCountMedium(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-200 rounded text-center font-bold text-xs"
                />
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Vận dụng (Có {hardPool.length})
                </span>
                <input
                  type="number"
                  min={0}
                  max={hardPool.length || 10}
                  value={countHard}
                  onChange={e => setCountHard(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-200 rounded text-center font-bold text-xs"
                />
              </div>
            </div>

            <p className="text-[11px] text-emerald-900 leading-snug">
              Hệ thống sẽ tự động bốc ngẫu nhiên các câu hỏi đạt chuẩn từ ngân hàng câu hỏi để thành lập đề thi mới.
            </p>
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
              <Check className="w-4 h-4" />
              Tạo đề & chuyển sang mục Đề thi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
