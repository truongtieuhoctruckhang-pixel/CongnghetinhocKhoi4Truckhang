import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  Trophy, 
  RotateCcw
} from 'lucide-react';
import { Exam, Question } from '../../types';
import { useApp } from '../../context/AppContext';

interface ExamSimulatorModalProps {
  exam: Exam;
  onClose: () => void;
}

export const ExamSimulatorModal: React.FC<ExamSimulatorModalProps> = ({ exam, onClose }) => {
  const { questions, submitExamResult, students } = useApp();

  // Find actual question objects for this exam
  const examQuestions: Question[] = exam.questionIds
    .map(id => questions.find(q => q.id === id))
    .filter((q): q is Question => Boolean(q));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(exam.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'std-1');

  // Countdown timer
  useEffect(() => {
    if (isSubmitted || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, timeLeftSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);

    // Calculate score
    let correctCount = 0;
    examQuestions.forEach(q => {
      const studentAns = selectedAnswers[q.id];
      if (studentAns !== undefined && studentAns === q.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = examQuestions.length > 0
      ? Number(((correctCount / examQuestions.length) * 10).toFixed(1))
      : 10;

    const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

    submitExamResult({
      examId: exam.id,
      examTitle: exam.title,
      studentId: currentStudent?.id || 'std-test',
      studentName: currentStudent?.fullName || 'Học sinh kiểm tra thử',
      studentClass: currentStudent?.class || `Lớp ${exam.grade}A`,
      score: calculatedScore,
      totalQuestions: examQuestions.length,
      correctCount,
      timeSpentSeconds: exam.durationMinutes * 60 - timeLeftSeconds,
      answers: selectedAnswers
    });
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setTimeLeftSeconds(exam.durationMinutes * 60);
    setIsSubmitted(false);
    setCurrentIndex(0);
  };

  const currentQ = examQuestions[currentIndex];

  // Scoring review
  const scoreResults = React.useMemo(() => {
    let correct = 0;
    examQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    const finalScore = examQuestions.length > 0 
      ? Number(((correct / examQuestions.length) * 10).toFixed(1))
      : 10;
    return {
      correct,
      total: examQuestions.length,
      finalScore
    };
  }, [selectedAnswers, examQuestions]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <span className="font-semibold uppercase tracking-wider">Tiểu học Trực Khang</span>
              <span>·</span>
              <span>Môn {exam.subject} - Khối {exam.grade}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5 truncate max-w-xl">
              {exam.title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${
              timeLeftSeconds < 300 && !isSubmitted 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-emerald-950/60 text-emerald-200 border border-emerald-600/40'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-700/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-bar / Student Selector */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <span className="font-medium">Thí sinh làm bài:</span>
            <select
              value={selectedStudentId}
              disabled={isSubmitted}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-white border border-slate-200 rounded-md px-2.5 py-1 text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-600"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.fullName} - {s.class} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 font-medium">
            <span>Tiến độ: <strong className="text-slate-800">{Object.keys(selectedAnswers).length}/{examQuestions.length} câu</strong></span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left / Center: Question Card */}
          <div className="md:col-span-3 space-y-4">
            {isSubmitted ? (
              /* Results Overview */
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-600/20">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-emerald-950">
                    Kết Quả: {scoreResults.finalScore} / 10 Điểm
                  </h3>
                  <p className="text-sm text-emerald-800 mt-1">
                    Đúng {scoreResults.correct} trên tổng số {scoreResults.total} câu hỏi trắc nghiệm
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-emerald-300 text-emerald-800 font-semibold rounded-xl text-xs hover:bg-emerald-100 transition-colors shadow-xs"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Làm lại bài thi
                  </button>
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Đóng bài thi
                  </button>
                </div>
              </div>
            ) : null}

            {currentQ ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                {/* Question metadata */}
                <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono">
                      Câu {currentIndex + 1}
                    </span>
                    <span className="text-slate-500">Mã câu: {currentQ.code}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600">{currentQ.topic}</span>
                  </div>
                  <span className="text-slate-500 italic">
                    {currentQ.difficulty === 'easy' ? 'Mức 1: Nhận biết' :
                     currentQ.difficulty === 'medium' ? 'Mức 2: Thông hiểu' :
                     currentQ.difficulty === 'hard' ? 'Mức 3: Vận dụng' : 'Mức 4: Vận dụng cao'}
                  </span>
                </div>

                {/* Question Text */}
                <p className="text-base text-slate-800 font-medium leading-relaxed mb-6">
                  {currentQ.content}
                </p>

                {/* Options List */}
                <div className="space-y-3">
                  {currentQ.options.map((opt, optIndex) => {
                    const optionLabel = String.fromCharCode(65 + optIndex); // A, B, C, D
                    const isSelected = selectedAnswers[currentQ.id] === optIndex;
                    const isCorrect = currentQ.correctAnswer === optIndex;

                    let itemStyle = 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-slate-700';

                    if (isSubmitted) {
                      if (isCorrect) {
                        itemStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium ring-1 ring-emerald-500';
                      } else if (isSelected && !isCorrect) {
                        itemStyle = 'border-rose-400 bg-rose-50 text-rose-900 font-medium';
                      } else {
                        itemStyle = 'border-slate-200 text-slate-500 opacity-70';
                      }
                    } else if (isSelected) {
                      itemStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-2 ring-emerald-600/30';
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleSelectOption(currentQ.id, optIndex)}
                        disabled={isSubmitted}
                        className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all text-sm ${itemStyle}`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {optionLabel}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isSubmitted && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {isSubmitted && isSelected && !isCorrect && (
                          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Show explanation if submitted */}
                {isSubmitted && currentQ.explanation && (
                  <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-emerald-800">Lời giải chi tiết: </span>
                    {currentQ.explanation}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl">
                Không tìm thấy câu hỏi tương ứng trong ngân hàng.
              </div>
            )}

            {/* Bottom Nav Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Câu trước
              </button>

              <button
                onClick={() => setCurrentIndex(prev => Math.min(examQuestions.length - 1, prev + 1))}
                disabled={currentIndex === examQuestions.length - 1}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Câu tiếp theo
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Question Navigation Matrix */}
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-3">
                Danh Sách Câu Hỏi
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {examQuestions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = currentIndex === idx;
                  const isCorrect = selectedAnswers[q.id] === q.correctAnswer;

                  let btnColor = 'bg-white border-slate-200 text-slate-700 hover:border-emerald-400';

                  if (isSubmitted) {
                    btnColor = isCorrect
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-rose-500 text-white font-bold';
                  } else if (isCurrent) {
                    btnColor = 'bg-emerald-600 text-white font-bold shadow-sm';
                  } else if (isAnswered) {
                    btnColor = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-lg border text-xs font-mono transition-all ${btnColor}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Instructions summary */}
              <div className="mt-5 pt-4 border-t border-slate-200 space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
                  <span>Đang chọn / Đã trả lời</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-white border border-slate-300 inline-block"></span>
                  <span>Chưa trả lời</span>
                </div>
              </div>

              {!isSubmitted && (
                <button
                  onClick={handleSubmit}
                  className="w-full mt-5 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  Nộp bài thi
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
