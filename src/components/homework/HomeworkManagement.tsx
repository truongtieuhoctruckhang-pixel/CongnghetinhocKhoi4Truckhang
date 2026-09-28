import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileEdit, 
  Sparkles,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Homework, Subject } from '../../types';
import { HomeworkGradingModal } from './HomeworkGradingModal';
import { HomeworkCreateModal } from './HomeworkCreateModal';

export const HomeworkManagement: React.FC = () => {
  const { 
    homeworks, 
    selectedGrade, 
    searchQuery 
  } = useApp();

  const [classFilter, setClassFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<'all' | Subject>('all');
  
  // Modals
  const [activeGradingHomework, setActiveGradingHomework] = useState<Homework | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredHomeworks = homeworks.filter(hw => {
    if (selectedGrade !== 'all' && hw.grade !== selectedGrade) return false;
    if (classFilter !== 'all' && hw.targetClass !== classFilter) return false;
    if (subjectFilter !== 'all' && hw.subject !== subjectFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        hw.title.toLowerCase().includes(q) ||
        hw.subject.toLowerCase().includes(q) ||
        hw.targetClass.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate Metrics
  const activeCount = homeworks.filter(h => h.status === 'active').length;
  
  let totalSubCount = 0;
  let gradedSubCount = 0;
  homeworks.forEach(h => {
    totalSubCount += h.submissions.filter(s => s.status !== 'missing').length;
    gradedSubCount += h.submissions.filter(s => s.status === 'graded').length;
  });

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Bài tập đang giao</span>
            <BookOpenCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {activeCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Đang trong thời hạn làm bài</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Lượt bài đã nộp</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
            {totalSubCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Tỉ lệ hoàn thành cao</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Đã chấm & nhận xét</span>
            <Sparkles className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {gradedSubCount}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Phản hồi kịp thời cho trò</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Cần giáo viên chấm</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
            {Math.max(0, totalSubCount - gradedSubCount)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Chờ chấm và gửi lời phê</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {['all', '5A', '5B', '4A', '3B', '2A', '1A'].map((cls) => (
              <button
                key={cls}
                onClick={() => setClassFilter(cls)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  classFilter === cls
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {cls === 'all' ? 'Tất cả lớp' : `Lớp ${cls}`}
              </button>
            ))}
          </div>

          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-hidden focus:border-emerald-600"
          >
            <option value="all">Tất cả môn học</option>
            <option value="Tin học">Tin học</option>
            <option value="Công nghệ">Công nghệ</option>
          </select>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Giao bài tập mới</span>
        </button>
      </div>

      {/* Homework List */}
      {filteredHomeworks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpenCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Không có bài tập nào phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Chưa có bài tập về nhà nào cho bộ lọc này. Thầy cô có thể bấm nút dưới để giao bài mới cho lớp.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Giao bài tập ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHomeworks.map((hw) => {
            const submittedCount = hw.submissions.filter(s => s.status !== 'missing').length;
            const gradedCount = hw.submissions.filter(s => s.status === 'graded').length;
            const totalStudents = hw.submissions.length || 32;
            const percentSubmitted = Math.round((submittedCount / totalStudents) * 100);

            let statusBadge = (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                Đang mở nộp bài
              </span>
            );
            if (hw.status === 'grading') {
              statusBadge = (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200">
                  Đang chấm điểm
                </span>
              );
            } else if (hw.status === 'closed') {
              statusBadge = (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200">
                  Đã đóng hạn
                </span>
              );
            }

            return (
              <div
                key={hw.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400/80 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 space-y-3">
                  {/* Top Bar info */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {hw.subject}
                      </span>
                      <span className="text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                        Lớp {hw.targetClass}
                      </span>
                    </div>
                    {statusBadge}
                  </div>

                  {/* Title & Deadline */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {hw.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Hạn chót: </span>
                      <strong className="font-mono text-slate-700">{hw.deadline}</strong>
                    </div>
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {hw.description}
                  </p>

                  {/* Submission Progress bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        Tiến độ nộp bài:
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {submittedCount}/{totalStudents} ({percentSubmitted}%)
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${percentSubmitted}%` }}
                      />
                    </div>

                    <div className="text-[11px] text-slate-500 text-right">
                      Đã chấm: <strong className="text-emerald-700 font-mono">{gradedCount}</strong> bài
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Mã: {hw.code}
                  </span>

                  <button
                    onClick={() => setActiveGradingHomework(hw)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Chấm & Nhận xét</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {activeGradingHomework && (
        <HomeworkGradingModal
          homework={activeGradingHomework}
          onClose={() => setActiveGradingHomework(null)}
        />
      )}

      {isCreateOpen && (
        <HomeworkCreateModal
          onClose={() => setIsCreateOpen(false)}
        />
      )}
    </div>
  );
};
