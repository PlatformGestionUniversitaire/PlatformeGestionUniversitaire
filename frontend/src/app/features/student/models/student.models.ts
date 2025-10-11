export interface StudentProfile {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  program: string;
  year: number;
  semester: number;
  profileImage?: string;
  enrollmentDate: Date;
}

export interface StudentTimetable {
  id: string;
  courseId: string;
  courseName: string;
  teacherName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  classroom: string;
  courseType: 'cours' | 'td' | 'tp';
  isModified?: boolean;
  isCancelled?: boolean;
}

export interface StudentAbsence {
  id: string;
  courseId: string;
  courseName: string;
  date: Date;
  startTime: string;
  endTime: string;
  teacherName: string;
  isJustified: boolean;
  justificationDocument?: string;
  excuseRequest?: AbsenceExcuse;
  createdAt: Date;
}

export interface AbsenceExcuse {
  id: string;
  absenceId: string;
  reason: string;
  document?: File;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewDate?: Date;
  reviewComment?: string;
}

export interface StudentGrade {
  id: string;
  courseId: string;
  courseName: string;
  examType: 'ds' | 'exam' | 'tp' | 'project';
  grade: number;
  maxGrade: number;
  coefficient: number;
  date: Date;
  semester: number;
  teacherName: string;
  comments?: string;
}

export interface StudentStatistics {
  overallGPA: number;
  semesterGPA: number;
  totalAbsences: number;
  justifiedAbsences: number;
  unjustifiedAbsences: number;
  absenteeismRate: number;
  isAtRiskOfElimination: boolean;
  gradesBySubject: { [subject: string]: SubjectGrades };
  attendanceBySubject: { [subject: string]: SubjectAttendance };
}

export interface SubjectGrades {
  average: number;
  grades: StudentGrade[];
  coefficient: number;
}

export interface SubjectAttendance {
  totalSessions: number;
  attendedSessions: number;
  absences: number;
  attendanceRate: number;
}

export interface StudentNotification {
  id: string;
  type: 'timetable_change' | 'course_cancellation' | 'absence_recorded' | 'grade_published' | 'elimination_warning' | 'message_received';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface InternalMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  recipientName: string;
  subject: string;
  content: string;
  attachments?: MessageAttachment[];
  sentAt: Date;
  readAt?: Date;
  isRead: boolean;
  threadId?: string;
  parentMessageId?: string;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
}

export interface MessageThread {
  id: string;
  subject: string;
  participants: MessageParticipant[];
  lastMessage: InternalMessage;
  messagesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageParticipant {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface CreateMessageRequest {
  recipientId: string;
  subject: string;
  content: string;
  attachments?: File[];
  parentMessageId?: string;
}

export interface StudentDashboardData {
  profile: StudentProfile;
  upcomingClasses: StudentTimetable[];
  recentGrades: StudentGrade[];
  unreadNotifications: StudentNotification[];
  weeklyTimetable: StudentTimetable[];
  statistics: StudentStatistics;
  pendingExcuses: AbsenceExcuse[];
}