// ─── Auth Types ───────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  subscriptionPlan: "basic" | "premium";
  emailVerified: boolean;
  token: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  profileImageUrl?: string;
}

export interface AuthResponse extends User {}

// ─── Resume Types ─────────────────────────────────────────────
export interface ProfileInfo {
  profilePreviewUrl?: string;
  fullName?: string;
  designation?: string;
  summary?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface WorkExperience {
  company?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Education {
  degree?: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
}

export interface Skill {
  name?: string;
  progress?: number;
}

export interface Project {
  title?: string;
  description?: string;
  github?: string;
  liveDemo?: string;
}

export interface Certification {
  title?: string;
  issuer?: string;
  year?: string;
}

export interface Language {
  name?: string;
  progress?: number;
}

export interface Template {
  theme?: string;
  colourPalette?: string[];
}

export interface Resume {
  _id: string;
  userId: string;
  title: string;
  thumbnailLink?: string;
  profileInfo: ProfileInfo;
  contactInfo: ContactInfo;
  template?: Template;
  workExperiences?: WorkExperience[];
  educations?: Education[];
  skills?: Skill[];
  projects?: Project[];
  certification?: Certification[];
  languages?: Language[];
  interest?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateResumeRequest {
  title: string;
}

// ─── Payment Types ────────────────────────────────────────────
export interface Payment {
  id: string;
  userId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  planType: string;
  createdAt: string;
}

export interface CreateOrderResponse {
  OrderId: string;
  amount: number;
  currency: string;
  receipt: string;
}

// ─── Interview Types ──────────────────────────────────────────
export interface InterviewQuestion {
  questionId: number;
  questionText: string;
  orderIndex: number;
}

export interface InterviewSessionResponse {
  sessionId: number;
  status: "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
  questions: InterviewQuestion[];
}

export interface AnswerResponse {
  questionId: number;
  questionText: string;
  answerTranscript: string;
  score: number;
  feedback: string;
}

export interface InterviewReportQuestionDetail {
  questionText: string;
  answerTranscript: string | null;
  score: number | null;
  feedback: string | null;
}

export interface InterviewReportResponse {
  sessionId: number;
  status: string;
  overallScore: number;
  strengths: string;
  improvements: string;
  summary: string;
  questions: InterviewReportQuestionDetail[];
}

// ─── Template Types ───────────────────────────────────────────
export interface TemplateResponse {
  templates: TemplateItem[];
  isPremium: boolean;
}

export interface TemplateItem {
  id: string;
  name: string;
  thumbnail: string;
  isPremium: boolean;
  theme: string;
  colourPalette: string[];
}