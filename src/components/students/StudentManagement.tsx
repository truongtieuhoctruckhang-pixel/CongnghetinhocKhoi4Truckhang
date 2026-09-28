import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Download, 
  Trash2, 
  Eye, 
  Edit3, 
  Phone, 
  Award, 
  CheckCircle2, 
  GraduationCap 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { StudentModal } from './StudentModal';
import { StudentDetailDrawer } from './StudentDetailDrawer';

export const StudentManagement: React.FC = () => {
  const { 
    students, 
    deleteStudent, 
    selectedGrade, 
    searchQuery,
    showToast 
  } = useApp();

  const [classFilter, setClassFilter] = useState<string>('all');
  const [selectedStudentForDrawer, setSelectedStudentForDrawer] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filter logic
  const filteredStudents = students.filter(std => {
    // If selectedGrade is active, filter by first digit of class
    if (selectedGrade !== 'all') {
      const classGrade = Number(std.class.charAt(0));
      if (classGrade !== selectedGrade) return false;
    }

    if (classFilter !== 'all' && std.class !== classFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        std.fullName.toLowerCase().includes(q) ||
        std.code.toLowerCase().includes(q) ||
        std.class.toLowerCase().includes(q) ||
        std.parentPhone.toLowerCase().includes(q)
      );
    }

    return true;
  });

  // Calculate Metrics
  const totalStudents = students.length;
  const excellentStudents = students.filter(s => s.conduct === 'Hoàn thành xuất sắc').length;
  const avgOverallScore = totalStudents > 0 
    ? (students.reduce((acc, s) => acc + s.avgScore, 0) / totalStudents).toFixed(1)
    : '9.0';
  const avgCompletionRate = totalStudents > 0
    ? Math.round(students.reduce((acc, s) => acc + s.completionRate, 0) / totalStudents)
    : 95;

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      'STT',
      'Mã Học Sinh',
      'Họ và Tên',
      'Lớp',
      'Giới Tính',
      'Ngày Sinh',
      'Điểm TB',
      'Tỉ Lệ Hoàn Thành (%)',
      'Đánh Giá Rèn Luyện',
      'Phụ Huynh',
      'Số Điện Thoại',
      'Địa Chỉ'
    ];

    const rows = filteredStudents.map((s, idx) => [
      idx + 1,
      `"${s.code}"`,
      `"${s.fullName}"`,
      `"${s.class}"`,
      `"${s.gender}"`,
      `"${s.dob}"`,
      s.avgScore,
      s.completionRate,
      `"${s.conduct}"`,
      `"${s.parentName}"`,
      `"${s.parentPhone}"`,
      `"${s.address}"`
    ]);

    // Prepend UTF-8 BOM (\uFEFF) so Excel displays Vietnamese correctly
    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Danh_sach_hoc_sinh_TH_Truc_Khang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Đã xuất bảng điểm và danh sách học sinh ra file Excel (.CSV)!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Tổng số học sinh</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalStudents}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Đã chuẩn hóa hồ sơ dữ liệu</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Học sinh Xuất sắc</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
            {excellentStudents}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Chiếm {Math.round((excellentStudents / (totalStudents || 1)) * 100)}% tổng số</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Điểm trung bình toàn khối</span>
            <GraduationCap className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-teal-700 font-mono tabular-nums">
            {avgOverallScore} <span className="text-xs text-slate-500 font-normal">/ 10</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Chất lượng học tập tốt</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Tỉ lệ hoàn thành bài tập</span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {avgCompletionRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Duy trì nề nếp tự rèn</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Class Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
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
              {cls === 'all' ? 'Tất cả các lớp' : `Lớp ${cls}`}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-colors"
            title="Tải bảng điểm và danh sách học sinh dạng Excel (.csv)"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm học sinh mới</span>
          </button>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Không tìm thấy học sinh</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Không có học sinh nào phù hợp với bộ lọc hiện tại. Thử đổi lớp hoặc tìm kiếm tên khác.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Học Sinh</th>
                  <th className="py-3.5 px-3">Lớp</th>
                  <th className="py-3.5 px-3">Giới Tính / Ngày Sinh</th>
                  <th className="py-3.5 px-3">Liên Hệ Phụ Huynh</th>
                  <th className="py-3.5 px-3 text-center">Điểm TB</th>
                  <th className="py-3.5 px-3">Tiến Độ Tự Học</th>
                  <th className="py-3.5 px-3">Rèn Luyện</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((std) => {
                  const initials = std.fullName.split(' ').slice(-1)[0]?.slice(0, 2).toUpperCase() || 'HS';
                  return (
                    <tr 
                      key={std.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                              {std.fullName}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {std.code}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                          {std.class}
                        </span>
                      </td>

                      {/* Gender & DOB */}
                      <td className="py-3 px-3 text-slate-600">
                        <div>{std.gender}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{std.dob}</div>
                      </td>

                      {/* Parent & Phone */}
                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-medium">{std.parentName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{std.parentPhone}</span>
                        </div>
                      </td>

                      {/* Avg Score */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-extrabold text-sm font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          {std.avgScore}
                        </span>
                      </td>

                      {/* Completion Rate */}
                      <td className="py-3 px-3">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[11px] font-mono text-slate-600">
                            <span>{std.completionRate}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${std.completionRate}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Conduct */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                          std.conduct === 'Hoàn thành xuất sắc'
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : 'text-teal-700 bg-teal-50 border-teal-200'
                        }`}>
                          {std.conduct.replace('Hoàn thành ', '')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedStudentForDrawer(std)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title="Xem chi tiết học bạ & bảng điểm"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setEditingStudent(std)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Chỉnh sửa thông tin học sinh"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => deleteStudent(std.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Xóa học sinh này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals & Drawers */}
      {selectedStudentForDrawer && (
        <StudentDetailDrawer
          student={selectedStudentForDrawer}
          onClose={() => setSelectedStudentForDrawer(null)}
          onEdit={() => {
            setEditingStudent(selectedStudentForDrawer);
            setSelectedStudentForDrawer(null);
          }}
        />
      )}

      {isCreateOpen && (
        <StudentModal
          onClose={() => setIsCreateOpen(false)}
        />
      )}

      {editingStudent && (
        <StudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
        />
      )}
    </div>
  );
};
