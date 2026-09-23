import { validateRegistration } from '../../utils/validateRegistration';
import { RegistrationForm } from '../../types/registration';

describe('Unit Test: validateRegistration', () => {
  const validForm: RegistrationForm = {
    fullName: 'Chaiyut Tavon',
    email: 'chaiyut@university.ac.th',
    studentId: '2024-CIS-8492',
    faculty: 'Computer and Information Science',
    notes: 'Excited to join!',
  };

  it('returns no errors for completely valid form', () => {
    const errors = validateRegistration(validForm);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('validates required fields: fullName, studentId, and faculty', () => {
    const invalidForm: RegistrationForm = {
      fullName: '   ',
      email: 'valid@university.ac.th',
      studentId: '',
      faculty: ' ',
      notes: '',
    };

    const errors = validateRegistration(invalidForm);
    expect(errors.fullName).toBe('กรุณากรอกชื่อ-นามสกุล');
    expect(errors.studentId).toBe('กรุณากรอกรหัสนักศึกษา');
    expect(errors.faculty).toBe('กรุณากรอกคณะ');
  });

  it('validates email format properly', () => {
    const badEmailForm: RegistrationForm = {
      ...validForm,
      email: 'invalid-email-format',
    };

    const errors = validateRegistration(badEmailForm);
    expect(errors.email).toBe('อีเมลไม่ถูกต้อง');
  });

  it('allows notes to be empty because notes is optional', () => {
    const formWithoutNotes: RegistrationForm = {
      ...validForm,
      notes: '',
    };

    const errors = validateRegistration(formWithoutNotes);
    expect(errors.notes).toBeUndefined();
    expect(Object.keys(errors)).toHaveLength(0);
  });
});
