/**
 * Registration form data model for event sign-up.
 * All fields are strings; `notes` is optional content but always present as empty string.
 */
export type RegistrationForm = {
  fullName: string;
  email: string;
  studentId: string;
  faculty: string;
  notes: string;
};

/**
 * Per-field validation errors. Only failed fields are present.
 */
export type RegistrationErrors = Partial<Record<keyof RegistrationForm, string>>;

/**
 * Complete registration record after successful submission.
 */
export type RegistrationSubmission = {
  eventId: string;
  eventTitle: string;
  formData: RegistrationForm;
  registeredAt: string;
};
