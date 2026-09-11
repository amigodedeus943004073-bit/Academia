export type BiblicalLevel = 'iniciante' | 'intermediario' | 'avancado';

export type UserRole = 'aluno' | 'professor' | 'responsavel';

export interface Teacher {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  whatsapp?: string;
  email?: string;
  subjects: string[];
  levelTarget: BiblicalLevel | 'todos';
  registeredBy: string;
  createdAt: string;
  active: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  authProvider: 'whatsapp' | 'facebook' | 'diretoria';
  whatsappNumber?: string;
  countryCode?: string;
  countryName?: string;
  isVerifiedWhatsApp?: boolean;
  verifiedAt?: string;
  facebookId?: string;
  avatar: string;
  role: UserRole;
  level: BiblicalLevel;
  registeredLevel: BiblicalLevel;
  advancedAccessGranted?: boolean;
  congregation?: string;
  city?: string;
  joinedAt: string;
  totalHoursStudied: number;
  isAuthorMaster?: boolean;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userLevel: BiblicalLevel;
  role: UserRole;
  date: string; // YYYY-MM-DD
  checkInTime: string; // ISO string or HH:mm
  checkOutTime?: string; // ISO string or HH:mm
  durationMinutes?: number;
  status: 'online' | 'finalizado' | 'ausente';
  notes?: string;
}

export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorTitle: string;
  level: BiblicalLevel;
  category: string;
  duration: string;
  videoUrl: string; // embed or video stream url or blob url
  videoType?: 'file' | 'embed' | 'stream';
  fileName?: string;
  fileSize?: string;
  thumbnail: string;
  isLive: boolean;
  liveStatus?: 'offline' | 'live' | 'scheduled';
  scheduledFor?: string;
  viewersCount?: number;
  tags: string[];
  referencePassages: string[];
  attachedFiles?: Array<{ name: string; size: string; url: string }>;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  level: BiblicalLevel | 'todos';
  category: string;
  pages: number;
  coverImage: string;
  synopsis: string;
  downloadUrl?: string;
  readingExcerpt?: string;
  publishedYear: string;
  addedBy: string;
  addedAt: string;
}

export interface DebateReply {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface DebateTopic {
  id: string;
  title: string;
  question: string;
  category: string;
  level: BiblicalLevel | 'geral';
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  createdAt: string;
  likes: number;
  likedByMe?: boolean;
  replies: DebateReply[];
  hasWhatsAppVideoCall: boolean;
  whatsAppRoomLink?: string;
  whatsAppContact?: string;
}

export interface FeedAnnouncement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  tag: 'Aviso Urgente' | 'Evento' | 'Live Especial' | 'Novo Material' | 'Devocional';
  pinned: boolean;
  likes: number;
  likedByMe?: boolean;
  imageUrl?: string;
  levelTarget?: BiblicalLevel | 'todos';
  comments: Array<{
    id: string;
    author: string;
    authorAvatar: string;
    content: string;
    date: string;
  }>;
}
