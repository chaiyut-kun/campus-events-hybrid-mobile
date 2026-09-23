import { RegistrationForm, RegistrationErrors } from '../types/registration';

/**
 * Validates a registration form and returns per-field error messages.
 * Returns an empty object when every required field is valid.
 * `notes` is optional and never validated.
 */
export function validateRegistration(form: RegistrationForm): RegistrationErrors {
  const errors: RegistrationErrors = {};

  if (!form.fullName.trim()) {
    errors.fullName = 'กรุณากรอกชื่อ-นามสกุล';
  }

  if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'อีเมลไม่ถูกต้อง';
  }

  if (!form.studentId.trim()) {
    errors.studentId = 'กรุณากรอกรหัสนักศึกษา';
  }

  if (!form.faculty.trim()) {
    errors.faculty = 'กรุณากรอกคณะ';
  }

  return errors;
}
