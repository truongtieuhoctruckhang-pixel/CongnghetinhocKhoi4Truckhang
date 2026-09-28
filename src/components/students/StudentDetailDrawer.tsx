import React from 'react';
import { 
  X, 
  GraduationCap, 
  Phone, 
  MapPin, 
  Award, 
  BookOpenCheck, 
  Clock, 
  FileCheck2,
  User,
  HeartHandshake
} from 'lucide-react';
import { Student } from '../../types';
import { useApp } from '../../context/AppContext';

interface StudentDetailDrawerProps {
  student: Student;
  onClose: () => void;
  onEdit: () => void;
}

export const StudentDetailDrawer: React.FC<StudentDetailDrawerProps> = ({ 
  student, 
  onClose,
  onEdit 
}) => {
  const { homeworks, examResults } = useApp();

  // Find all homework submissions of this student
  const studentHomeworks: {
    hwTitle: string;
    subject: string;
    score?: number;
    feedback?: string;
    status: string;
  }[] = [];

  homeworks.forEach(hw => {
    const sub = hw.submissions.find(s => s.studentId === student.id || s.studentName === student.fullName);
    if (sub) {
      studentHomeworks.push({
        hwTitle: hw.title,
        subject: hw.subject,
        score: sub.score,
        feedback: sub.feedback,
        status: sub.status
      });
    }
  });

  // Find exam results
  const studentExams = examResults.filter(
    r => r.studentId === student.id || r.studentName === student.fullName
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-6 shrink-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 rounded-full bg-emerald-600/30 blur-2xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-emerald-200 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 relative">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 border-2 border-emerald-400 text-emerald-100 flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              {student.fullName.split(' ').slice(-1)[0]?.slice(0, 2).toUpperCase() || 'HS'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-emerald-300 font-bold">{student.code}</span>
                <span className="text-emerald-300">·</span>
                <span className="bg-emerald-900 text-emerald-200 text-xs px-2 py-0.5 rounded font-bold">
                  Lớp {student.class}
                </span>
              </div>
              <h2 className="text-lg font-black text-white mt-0.5 truncate">
                {student.fullName}
              </h2>
              <p className="text-xs text-emerald-200 flex items-center gap-1.5 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Trường Tiểu học Trực Khang</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {/* Highlight Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-center">
              <span className="text-[11px] text-emerald-800 font-semibold block">Điểm TB học tập</span>
              <span className="text-xl font-extrabold text-emerald-900 font-mono tabular-nums">
                {student.avgScore} <span className="text-xs font-normal text-slate-500">/ 10</span>
              </span>
            </div>

            <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3 text-center">
              <span className="text-[11px] text-teal-800 font-semibold block">Tỉ lệ hoàn thành</span>
              <span className="text-xl font-extrabold text-teal-900 font-mono tabular-nums">
                {student.completionRate}%
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-[11px] text-slate-600 font-semibold block">Rèn luyện</span>
              <span className="text-xs font-bold text-slate-800 block mt-1 truncate">
                {student.conduct.replace('Hoàn thành ', '')}
              </span>
            </div>
          </div>

          {/* Student & Parent Info */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2.5">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Thông Tin Cá Nhân & Gia Đình</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Giới tính / Ngày sinh</span>
                <span className="font-medium text-slate-800">{student.gender} · {student.dob}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Phụ huynh / Người bảo hộ</span>
                <span className="font-medium text-slate-800">{student.parentName}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2 text-xs">
              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-mono font-medium text-slate-800">{student.parentPhone}</span>
            </div>

            <div className="flex items-start gap-2 text-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-600 leading-relaxed">{student.address}</span>
            </div>
          </div>

          {/* Teacher's Note */}
          {student.notes && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
              <span className="font-bold text-amber-900 text-[11px] block mb-0.5 flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5" />
                Nhận xét của GVCN:
              </span>
              <p className="text-xs text-amber-950 leading-relaxed">{student.notes}</p>
            </div>
          )}

          {/* Homework history */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BookOpenCheck className="w-3.5 h-3.5 text-emerald-600" />
                Lịch Sử Làm Bài Tập Về Nhà
              </span>
              <span className="font-mono text-emerald-700">{studentHomeworks.length} bài</span>
            </h4>

            {studentHomeworks.length === 0 ? (
              <div className="p-3 bg-slate-50 rounded-xl text-center text-slate-400 text-xs">
                Chưa có dữ liệu bài tập về nhà
              </div>
            ) : (
              <div className="space-y-2">
                {studentHomeworks.map((sh, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 truncate">{sh.hwTitle}</span>
                      {sh.score !== undefined ? (
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {sh.score}đ
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Chờ chấm</span>
                      )}
                    </div>
                    {sh.feedback && (
                      <p className="text-[11px] text-slate-600 italic">
                        &quot;{sh.feedback}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exam test results */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                Kết Quả Làm Đề Kiểm Tra Trực Tuyến
              </span>
              <span className="font-mono text-emerald-700">{studentExams.length} lượt</span>
            </h4>

            {studentExams.length === 0 ? (
              <div className="p-3 bg-slate-50 rounded-xl text-center text-slate-400 text-xs">
                Chưa có lịch sử làm bài kiểm tra trực tuyến phiên này
              </div>
            ) : (
              <div className="space-y-2">
                {studentExams.map(res => (
                  <div key={res.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800 truncate">{res.examTitle}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>Nộp lúc: {res.submittedAt}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-base font-extrabold text-emerald-700">
                        {res.score}đ
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            Chỉnh sửa thông tin
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
