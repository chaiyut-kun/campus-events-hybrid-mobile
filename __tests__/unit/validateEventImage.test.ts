import { validateEventImage } from '../../utils/validateEventImage';

describe('Unit Test: validateEventImage', () => {
  it('fails when uri is null or empty', () => {
    expect(validateEventImage(null).valid).toBe(false);
    expect(validateEventImage(null).error).toBe('กรุณาเลือกหรือถ่ายภาพประกอบกิจกรรม');

    expect(validateEventImage('').valid).toBe(false);
  });

  it('fails when file size exceeds 5MB limit', () => {
    const oversizedBytes = 6 * 1024 * 1024; // 6 MB
    const result = validateEventImage('file://photo.jpg', oversizedBytes);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('ขนาดไฟล์ภาพต้องไม่เกิน 5 MB');
  });

  it('fails when file extension is not supported', () => {
    const result = validateEventImage('file://document.pdf', 1024);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('ไม่รองรับ');
  });

  it('passes when valid image URI and size are provided', () => {
    const resultJpg = validateEventImage('file://photo.jpg', 1024 * 500);
    expect(resultJpg.valid).toBe(true);
    expect(resultJpg.error).toBeUndefined();

    const resultPng = validateEventImage('file://photo.png?param=123', 1024 * 1024);
    expect(resultPng.valid).toBe(true);

    const resultWebp = validateEventImage('file://photo.webp', 1024 * 800);
    expect(resultWebp.valid).toBe(true);
  });
});
