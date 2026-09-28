import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Layers,
  Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Subject, DifficultyLevel } from '../../types';
import { QuestionCreateModal } from './QuestionCreateModal';
import { AutoExamFromBankModal } from './AutoExamFromBankModal';

const SUBJECTS: ('all' | Subject)[] = [
  'all',
  'Tin học',
  'Công nghệ'
];

export const QuestionBankManagement: React.FC = () => {
  const { 
    questions, 
    deleteQuestion, 
    selectedGrade, 
    searchQuery 
  } = useApp();

  const [subjectFilter, setSubjectFilter] = useState<'all' | Subject>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | DifficultyLevel>('all');
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAutoExamOpen, setIsAutoExamOpen] = useState(false);

  const toggleExplanation = (id: string) => {
    setExpandedExplanations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredQuestions = questions.filter(q => {
    if (selectedGrade !== 'all' && q.grade !== selectedGrade) return false;
    if (subjectFilter !== 'all' && q.subject !== subjectFilter) return false;
    if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false;
    if (searchQuery.trim()) {
      const kw = searchQuery.toLowerCase();
      return (
        q.content.toLowerCase().includes(kw) ||
        q.code.toLowerCase().includes(kw) ||
        q.topic.toLowerCase().includes(kw) ||
        q.subject.toLowerCase().includes(kw)
      );
    }
    return true;
  });

  // Stats
  const totalCount = questions.length;
  const easyCount = questions.filter(q => q.difficulty === 'easy').length;
  const mediumCount = questions.filter(q => q.difficulty === 'medium').length;
  const hardCount = questions.filter(q => q.difficulty === 'hard' || q.difficulty === 'expert').length;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Tổng câu hỏi trong kho</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Đạt chuẩn ma trận GDPT 2018</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Mức 1: Nhận biết</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
            {easyCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Tỉ lệ {Math.round((easyCount / (totalCount || 1)) * 100)}% tổng số</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Mức 2: Thông hiểu</span>
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          </div>
          <div className="text-2xl font-extrabold text-teal-700 font-mono tabular-nums">
            {mediumCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Tỉ lệ {Math.round((mediumCount / (totalCount || 1)) * 100)}% tổng số</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Mức 3 & 4: Vận dụng</span>
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          </div>
          <div className="text-2xl font-extrabold text-amber-700 font-mono tabular-nums">
            {hardCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Phân hóa học sinh xuất sắc</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            {SUBJECTS.map((sub) => (
              <button
                key={sub}
                onClick={() => setSubjectFilter(sub)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  subjectFilter === sub
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {sub === 'all' ? 'Tất cả môn' : sub}
              </button>
            ))}
          </div>

          {/* Difficulty Select */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-hidden focus:border-emerald-600"
          >
            <option value="all">Tất cả mức độ</option>
            <option value="easy">Mức 1: Nhận biết</option>
            <option value="medium">Mức 2: Thông hiểu</option>
            <option value="hard">Mức 3: Vận dụng</option>
            <option value="expert">Mức 4: Vận dụng cao</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoExamOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Tạo đề ma trận tự động</span>
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm câu hỏi mới</span>
          </button>
        </div>
      </div>

      {/* Question List */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy câu hỏi phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Thử thay đổi môn học, mức độ nhận thức hoặc soạn thêm câu hỏi mới vào ngân hàng.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Soạn câu hỏi ngay
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, qIndex) => {
            let difficultyLabel = 'Mức 1: Nhận biết';
            let diffColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
            if (q.difficulty === 'medium') {
              difficultyLabel = 'Mức 2: Thông hiểu';
              diffColor = 'text-teal-700 bg-teal-50 border-teal-200';
            } else if (q.difficulty === 'hard') {
              difficultyLabel = 'Mức 3: Vận dụng';
              diffColor = 'text-amber-700 bg-amber-50 border-amber-200';
            } else if (q.difficulty === 'expert') {
              difficultyLabel = 'Mức 4: Vận dụng cao';
              diffColor = 'text-purple-700 bg-purple-50 border-purple-200';
            }

            const isExplExpanded = Boolean(expandedExplanations[q.id]);

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all space-y-3.5"
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {q.code}
                    </span>
                    <span className="font-semibold text-slate-800">
                      Môn {q.subject}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 font-medium">
                      Khối {q.grade}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 italic">
                      {q.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${diffColor}`}>
                      {difficultyLabel}
                    </span>
                    <button
                      onClick={() => deleteQuestion(q.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Xóa câu hỏi này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Question content */}
                <p className="text-sm text-slate-900 font-medium leading-relaxed">
                  <span className="font-bold text-slate-800">Câu {qIndex + 1}: </span>
                  {q.content}
                </p>

                {/* 4 Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, optIndex) => {
                    const isCorrect = q.correctAnswer === optIndex;
                    const letter = String.fromCharCode(65 + optIndex);
                    return (
                      <div
                        key={optIndex}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-colors ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                            : 'bg-slate-50/70 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {letter}
                        </span>
                        <span className="flex-1 mt-0.5">{opt}</span>
                        {isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Expand */}
                {q.explanation && (
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => toggleExplanation(q.id)}
                      className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold transition-colors"
                    >
                      <span>{isExplExpanded ? 'Ẩn lời giải chi tiết' : 'Xem lời giải chi tiết'}</span>
                      {isExplExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExplExpanded && (
                      <div className="mt-2 p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs text-slate-700 leading-relaxed animate-in fade-in">
                        <span className="font-bold text-emerald-900">Hướng dẫn giải: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {isCreateOpen && (
        <QuestionCreateModal
          onClose={() => setIsCreateOpen(false)}
        />
      )}

      {isAutoExamOpen && (
        <AutoExamFromBankModal
          onClose={() => setIsAutoExamOpen(false)}
        />
      )}
    </div>
  );
};
