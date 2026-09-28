import React, { useState } from 'react';
import { X, Check, Sparkles, Plus } from 'lucide-react';
import { Subject, GradeLevel } from '../../types';
import { useApp } from '../../context/AppContext';

interface ExamCreateModalProps {
  onClose: () => void;
}

const SUBJECTS: Subject[] = [
  'Tin học', 
  'Công nghệ'
];

export const ExamCreateModal: React.FC<ExamCreateModalProps> = ({ onClose }) => {
  const { questions, addExam } = useApp();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState(`THQH-${Date.now().toString().slice(-4)}`);
  const [subject, setSubject] = useState<Subject>('Tin học');
  const [grade, setGrade] = useState<GradeLevel>(5);
  const [durationMinutes, setDurationMinutes] = useState(40);
  const [academicTerm, setAcademicTerm] = useState<'Học kỳ I' | 'Học kỳ II' | 'Giữa kỳ I' | 'Giữa kỳ II'>('Giữa kỳ II');
  const [schoolYear, setSchoolYear] = useState('2025 - 2026');
  const [instructions, setInstructions] = useState('Đọc kỹ đề bài, chọn đáp án đúng nhất. Thời gian làm bài tính từ khi mở đề.');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  // Filter available questions by subject & grade
  const availableQuestions = questions.filter(
    q => q.subject === subject && q.grade === grade
  );

  const handleToggleQuestion = (id: string) => {
    setSelectedQuestionIds(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const handleAutoSelectQuestions = () => {
    const ids = availableQuestions.map(q => q.id);
    setSelectedQuestionIds(ids);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addExam({
      code,
      title: title.trim(),
      subject,
      grade,
      academicTerm,
      schoolYear,
      durationMinutes,
      totalPoints: 10,
      questionIds: selectedQuestionIds.length > 0 ? selectedQuestionIds : availableQuestions.slice(0, 3).map(q => q.id),
      status: 'ongoing',
      instructions: instructions.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-300" />
            <h2 className="text-base font-bold text-white">Tạo Đề Kiểm Tra Mới</h2>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Tiêu đề bài kiểm tra <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="VD: Kiểm tra định kỳ Giữa kỳ II môn Toán Khối 5"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mã đề thi</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Thời gian (phút)</label>
              <input
                type="number"
                min={5}
                max={120}
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Học kỳ</label>
              <select
                value={academicTerm}
                onChange={e => setAcademicTerm(e.target.value as any)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs"
              >
                <option value="Học kỳ I">Học kỳ I</option>
                <option value="Giữa kỳ I">Giữa kỳ I</option>
                <option value="Giữa kỳ II">Giữa kỳ II</option>
                <option value="Học kỳ II">Học kỳ II</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Hướng dẫn làm bài</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs resize-none"
            />
          </div>

          {/* Question Selection Area */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
              <div>
                <span className="font-bold text-slate-800">
                  Chọn câu hỏi ({selectedQuestionIds.length} câu đã chọn)
                </span>
                <p className="text-[11px] text-slate-500">
                  Lọc theo: Môn {subject} · Khối {grade} ({availableQuestions.length} câu trong ngân hàng)
                </p>
              </div>

              <button
                type="button"
                onClick={handleAutoSelectQuestions}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-md text-[11px] font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Chọn tất cả ({availableQuestions.length})
              </button>
            </div>

            {availableQuestions.length === 0 ? (
              <div className="py-6 text-center text-slate-400">
                Chưa có câu hỏi môn {subject} Khối {grade} trong ngân hàng. Hệ thống sẽ cho phép bạn thêm câu hỏi sau.
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {availableQuestions.map(q => {
                  const isChecked = selectedQuestionIds.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      onClick={() => handleToggleQuestion(q.id)}
                      className={`p-2.5 rounded-lg border flex items-start gap-2.5 cursor-pointer transition-colors ${
                        isChecked 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                        isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-0.5">
                          <span className="font-mono font-bold text-emerald-800">{q.code}</span>
                          <span>·</span>
                          <span>{q.topic}</span>
                        </div>
                        <p className="line-clamp-2 text-xs">{q.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-all"
            >
              Lưu & Phát hành đề thi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
