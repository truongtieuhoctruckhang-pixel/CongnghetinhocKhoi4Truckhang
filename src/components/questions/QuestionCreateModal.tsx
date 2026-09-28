import React, { useState } from 'react';
import { X, Plus, HelpCircle } from 'lucide-react';
import { Subject, GradeLevel, DifficultyLevel } from '../../types';
import { useApp } from '../../context/AppContext';

interface QuestionCreateModalProps {
  onClose: () => void;
}

const SUBJECTS: Subject[] = [
  'Tin học',
  'Công nghệ'
];

export const QuestionCreateModal: React.FC<QuestionCreateModalProps> = ({ onClose }) => {
  const { addQuestion } = useApp();

  const [subject, setSubject] = useState<Subject>('Tin học');
  const [grade, setGrade] = useState<GradeLevel>(5);
  const [code, setCode] = useState(`CH-${Date.now().toString().slice(-4)}`);
  const [topic, setTopic] = useState('Số học & Phép tính');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [content, setContent] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [explanation, setExplanation] = useState('');

  const handleOptionChange = (idx: number, val: string) => {
    setOptions(prev => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addQuestion({
      code,
      subject,
      grade,
      topic: topic.trim() || 'Kiến thức trọng tâm',
      difficulty,
      type: 'multiple_choice',
      content: content.trim(),
      options: options.map(o => o.trim() || `Lựa chọn mẫu`),
      correctAnswer,
      explanation: explanation.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-300" />
            <h2 className="text-base font-bold text-white">Soạn Câu Hỏi Trắc Nghiệm Mới</h2>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Môn học</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value as Subject)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-emerald-600"
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
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-emerald-600"
              >
                {[1, 2, 3, 4, 5].map(g => (
                  <option key={g} value={g}>Khối {g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mức độ nhận thức</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-emerald-600"
              >
                <option value="easy">Nhận biết (Mức 1)</option>
                <option value="medium">Thông hiểu (Mức 2)</option>
                <option value="hard">Vận dụng (Mức 3)</option>
                <option value="expert">Vận dụng cao (Mức 4)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mã câu hỏi</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Chủ đề / Bài học</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="VD: Phép nhân và chia phân số, Từ đồng nghĩa..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nội dung câu hỏi <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Nhập nội dung câu hỏi trắc nghiệm..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 resize-none"
            />
          </div>

          {/* 4 Options */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200">
            <label className="block font-bold text-slate-800">
              Các phương án trả lời (Tích chọn đáp án đúng):
            </label>

            {options.map((opt, idx) => {
              const label = String.fromCharCode(65 + idx);
              const isCorrect = correctAnswer === idx;
              return (
                <div key={idx} className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCorrectAnswer(idx)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border transition-all ${
                      isCorrect 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
                    }`}
                    title="Chọn làm đáp án đúng"
                  >
                    {label}
                  </button>

                  <input
                    type="text"
                    required
                    value={opt}
                    onChange={e => handleOptionChange(idx, e.target.value)}
                    placeholder={`Nội dung phương án ${label}`}
                    className={`flex-1 px-3 py-2 border rounded-lg text-slate-800 text-xs transition-colors ${
                      isCorrect 
                        ? 'border-emerald-500 bg-emerald-50/50' 
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Lời giải chi tiết / Hướng dẫn giải
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={e => setExplanation(e.target.value)}
              placeholder="Giải thích vì sao chọn đáp án trên để học sinh tham khảo khi xem bài..."
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
              className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-all"
            >
              Lưu vào Ngân Hàng Câu Hỏi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
