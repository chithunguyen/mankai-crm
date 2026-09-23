export const formatVND = (n: number) => n.toLocaleString('vi-VN') + 'đ'

/** Bỏ dấu tiếng Việt + lowercase để tìm kiếm "nguyen" khớp "Nguyễn". */
export const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim()
