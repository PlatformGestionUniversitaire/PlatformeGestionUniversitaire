export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headOfDepartment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  departmentId: string;
  description: string;
  prerequisites: string[];
}

export interface Group {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  semester: number;
  studentCount: number;
  maxCapacity: number;
  subjects: string[];
}

export interface Timetable {
  id: string;
  departmentId: string;
  groupId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number; // 0 = Lundi, 6 = Dimanche
  startTime: string;
  endTime: string;
  roomId: string;
  type: 'COURSE' | 'TD' | 'TP' | 'EXAM';
  status: 'PROPOSED' | 'VALIDATED' | 'REJECTED' | 'CONFLICT';
  createdAt: Date;
  updatedAt: Date;
}

export interface TimetableConflict {
  id: string;
  type: 'TEACHER_CONFLICT' | 'ROOM_CONFLICT' | 'GROUP_CONFLICT';
  description: string;
  affectedTimetables: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestedSolution?: string;
}

export interface Room {
  id: string;
  name: string;
  code: string;
  capacity: number;
  type: 'AMPHITHEATER' | 'CLASSROOM' | 'LAB' | 'OFFICE';
  equipment: string[];
  isAvailable: boolean;
  departmentId?: string;
}

export interface MakeupSession {
  id: string;
  subjectId: string;
  groupId: string;
  teacherId: string;
  originalDate: Date;
  makeupDate: Date;
  reason: string;
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  roomId: string;
  duration: number; // en minutes
}

export interface DepartmentStats {
  totalStudents: number;
  totalTeachers: number;
  totalSubjects: number;
  totalGroups: number;
  absenteeismRate: number;
  averageGrade: number;
  roomOccupancyRate: number;
  conflictsCount: number;
}

export interface StudentPerformance {
  studentId: string;
  studentName: string;
  groupId: string;
  subjectPerformances: SubjectPerformance[];
  overallAverage: number;
  attendanceRate: number;
  rank: number;
}

export interface SubjectPerformance {
  subjectId: string;
  subjectName: string;
  average: number;
  attendanceRate: number;
  grades: Grade[];
}

export interface Grade {
  id: string;
  value: number;
  coefficient: number;
  type: 'EXAM' | 'TEST' | 'PROJECT' | 'PARTICIPATION';
  date: Date;
}

export interface AbsenceReport {
  date: string;
  totalAbsences: number;
  absenteeismRate: number;
  bySubject: { [subjectId: string]: number };
  byGroup: { [groupId: string]: number };
}