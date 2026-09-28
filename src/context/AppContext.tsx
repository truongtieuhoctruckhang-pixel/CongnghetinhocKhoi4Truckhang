import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MainTab, 
  Question, 
  Exam, 
  Homework, 
  Student, 
  ExamResult, 
  HomeworkSubmission 
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_QUESTIONS, 
  INITIAL_EXAMS, 
  INITIAL_HOMEWORK 
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  selectedGrade: number | 'all';
  setSelectedGrade: (grade: number | 'all') => void;
  selectedClass: string;
  setSelectedClass: (cls: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Data
  students: Student[];
  questions: Question[];
  exams: Exam[];
  homeworks: Homework[];
  examResults: ExamResult[];
  
  // Operations
  addExam: (exam: Omit<Exam, 'id' | 'createdAt' | 'submissionsCount'>) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  
  addHomework: (hw: Omit<Homework, 'id' | 'submissions'>) => void;
  updateHomework: (id: string, updates: Partial<Homework>) => void;
  gradeHomeworkSubmission: (homeworkId: string, submissionId: string, score: number, feedback: string) => void;
  remindStudentHomework: (homeworkId: string, studentName: string) => void;
  
  addQuestion: (q: Omit<Question, 'id' | 'createdAt'>) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  
  addStudent: (s: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  submitExamResult: (result: Omit<ExamResult, 'id' | 'submittedAt'>) => void;
  
  // Toast notifications
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'eduplay_thqh_students_v1',
  QUESTIONS: 'eduplay_thqh_questions_v1',
  EXAMS: 'eduplay_thqh_exams_v1',
  HOMEWORKS: 'eduplay_thqh_homeworks_v1',
  RESULTS: 'eduplay_thqh_results_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<MainTab>('exams');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent States with Fallback to INITIAL
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXAMS);
      return saved ? JSON.parse(saved) : INITIAL_EXAMS;
    } catch {
      return INITIAL_EXAMS;
    }
  });

  const [homeworks, setHomeworks] = useState<Homework[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOMEWORKS);
      return saved ? JSON.parse(saved) : INITIAL_HOMEWORK;
    } catch {
      return INITIAL_HOMEWORK;
    }
  });

  const [examResults, setExamResults] = useState<ExamResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESULTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [exams]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HOMEWORKS, JSON.stringify(homeworks));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [homeworks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(examResults));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [examResults]);

  // Toast dispatch
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Exam Operations
  const addExam = (examData: Omit<Exam, 'id' | 'createdAt' | 'submissionsCount'>) => {
    const newExam: Exam = {
      ...examData,
      id: `exam-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      submissionsCount: 0,
      avgScore: undefined,
    };
    setExams(prev => [newExam, ...prev]);
    showToast(`Đã tạo đề kiểm tra "${newExam.title}" thành công!`, 'success');
  };

  const updateExam = (id: string, updates: Partial<Exam>) => {
    setExams(prev => prev.map(ex => ex.id === id ? { ...ex, ...updates } : ex));
    showToast('Cập nhật thông tin đề kiểm tra thành công!', 'info');
  };

  const deleteExam = (id: string) => {
    const target = exams.find(e => e.id === id);
    setExams(prev => prev.filter(e => e.id !== id));
    showToast(`Đã xóa đề kiểm tra "${target?.title || id}"`, 'info');
  };

  // Homework Operations
  const addHomework = (hwData: Omit<Homework, 'id' | 'submissions'>) => {
    // Generate empty submissions for all students in targetClass (or matching grade)
    const matchingStudents = students.filter(s => s.class === hwData.targetClass || hwData.targetClass === 'Tất cả');
    const initialSubmissions: HomeworkSubmission[] = matchingStudents.map(std => ({
      id: `sub-${std.id}-${Date.now()}`,
      studentId: std.id,
      studentName: std.fullName,
      studentClass: std.class,
      submittedAt: '',
      status: 'missing',
      contentNote: 'Chưa nộp bài'
    }));

    const newHw: Homework = {
      ...hwData,
      id: `hw-${Date.now()}`,
      submissions: initialSubmissions
    };
    setHomeworks(prev => [newHw, ...prev]);
    showToast(`Đã giao bài tập về nhà "${newHw.title}" cho lớp ${newHw.targetClass}!`, 'success');
  };

  const updateHomework = (id: string, updates: Partial<Homework>) => {
    setHomeworks(prev => prev.map(hw => hw.id === id ? { ...hw, ...updates } : hw));
    showToast('Cập nhật bài tập về nhà thành công!', 'info');
  };

  const gradeHomeworkSubmission = (
    homeworkId: string, 
    submissionId: string, 
    score: number, 
    feedback: string
  ) => {
    setHomeworks(prev => prev.map(hw => {
      if (hw.id !== homeworkId) return hw;
      const updatedSubmissions = hw.submissions.map(sub => {
        if (sub.id === submissionId) {
          return {
            ...sub,
            score,
            feedback,
            status: 'graded' as const
          };
        }
        return sub;
      });
      return {
        ...hw,
        submissions: updatedSubmissions
      };
    }));
    showToast('Đã lưu điểm và nhận xét của giáo viên!', 'success');
  };

  const remindStudentHomework = (_homeworkId: string, studentName: string) => {
    showToast(`Đã gửi thông báo nhắc nhở làm bài tập tới phụ huynh em ${studentName}!`, 'info');
  };

  // Question Bank Operations
  const addQuestion = (qData: Omit<Question, 'id' | 'createdAt'>) => {
    const newQ: Question = {
      ...qData,
      id: `q-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setQuestions(prev => [newQ, ...prev]);
    showToast(`Đã thêm câu hỏi mã [${newQ.code}] vào Ngân hàng câu hỏi!`, 'success');
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
    showToast('Cập nhật câu hỏi thành công!', 'info');
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    showToast('Đã xóa câu hỏi khỏi ngân hàng.', 'info');
  };

  // Student Operations
  const addStudent = (sData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...sData,
      id: `std-${Date.now()}`,
    };
    setStudents(prev => [newStudent, ...prev]);
    showToast(`Đã thêm hồ sơ học sinh ${newStudent.fullName} (Lớp ${newStudent.class})!`, 'success');
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showToast('Cập nhật hồ sơ học sinh thành công!', 'info');
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    showToast('Đã xóa học sinh khỏi danh sách lớp.', 'info');
  };

  // Exam Result Submission
  const submitExamResult = (resultData: Omit<ExamResult, 'id' | 'submittedAt'>) => {
    const newResult: ExamResult = {
      ...resultData,
      id: `res-${Date.now()}`,
      submittedAt: new Date().toLocaleString('vi-VN')
    };
    setExamResults(prev => [newResult, ...prev]);

    // Update submissionsCount and average score in exams
    setExams(prev => prev.map(ex => {
      if (ex.id === resultData.examId) {
        const currentCount = ex.submissionsCount || 0;
        const currentAvg = ex.avgScore ?? resultData.score;
        const newAvg = Number(((currentAvg * currentCount + resultData.score) / (currentCount + 1)).toFixed(1));
        return {
          ...ex,
          submissionsCount: currentCount + 1,
          avgScore: newAvg
        };
      }
      return ex;
    }));

    showToast(`Đã hoàn thành bài kiểm tra! Điểm số: ${resultData.score}/10`, 'success');
  };

  const resetAllData = () => {
    setStudents(INITIAL_STUDENTS);
    setQuestions(INITIAL_QUESTIONS);
    setExams(INITIAL_EXAMS);
    setHomeworks(INITIAL_HOMEWORK);
    setExamResults([]);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.EXAMS);
    localStorage.removeItem(STORAGE_KEYS.HOMEWORKS);
    localStorage.removeItem(STORAGE_KEYS.RESULTS);
    showToast('Đã khôi phục dữ liệu mẫu EduPlay THQH Pro!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedGrade,
        setSelectedGrade,
        selectedClass,
        setSelectedClass,
        searchQuery,
        setSearchQuery,
        students,
        questions,
        exams,
        homeworks,
        examResults,
        addExam,
        updateExam,
        deleteExam,
        addHomework,
        updateHomework,
        gradeHomeworkSubmission,
        remindStudentHomework,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        addStudent,
        updateStudent,
        deleteStudent,
        submitExamResult,
        toasts,
        showToast,
        removeToast,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
