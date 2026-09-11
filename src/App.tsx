import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { BiblicalLevel, VideoLesson, BookItem, DebateTopic, DebateReply, FeedAnnouncement, Teacher } from './types';
import { 
  INITIAL_LESSONS, INITIAL_BOOKS, INITIAL_DEBATES, INITIAL_ANNOUNCEMENTS, INITIAL_TEACHERS 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { VirtualClassroom } from './components/VirtualClassroom';
import { DigitalLibrary } from './components/DigitalLibrary';
import { DebateRoom } from './components/DebateRoom';
import { AnnouncementsFeed } from './components/AnnouncementsFeed';
import { AttendanceManager } from './components/AttendanceManager';
import { AttendanceModal } from './components/AttendanceModal';
import { AuthModal } from './components/AuthModal';
import { RegisterGate } from './components/RegisterGate';
import { SalomaoManagementPanel } from './components/SalomaoManagementPanel';
import { 
  BookOpen, Video, MessageSquare, Bell, UserCheck, 
  LogIn, CheckCircle, Clock, ShieldCheck, Heart, Sparkles, Shield 
} from 'lucide-react';

function MainApp() {
  const { user, isAuthenticated } = useAuth();
  const { activeRecord, openPresenceModal } = useAttendance();

  const [currentTab, setCurrentTab] = useState<'sala' | 'biblioteca' | 'debates' | 'feed' | 'presenca' | 'gestao'>('sala');
  const [selectedLevel, setSelectedLevel] = useState<BiblicalLevel | 'todos'>('todos');

  // Teachers State (Salomão Muanjita + registered teachers)
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const saved = localStorage.getItem('biblical_academy_teachers');
      return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
    } catch {
      return INITIAL_TEACHERS;
    }
  });

  // Interactive state initialized with rich data
  const [lessons, setLessons] = useState<VideoLesson[]>(() => {
    try {
      const saved = localStorage.getItem('biblical_academy_lessons');
      return saved ? JSON.parse(saved) : INITIAL_LESSONS;
    } catch {
      return INITIAL_LESSONS;
    }
  });

  const [books, setBooks] = useState<BookItem[]>(() => {
    try {
      const saved = localStorage.getItem('biblical_academy_books');
      return saved ? JSON.parse(saved) : INITIAL_BOOKS;
    } catch {
      return INITIAL_BOOKS;
    }
  });

  const [debates, setDebates] = useState<DebateTopic[]>(() => {
    try {
      const saved = localStorage.getItem('biblical_academy_debates');
      return saved ? JSON.parse(saved) : INITIAL_DEBATES;
    } catch {
      return INITIAL_DEBATES;
    }
  });

  const [announcements, setAnnouncements] = useState<FeedAnnouncement[]>(() => {
    try {
      const saved = localStorage.getItem('biblical_academy_feed');
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  // Handlers for teachers
  const handleAddTeacher = (teacher: Teacher) => {
    const updated = [...teachers, teacher];
    setTeachers(updated);
    localStorage.setItem('biblical_academy_teachers', JSON.stringify(updated));
  };

  const handleRemoveTeacher = (teacherId: string) => {
    const updated = teachers.filter(t => t.id !== teacherId);
    setTeachers(updated);
    localStorage.setItem('biblical_academy_teachers', JSON.stringify(updated));
  };

  // Handlers for content
  const handleAddLesson = (lesson: VideoLesson) => {
    const updated = [lesson, ...lessons];
    setLessons(updated);
    localStorage.setItem('biblical_academy_lessons', JSON.stringify(updated));
  };

  const handleRemoveLesson = (lessonId: string) => {
    const updated = lessons.filter(l => l.id !== lessonId);
    setLessons(updated);
    localStorage.setItem('biblical_academy_lessons', JSON.stringify(updated));
  };

  const handleAddBook = (book: BookItem) => {
    const updated = [book, ...books];
    setBooks(updated);
    localStorage.setItem('biblical_academy_books', JSON.stringify(updated));
  };

  const handleAddDebate = (debate: DebateTopic) => {
    const updated = [debate, ...debates];
    setDebates(updated);
    localStorage.setItem('biblical_academy_debates', JSON.stringify(updated));
  };

  const handleAddDebateReply = (debateId: string, reply: DebateReply) => {
    const updated = debates.map(d => {
      if (d.id === debateId) {
        return {
          ...d,
          replies: [...d.replies, reply]
        };
      }
      return d;
    });
    setDebates(updated);
    localStorage.setItem('biblical_academy_debates', JSON.stringify(updated));
  };

  const handleAddAnnouncement = (ann: FeedAnnouncement) => {
    const updated = [ann, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('biblical_academy_feed', JSON.stringify(updated));
  };

  // MANDATORY REGISTRATION REQUIREMENT:
  // "é obrigatório se registar antes de entrar."
  if (!isAuthenticated || !user) {
    return <RegisterGate teachers={teachers} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        selectedLevel={selectedLevel}
        onSelectLevel={setSelectedLevel}
      />

      {/* Floating Entry Reminder Banner if not yet checked in */}
      {!activeRecord && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-medium">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Atenção ao Registro de Presença:</strong> Toda vez que você entra na plataforma, registre sua entrada para acumular horas de formação teológica.
              </span>
            </div>
            <button
              onClick={openPresenceModal}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs shadow-xs shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              Marcar Presença de Entrada
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {currentTab === 'sala' && (
          <VirtualClassroom
            lessons={lessons}
            onAddLesson={handleAddLesson}
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
            teachers={teachers}
          />
        )}

        {currentTab === 'biblioteca' && (
          <DigitalLibrary
            books={books}
            onAddBook={handleAddBook}
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
          />
        )}

        {currentTab === 'debates' && (
          <DebateRoom
            debates={debates}
            onAddDebate={handleAddDebate}
            onAddReply={handleAddDebateReply}
            selectedLevel={selectedLevel}
          />
        )}

        {currentTab === 'feed' && (
          <AnnouncementsFeed
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            selectedLevel={selectedLevel}
          />
        )}

        {currentTab === 'presenca' && (
          <AttendanceManager />
        )}

        {currentTab === 'gestao' && (
          <SalomaoManagementPanel
            teachers={teachers}
            onAddTeacher={handleAddTeacher}
            onRemoveTeacher={handleRemoveTeacher}
            lessons={lessons}
            onAddLesson={handleAddLesson}
            onRemoveLesson={handleRemoveLesson}
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            onPublishAnnouncement={handleAddAnnouncement}
            books={books}
            onAddBook={handleAddBook}
            onAddDebate={handleAddDebate}
          />
        )}
      </main>

      {/* Modals */}
      <AttendanceModal />
      <AuthModal />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-200">Academia Bíblica EAD</div>
              <div className="text-[11px] text-slate-500">
                Formação Teológica a Distância nos Níveis Iniciante, Intermediário e Avançado
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span>Registro de Entrada & Saída Ativo</span>
            <span>•</span>
            <span>Chamadas de Vídeo via WhatsApp</span>
            <span>•</span>
            <span>Autenticação WhatsApp & Facebook</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AttendanceProvider>
        <MainApp />
      </AttendanceProvider>
    </AuthProvider>
  );
}
