import { studentProfile } from '../../data/profile';

describe('Unit Test: StudentProfile Data', () => {
  it('should have valid student information matching instruction-1.md', () => {
    expect(studentProfile.name).toBe('Chaiyut Tavon');
    expect(studentProfile.branch).toBe('Computer and Information Science');
    expect(studentProfile.github).toBe('chaiyut-kun');
    expect(studentProfile.studentId).toBeDefined();
    expect(studentProfile.yearSem).toBeDefined();
  });

  it('should contain enrolled subject with valid credits and description', () => {
    expect(studentProfile.subjects.length).toBeGreaterThan(0);
    const subject = studentProfile.subjects[0];
    expect(subject.code).toBe('IN405109');
    expect(subject.name).toBe('Hybrid Mobile Application Programming');
    expect(subject.credits).toBe(3.0);
    expect(subject.description).toBeTruthy();
  });

  it('should list all 5 specified interests with emojis and labels', () => {
    expect(studentProfile.interests).toHaveLength(5);
    const labels = studentProfile.interests.map((i) => i.label);
    expect(labels).toEqual(
      expect.arrayContaining([
        'Programming',
        'Software Engineering',
        'Networking',
        'Badminton',
        'Football',
      ])
    );

    studentProfile.interests.forEach((interest) => {
      expect(interest.emoji).toBeTruthy();
      expect(interest.label).toBeTruthy();
    });
  });
});
