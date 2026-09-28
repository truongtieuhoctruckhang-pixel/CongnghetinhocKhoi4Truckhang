import React from 'react';
import { X, Printer, Copy, Check } from 'lucide-react';
import { Exam, Question } from '../../types';
import { useApp } from '../../context/AppContext';

interface ExamPrintModalProps {
  exam: Exam;
  onClose: () => void;
}

export const ExamPrintModal: React.FC<ExamPrintModalProps> = ({ exam, onClose }) => {
  const { questions, showToast } = useApp();
  const [copied, setCopied] = React.useState(false);

  const examQuestions: Question[] = exam.questionIds
    .map(id => questions.find(q => q.id === id))
    .filter((q): q is Question => Boolean(q));

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textLines = [
      `UBND HUYỆN TRỰC NINH`,
      `TRƯỜNG TIỂU HỌC TRỰC KHANG`,
      `-------------------`,
      `${exam.title.toUpperCase()}`,
      `Năm học: ${exam.schoolYear} - Môn: ${exam.subject} - Khối ${exam.grade}`,
      `Thời gian làm bài: ${exam.durationMinutes} phút (Không kể thời gian phát đề)`,
      ``,
      `Họ và tên học sinh: .................................................... Lớp: .............`,
      ``,
      `I. HƯỚNG DẪN: ${exam.instructions}`,
      `II. NỘI DUNG ĐỀ THI:`,
      ``,
      ...examQuestions.flatMap((q, idx) => [
        `Câu ${idx + 1} (${q.code}): ${q.content}`,
        ...q.options.map((opt, oIdx) => `   ${String.fromCharCode(65 + oIdx)}. ${opt}`),
        ``
      ]),
      `--- HẾT ---`
    ].join('\n');

    navigator.clipboard.writeText(textLines);
    setCopied(true);
    showToast('Đã sao chép nội dung đề thi vào bộ nhớ tạm!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none">
        {/* Modal Controls Bar (hidden during print) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Bản In Đề Kiểm Tra Chuẩn THQH</span>
            <span className="text-xs text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded font-mono">
              Mẫu Bộ GD&ĐT
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In đề thi (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Document Preview */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 font-serif text-slate-900 bg-white">
          {/* Official School Header */}
          <div className="grid grid-cols-2 gap-4 pb-6 border-b-2 border-slate-900 text-sm">
            <div>
              <p className="font-bold uppercase tracking-wider text-xs">UBND HUYỆN TRỰC NINH</p>
              <p className="font-extrabold uppercase text-xs text-slate-800">
                TRƯỜNG TIỂU HỌC TRỰC KHANG
              </p>
              <p className="text-xs italic text-slate-600 mt-1">Mã đề: {exam.code}</p>
            </div>
            <div className="text-right">
              <p className="font-bold uppercase text-xs">{exam.academicTerm.toUpperCase()}</p>
              <p className="text-xs">Năm học: {exam.schoolYear}</p>
              <p className="text-xs italic text-slate-600">Thời gian: {exam.durationMinutes} phút</p>
            </div>
          </div>

          {/* Exam Title */}
          <div className="text-center py-6">
            <h1 className="text-lg font-bold uppercase tracking-wide">
              {exam.title}
            </h1>
            <p className="text-xs italic mt-1 text-slate-600">
              (Dành cho học sinh khối {exam.grade} - Chương trình GDPT 2018)
            </p>
          </div>

          {/* Student Info Box */}
          <div className="border border-slate-400 p-3 mb-6 text-xs grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-1.5">
              <p>Họ và tên học sinh: ....................................................................</p>
              <p>Lớp: ......................... Trường: Tiểu học Trực Khang</p>
            </div>
            <div className="border-l border-slate-300 pl-3">
              <p className="font-bold text-center">ĐIỂM SỐ & LỜI PHÊ</p>
              <div className="h-10 border-b border-dashed border-slate-300 mt-1"></div>
            </div>
          </div>

          {/* Instructions */}
          {exam.instructions && (
            <div className="mb-6 text-xs italic bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="font-bold not-italic">Lưu ý: </span>
              {exam.instructions}
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-6 text-sm">
            {examQuestions.map((q, idx) => (
              <div key={q.id} className="space-y-2">
                <p className="font-semibold text-slate-900 leading-relaxed">
                  <span className="font-bold">Câu {idx + 1}: </span>
                  {q.content}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 text-xs font-sans">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-start gap-2">
                      <span className="font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer of Exam */}
          <div className="mt-12 pt-6 border-t border-slate-300 text-center text-xs italic text-slate-500">
            ---------------- HẾT ----------------
            <p className="mt-1">Giám thị coi thi không giải thích gì thêm.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
