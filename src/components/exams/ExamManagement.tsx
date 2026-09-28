import React, { useState } from 'react';
import { 
  FileCheck2, 
  Plus, 
  Play, 
  Printer, 
  Eye, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Award,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Exam, Subject } from '../../types';
import { ExamSimulatorModal } from './ExamSimulatorModal';
import { ExamPrintModal } from './ExamPrintModal';
import { ExamCreateModal } from './ExamCreateModal';
import { ExamSubmissionsModal } from './ExamSubmissionsModal';

const SUBJECT_OPTIONS: ('all' | Subject)[] = [
  'all',
  'Toán',
  'Tiếng Việt',
  'Tiếng Anh',
  'Khoa học',
  'Lịch sử & Địa lý',
  'Tin học'
];

export const ExamManagement: React.FC = () => {
  const { 
    exams, 
    deleteExam, 
    selectedGrade, 
    searchQuery,
    questions 
  } = useApp();

  const [subjectFilter, setSubjectFilter] = useState<'all' | Subject>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'upcoming' | 'completed' | 'draft'>('all');
  
  // Modals
  const [activeSimulatorExam, setActiveSimulatorExam] = useState<Exam | null>(null);
  const [activePrintExam, setActivePrintExam] = useState<Exam | null>(null);
  const [activeSubmissionsExam, setActiveSubmissionsExam] = useState<Exam | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filter logic
  const filteredExams = exams.filter(ex => {
    if (selectedGrade !== 'all' && ex.grade !== selectedGrade) return false;
    if (subjectFilter !== 'all' && ex.subject !== subjectFilter) return false;
    if (statusFilter !== 'all' && ex.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ex.title.toLowerCase().includes(q) ||
        ex.code.toLowerCase().includes(q) ||
        ex.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Aggregated Stats
  const totalExams = exams.length;
  const ongoingExams = exams.filter(e => e.status === 'ongoing').length;
  const totalSubmissions = exams.reduce((acc, curr) => acc + (curr.submissionsCount || 0), 0);
  const validAvgs = exams.filter(e => e.avgScore !== undefined).map(e => e.avgScore as number);
  const overallAvg = validAvgs.length > 0 
    ? (validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length).toFixed(1) 
    : '8.8';

  return (
    <div className="space-y-6">
      {/* Stat Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Tổng số đề kiểm tra</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalExams}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Đầy đủ 5 khối tiểu học</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Đang mở khảo sát</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
            {ongoingExams}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Học sinh có thể làm bài</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Lượt bài đã nộp</span>
            <Award className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalSubmissions}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Ghi nhận toàn trường</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Điểm TB khảo sát</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
            {overallAvg} <span className="text-xs text-slate-500 font-normal">/ 10</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">Đạt chuẩn năng lực tốt</div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto max-w-full">
            {SUBJECT_OPTIONS.map((sub) => (
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

          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-hidden focus:border-emerald-600"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="ongoing">Đang mở làm bài</option>
            <option value="upcoming">Sắp tới</option>
            <option value="completed">Đã kết thúc</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo đề kiểm tra mới</span>
        </button>
      </div>

      {/* Exam Grid */}
      {filteredExams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy đề kiểm tra phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Thử thay đổi bộ lọc môn học, khối lớp hoặc bấm nút bên dưới để tạo đề kiểm tra mới.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tạo đề thi ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam) => {
            const questionCount = exam.questionIds.length;
            const validQuestions = exam.questionIds
              .map(id => questions.find(q => q.id === id))
              .filter(Boolean);

            let statusLabel = 'Đang diễn ra';
            let statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
            if (exam.status === 'upcoming') {
              statusLabel = 'Chuẩn bị mở';
              statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
            } else if (exam.status === 'completed') {
              statusLabel = 'Đã hoàn thành';
              statusColor = 'text-slate-700 bg-slate-100 border-slate-200';
            } else if (exam.status === 'draft') {
              statusLabel = 'Bản nháp';
              statusColor = 'text-slate-500 bg-slate-50 border-slate-200';
            }

            return (
              <div
                key={exam.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-400/80 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between group overflow-hidden"
              >
                <div className="p-5 space-y-3">
                  {/* Top line metadata */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {exam.subject}
                      </span>
                      <span className="text-slate-500 text-xs font-semibold">
                        Khối {exam.grade}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Title & Code */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                      {exam.title}
                    </h3>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">
                      Mã: {exam.code} · {exam.academicTerm}
                    </div>
                  </div>

                  {/* Clean unboxed metadata with dot separators */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono tabular-nums">{exam.durationMinutes} phút</span>
                      <span>·</span>
                      <span>{questionCount} câu hỏi</span>
                    </div>

                    <div className="font-mono tabular-nums font-semibold text-slate-700">
                      {exam.submissionsCount} bài nộp
                    </div>
                  </div>

                  {/* Preview of first questions */}
                  {validQuestions.length > 0 && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600 line-clamp-2">
                      <span className="font-semibold text-emerald-800">Ví dụ: </span>
                      {validQuestions[0]?.content}
                    </div>
                  )}
                </div>

                {/* Card Actions Bottom Bar */}
                <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Simulator Button */}
                    <button
                      onClick={() => setActiveSimulatorExam(exam)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                      title="Chế độ làm thử đề thi với đồng hồ đếm ngược"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Làm thử</span>
                    </button>

                    {/* Print Button */}
                    <button
                      onClick={() => setActivePrintExam(exam)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
                      title="Xem và In đề thi chuẩn Bộ GD&ĐT"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    {/* View Submissions */}
                    <button
                      onClick={() => setActiveSubmissionsExam(exam)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
                      title="Xem danh sách bài nộp và phổ điểm"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => deleteExam(exam.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Xóa đề thi này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {activeSimulatorExam && (
        <ExamSimulatorModal
          exam={activeSimulatorExam}
          onClose={() => setActiveSimulatorExam(null)}
        />
      )}

      {activePrintExam && (
        <ExamPrintModal
          exam={activePrintExam}
          onClose={() => setActivePrintExam(null)}
        />
      )}

      {activeSubmissionsExam && (
        <ExamSubmissionsModal
          exam={activeSubmissionsExam}
          onClose={() => setActiveSubmissionsExam(null)}
        />
      )}

      {isCreateOpen && (
        <ExamCreateModal
          onClose={() => setIsCreateOpen(false)}
        />
      )}
    </div>
  );
};
