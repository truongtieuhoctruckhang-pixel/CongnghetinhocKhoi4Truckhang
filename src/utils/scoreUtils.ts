/**
 * Utility functions for standardized educational score rounding and formatting.
 * Tuân thủ quy tắc làm tròn điểm trong giáo dục (Bộ Giáo dục và Đào tạo / Thông tư 27):
 * - Làm tròn đến 1 chữ số thập phân (loại trừ sai số dấu phẩy động: 7.800000000000001 -> 7.8, 5.6000000000000005 -> 5.6)
 * - Giới hạn điểm hợp lệ thang 10: từ 0 đến 10
 * - Đồng bộ cách hiển thị điểm số giữa phía Giáo viên và phía Học sinh
 */

/**
 * Làm tròn điểm số về 1 chữ số thập phân (hoặc số nguyên).
 * Triệt tiêu hoàn toàn sai số phép chia dấu phẩy động như 7.800000000000001.
 *
 * @param score Điểm số thô (number, string, null, undefined)
 * @returns Điểm số đã làm tròn thang 10 (0 - 10) hoặc null nếu không có điểm
 */
export function roundEducationalScore(score: number | string | null | undefined): number | null {
  if (score === null || score === undefined || score === '' || score === '-') return null;
  const num = typeof score === 'number' ? score : parseFloat(String(score));
  if (isNaN(num)) return null;
  const clamped = Math.max(0, Math.min(10, num));
  // Làm tròn chuẩn toán học đến 1 chữ số thập phân
  return Math.round(clamped * 10) / 10;
}

/**
 * Tính điểm thi từ số câu đúng và tổng số câu hỏi theo thang điểm 10,
 * tự động làm tròn chuẩn 1 chữ số thập phân theo tiêu chuẩn giáo dục.
 */
export function calculateExamScore(correctCount: number, totalQuestions: number): number {
  if (totalQuestions <= 0) return 0;
  const rawScore = (correctCount / totalQuestions) * 10;
  return roundEducationalScore(rawScore) ?? 0;
}

/**
 * Định dạng chuỗi hiển thị điểm số gọn gàng (ví dụ: "7.8", "10", "5.6", "8").
 */
export function formatEducationalScore(score: number | string | null | undefined): string {
  const rounded = roundEducationalScore(score);
  if (rounded === null) return '-';
  return String(rounded);
}

/**
 * Định dạng chuỗi điểm số kèm thang điểm 10 (ví dụ: "7.8 / 10", "10 / 10", "5.6 / 10").
 */
export function formatScoreText(score: number | string | null | undefined): string {
  const formatted = formatEducationalScore(score);
  if (formatted === '-') return '- / 10';
  return `${formatted} / 10`;
}
