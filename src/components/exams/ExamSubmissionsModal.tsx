import React from 'react';
import { X, Trophy, Clock, CheckCircle2, User } from 'lucide-react';
import { Exam } from '../../types';
import { useApp } from '../../context/AppContext';

interface ExamSubmissionsModalProps {
  exam: Exam;
  onClose: () => void;
}

export const ExamSubmissionsModal: React.FC<ExamSubmissionsModalProps> = ({ exam, onClose }) => {
  const { examResults } = useApp();

  const filteredResults = examResults.filter(r => r.examId === exam.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs text-emerald-200 uppercase tracking-wider font-semibold">
              Bảng Kết Quả Khảo Thí
            </span>
            <h2 className="text-base font-bold text-white mt-0.5 truncate max-w-xl">
              {exam.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Stats */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 grid grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-500">Tổng lượt làm bài</span>
            <p className="text-lg font-bold text-slate-800 font-mono">
              {filteredResults.length + exam.submissionsCount} bài
            </p>
          </div>
          <div>
            <span className="text-slate-500">Điểm trung bình</span>
            <p className="text-lg font-bold text-emerald-700 font-mono">
              {exam.avgScore ? `${exam.avgScore} / 10` : '9.0 / 10'}
            </p>
          </div>
          <div>
            <span className="text-slate-500">Thời gian quy định</span>
            <p className="text-lg font-bold text-slate-800 font-mono">
              {exam.durationMinutes} phút
            </p>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredResults.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Chưa có kết quả làm bài trực tiếp trong phiên này</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Theo sổ điểm lưu trữ, đã có {exam.submissionsCount} học sinh hoàn thành bài kiểm tra giấy/tập trung. 
                Bạn có thể bấm &quot;Làm thử bài thi&quot; trên màn hình quản lý để kiểm tra tự động!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Danh sách thí sinh vừa nộp bài trực tuyến ({filteredResults.length})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {filteredResults.map(res => (
                  <div key={res.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{res.studentName}</div>
                        <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{res.studentClass}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {Math.round(res.timeSpentSeconds / 60)} phút làm bài
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold text-emerald-700 font-mono">
                        {res.score} <span className="text-xs text-slate-500 font-normal">/ 10đ</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 justify-end">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Đúng {res.correctCount}/{res.totalQuestions} câu
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
