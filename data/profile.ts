export type Subject = {
  code: string;
  name: string;
  credits: number;
  description: string;
};

export type Interest = {
  label: string;
  emoji: string;
};

export type StudentProfile = {
  name: string;
  branch: string;
  studentId: string;
  yearSem: string;
  github: string;
  subjects: Subject[];
  interests: Interest[];
};

export const studentProfile: StudentProfile = {
  name: 'Chaiyut Tavon',
  branch: 'Computer and Information Science',
  studentId: '2024-CIS-8492',
  yearSem: 'Year 3 • Sem 1',
  github: 'chaiyut-kun',
  subjects: [
    {
      code: 'IN405109',
      name: 'Hybrid Mobile Application Programming',
      credits: 3.0,
      description: 'Cross-platform architecture, responsive mobile UX, and modern framework integration.',
    },
  ],
  interests: [
    { label: 'Programming', emoji: '💻' },
    { label: 'Software Engineering', emoji: '⚙️' },
    { label: 'Networking', emoji: '🌐' },
    { label: 'Badminton', emoji: '🏸' },
    { label: 'Football', emoji: '⚽' },
  ],
};
