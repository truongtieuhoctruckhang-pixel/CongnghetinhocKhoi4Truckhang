import React, { useState } from 'react';
import { X, CheckCircle2, Clock, Bell, User, MessageSquare } from 'lucide-react';
import { Homework, HomeworkSubmission } from '../../types';
import { useApp } from '../../context/AppContext';

interface HomeworkGradingModalProps {
  homework: Homework;
  onClose: () => void;
}

export const HomeworkGradingModal: React.FC<HomeworkGradingModalProps> = ({ homework, onClose }) => {
  const { gradeHomeworkSubmission, remindStudentHomework } = useApp();

  const [activeSubmission, setActiveSubmission] = useState<HomeworkSubmission | null>(
    homework.submissions[0] || null
  );
  const [scoreInput, setScoreInput] = useState<number>(activeSubmission?.score ?? 9);
  const [feedbackInput, setFeedbackInput] = useState<string>(activeSubmission?.feedback ?? '');

  const handleSelectSubmission = (sub: HomeworkSubmission) => {
    setActiveSubmission(sub);
    setScoreInput(sub.score ?? 9);
    setFeedbackInput(sub.feedback ?? '');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission) return;

    gradeHomeworkSubmission(
      homework.id,
      activeSubmission.id,
      scoreInput,
      feedbackInput.trim()
    );

    // Update local active state
    setActiveSubmission(prev => prev ? {
      ...prev,
      score: scoreInput,
      feedback: feedbackInput.trim(),
      status: 'graded'
    } : null);
  };

  const quickFeedbackSuggestions = [
    'Bài làm rất tốt, cách trình bày sạch đẹp!',
    'Tiếp thu bài nhanh, tính toán chuẩn xác.',
    'Cần chú ý đọc kỹ yêu cầu câu hỏi hơn.',
    'Chữ viết rõ ràng, cố gắng phát huy nhé!',
    'Em cần rèn thêm bước đặt tính chia.'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <span>Lớp {homework.targetClass}</span>
              <span>·</span>
              <span>Môn {homework.subject}</span>
              <span>·</span>
              <span>Hạn nộp: {homework.deadline}</span>
            </div>
            <h2 className="text-base font-bold text-white mt-0.5 truncate max-w-xl">
              Chấm Điểm: {homework.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Left Column: Student Submission List */}
          <div className="overflow-y-auto p-4 space-y-2 bg-slate-50/50 max-h-[70vh]">
            <div className="flex items-center justify-between pb-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <span>Danh Sách Học Sinh</span>
              <span className="font-mono text-emerald-700">
                {homework.submissions.filter(s => s.status === 'graded').length}/{homework.submissions.length} đã chấm
              </span>
            </div>

            {homework.submissions.map(sub => {
              const isSelected = activeSubmission?.id === sub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => handleSelectSubmission(sub)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                    isSelected 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold truncate">{sub.studentName}</span>
                    {sub.status === 'graded' && (
                      <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        isSelected ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {sub.score}đ
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className={isSelected ? 'text-emerald-100' : 'text-slate-500'}>
                      {sub.status === 'missing' ? 'Chưa nộp bài' :
                       sub.status === 'graded' ? 'Đã chấm xong' : 'Chờ giáo viên chấm'}
                    </span>

                    {sub.status === 'missing' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          remindStudentHomework(homework.id, sub.studentName);
                        }}
                        className={`p-1 rounded flex items-center gap-1 font-semibold ${
                          isSelected ? 'bg-emerald-700 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                        title="Gửi tin nhắn nhắc nộp bài"
                      >
                        <Bell className="w-3 h-3" />
                        Nhắc nhở
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Grading & Feedback Editor */}
          <div className="md:col-span-2 p-6 overflow-y-auto space-y-5">
            {activeSubmission ? (
              <form onSubmit={handleSaveGrade} className="space-y-5">
                {/* Student Info Bar */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{activeSubmission.studentName}</h4>
                      <p className="text-xs text-slate-500">
                        {activeSubmission.studentClass} · 
                        {activeSubmission.submittedAt 
                          ? ` Nộp lúc: ${activeSubmission.submittedAt}` 
                          : ' Chưa ghi nhận thời gian nộp trực tuyến'}
                      </p>
                    </div>
                  </div>

                  {activeSubmission.status === 'missing' ? (
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      Chưa nộp bài
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đã nộp bài
                    </span>
                  )}
                </div>

                {/* Student's Homework Content / Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ghi chú bài nộp của học sinh
                  </label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 min-h-16 leading-relaxed">
                    {activeSubmission.contentNote || 'Học sinh đã nộp vở bài tập trực tiếp tại lớp.'}
                  </div>
                </div>

                {/* Score Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Cho điểm (Thang điểm 10) <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[10, 9.5, 9, 8.5, 8, 7.5, 7].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setScoreInput(val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                          scoreInput === val
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="10"
                      value={scoreInput}
                      onChange={e => setScoreInput(Number(e.target.value))}
                      className="w-20 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 text-center"
                    />
                  </div>
                </div>

                {/* Teacher Feedback */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Lời phê và nhận xét của thầy/cô</span>
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackInput}
                    onChange={e => setFeedbackInput(e.target.value)}
                    placeholder="Nhập nhận xét cụ thể để động viên học sinh..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white resize-none"
                  />

                  {/* Quick suggestion chips */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {quickFeedbackSuggestions.map((text, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFeedbackInput(text)}
                        className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[11px] transition-colors"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
                  >
                    Lưu điểm & nhận xét
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Chọn một học sinh từ danh sách bên trái để chấm điểm.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
