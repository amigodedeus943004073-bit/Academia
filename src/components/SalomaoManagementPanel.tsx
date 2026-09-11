import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { BiblicalLevel, Teacher, VideoLesson, FeedAnnouncement, AttendanceRecord, BookItem, DebateTopic, UserProfile } from '../types';
import { 
  Shield, Users, Video, UserCheck, Bell, Plus, 
  Trash2, Edit3, CheckCircle, Upload, Play, Clock, 
  Phone, Mail, BookOpen, Search, Download, AlertCircle, 
  ExternalLink, Sparkles, FileText, Lock, Key, Check, X,
  MessageCircle, Radio, Tag, Bookmark
} from 'lucide-react';

interface SalomaoManagementPanelProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Teacher) => void;
  onRemoveTeacher: (id: string) => void;
  lessons: VideoLesson[];
  onAddLesson: (lesson: VideoLesson) => void;
  onRemoveLesson: (id: string) => void;
  announcements?: FeedAnnouncement[];
  onAddAnnouncement?: (ann: FeedAnnouncement) => void;
  onPublishAnnouncement?: (ann: FeedAnnouncement) => void;
  books?: BookItem[];
  onAddBook?: (book: BookItem) => void;
  onAddDebate?: (debate: DebateTopic) => void;
}

export const SalomaoManagementPanel: React.FC<SalomaoManagementPanelProps> = ({
  teachers,
  onAddTeacher,
  onRemoveTeacher,
  lessons,
  onAddLesson,
  onRemoveLesson,
  announcements = [],
  onAddAnnouncement,
  onPublishAnnouncement,
  books = [],
  onAddBook,
  onAddDebate
}) => {
  const { user, isSalomaoMuanjita, loginAsSalomaoMuanjita, studentsList, grantAdvancedAccess } = useAuth();
  const { records, todayOnlineCount, activeRecord } = useAttendance();

  const [activeTab, setActiveTab] = useState<'overview' | 'announcements' | 'upload_content' | 'students_access' | 'teachers' | 'students_presence'>('overview');

  // Teacher creation modal state
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [tName, setTName] = useState('');
  const [tTitle, setTTitle] = useState('');
  const [tBio, setTBio] = useState('');
  const [tAvatar, setTAvatar] = useState('');
  const [tWhatsapp, setTWhatsapp] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tSubjects, setTSubjects] = useState('');
  const [tLevel, setTLevel] = useState<BiblicalLevel | 'todos'>('todos');

  // Content subtab state
  const [contentSubtab, setContentSubtab] = useState<'video' | 'book' | 'debate'>('video');

  // Video lesson upload state
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [videoFileSize, setVideoFileSize] = useState<string>('');

  const [vTitle, setVTitle] = useState('');
  const [vDesc, setVDesc] = useState('');
  const [vInstructor, setVInstructor] = useState('Salomão Muanjita');
  const [vLevel, setVLevel] = useState<BiblicalLevel>('iniciante');
  const [vCategory, setVCategory] = useState('Teologia Bíblica');
  const [vDuration, setVDuration] = useState('45 min');
  const [vUrl, setVUrl] = useState('https://www.youtube.com/embed/jfKfPfyJRdk');
  const [vPassages, setVPassages] = useState('Romanos 8, Salmo 119');
  const [vIsLive, setVIsLive] = useState(false);
  const [vThumbnail, setVThumbnail] = useState('https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Book upload state
  const [bTitle, setBTitle] = useState('');
  const [bAuthor, setBAuthor] = useState('Salomão Muanjita');
  const [bLevel, setBLevel] = useState<BiblicalLevel | 'todos'>('iniciante');
  const [bCategory, setBCategory] = useState('Teologia Sistemática');
  const [bPages, setBPages] = useState(180);
  const [bSynopsis, setBSynopsis] = useState('');
  const [bExcerpt, setBExcerpt] = useState('');
  const [bCover, setBCover] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80');
  const [bookSuccess, setBookSuccess] = useState(false);

  // Debate upload state
  const [dTopic, setDTopic] = useState('');
  const [dDesc, setDDesc] = useState('');
  const [dLevel, setDLevel] = useState<BiblicalLevel | 'todos'>('iniciante');
  const [dCategory, setDCategory] = useState('Exegese & Hermenêutica');
  const [dPassages, setDPassages] = useState('Gálatas 2:20, Romanos 5');
  const [dWhatsapp, setDWhatsapp] = useState('+244 943 004 073');
  const [debateSuccess, setDebateSuccess] = useState(false);

  // Announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annTag, setAnnTag] = useState<'Aviso Urgente' | 'Evento' | 'Live Especial' | 'Novo Material' | 'Devocional'>('Aviso Urgente');
  const [annLevelTarget, setAnnLevelTarget] = useState<BiblicalLevel | 'todos'>('todos');
  const [annIsPinned, setAnnIsPinned] = useState(true);
  const [annImageUrl, setAnnImageUrl] = useState('');
  const [annSuccess, setAnnSuccess] = useState(false);

  // Search filter for students/attendance
  const [searchFilter, setSearchFilter] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [studentLevelFilter, setStudentLevelFilter] = useState<BiblicalLevel | 'todos'>('todos');

  // Handle Video File selection from device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoFile(file);
    setVideoFileName(file.name);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setVideoFileSize(`${sizeInMb} MB`);

    // Create playable object URL
    const previewUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(previewUrl);

    // Auto-fill title if empty
    if (!vTitle) {
      setVTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim() || !tTitle.trim()) return;

    const newTeacher: Teacher = {
      id: `teacher-${Date.now()}`,
      name: tName.trim(),
      title: tTitle.trim(),
      bio: tBio.trim() || 'Docente credenciado pela Academia Bíblica EAD.',
      avatar: tAvatar.trim() || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(tName)}`,
      whatsapp: tWhatsapp.trim() || undefined,
      email: tEmail.trim() || undefined,
      subjects: tSubjects.split(',').map(s => s.trim()).filter(Boolean),
      levelTarget: tLevel,
      registeredBy: 'Salomão Muanjita',
      createdAt: new Date().toISOString().split('T')[0],
      active: true
    };

    onAddTeacher(newTeacher);
    setShowTeacherModal(false);
    setTName('');
    setTTitle('');
    setTBio('');
    setTAvatar('');
    setTWhatsapp('');
    setTEmail('');
    setTSubjects('');
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vTitle.trim()) return;

    let finalVideoUrl = vUrl;
    let finalType: 'file' | 'embed' | 'stream' = 'embed';

    if (uploadMode === 'file' && videoPreviewUrl) {
      finalVideoUrl = videoPreviewUrl;
      finalType = 'file';
    } else {
      if (finalVideoUrl.includes('watch?v=')) {
        finalVideoUrl = finalVideoUrl.replace('watch?v=', 'embed/');
      }
      finalType = vIsLive ? 'stream' : 'embed';
    }

    const newLesson: VideoLesson = {
      id: `lesson-${Date.now()}`,
      title: vTitle.trim(),
      description: vDesc.trim() || 'Vídeo aula disponibilizada pela coordenação.',
      instructor: vInstructor,
      instructorTitle: vInstructor === 'Salomão Muanjita' ? 'Responsável Geral & Diretor' : 'Docente Convidado',
      level: vLevel,
      category: vCategory,
      duration: vIsLive ? 'Ao Vivo em Tempo Real' : vDuration,
      videoUrl: finalVideoUrl,
      videoType: finalType,
      fileName: uploadMode === 'file' ? videoFileName : undefined,
      fileSize: uploadMode === 'file' ? videoFileSize : undefined,
      thumbnail: vThumbnail,
      isLive: vIsLive,
      liveStatus: vIsLive ? 'live' : 'offline',
      viewersCount: vIsLive ? 1 : undefined,
      tags: [vLevel, vCategory, uploadMode === 'file' ? 'Arquivo Local' : 'Vídeo Online'],
      referencePassages: vPassages.split(',').map(s => s.trim()).filter(Boolean),
      attachedFiles: [
        { name: `Material_Estudo_${vTitle.replace(/\s+/g, '_')}.pdf`, size: '1.5 MB', url: '#' }
      ]
    };

    onAddLesson(newLesson);
    setShowLessonModal(false);
    setVTitle('');
    setVDesc('');
    setVideoFile(null);
    setVideoPreviewUrl('');
    setVideoFileName('');
    setVideoFileSize('');
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    const newAnn: FeedAnnouncement = {
      id: `feed-${Date.now()}`,
      title: annTitle.trim(),
      content: annContent.trim(),
      author: 'Salomão Muanjita',
      authorRole: 'Responsável Geral & Direção Acadêmica',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      date: 'Agora mesmo',
      tag: annTag,
      pinned: annIsPinned,
      likes: 0,
      likedByMe: false,
      levelTarget: annLevelTarget,
      imageUrl: annImageUrl.trim() || undefined,
      comments: []
    };

    if (onAddAnnouncement) {
      onAddAnnouncement(newAnn);
    } else if (onPublishAnnouncement) {
      onPublishAnnouncement(newAnn);
    }

    setAnnTitle('');
    setAnnContent('');
    setAnnImageUrl('');
    setAnnSuccess(true);
    setTimeout(() => setAnnSuccess(false), 4500);
  };

  const handlePublishBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle.trim() || !bAuthor.trim()) return;

    const newBook: BookItem = {
      id: `book-${Date.now()}`,
      title: bTitle.trim(),
      author: bAuthor.trim(),
      level: bLevel,
      category: bCategory,
      pages: Number(bPages) || 150,
      coverImage: bCover.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      synopsis: bSynopsis.trim() || 'Apostila oficial disponibilizada pela direção de Salomão Muanjita.',
      readingExcerpt: bExcerpt.trim() || bSynopsis.trim(),
      publishedYear: new Date().getFullYear().toString(),
      addedBy: 'Salomão Muanjita',
      addedAt: new Date().toISOString().split('T')[0]
    };

    if (onAddBook) {
      onAddBook(newBook);
    }
    setBTitle('');
    setBSynopsis('');
    setBExcerpt('');
    setBookSuccess(true);
    setTimeout(() => setBookSuccess(false), 4500);
  };

  const handlePublishDebate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dTopic.trim() || !dDesc.trim()) return;

    const newDebate: DebateTopic = {
      id: `debate-${Date.now()}`,
      title: dTopic.trim(),
      question: dDesc.trim(),
      category: dCategory || 'Hermenêutica Bíblica',
      level: dLevel === 'todos' ? 'geral' : dLevel,
      authorId: user?.id || 'salomao-muanjita',
      authorName: 'Salomão Muanjita',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      authorRole: 'responsavel',
      createdAt: 'Agora',
      likes: 0,
      replies: [],
      hasWhatsAppVideoCall: true,
      whatsAppContact: dWhatsapp.trim() || '+244 943 004 073',
      whatsAppRoomLink: `https://wa.me/${(dWhatsapp.trim() || '+244 943 004 073').replace(/\D/g, '')}`
    };

    if (onAddDebate) {
      onAddDebate(newDebate);
    }
    setDTopic('');
    setDDesc('');
    setDebateSuccess(true);
    setTimeout(() => setDebateSuccess(false), 4500);
  };

  // If user is not Salomão Muanjita, require authorization
  if (!isSalomaoMuanjita) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl text-white space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Área Restrita à Autoria
            </span>
            <h2 className="text-2xl font-bold font-serif text-white mt-1">
              Painel de Gestão Exclusivo de Salomão Muanjita
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
              Conforme as diretrizes institucionais da Academia Bíblica EAD, este ambiente de gestão, supervisão acadêmica e cadastro de docentes está sob autoria exclusiva de <strong>Salomão Muanjita</strong>.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 max-w-md mx-auto text-left space-y-2">
            <p className="font-semibold text-slate-200">Você está conectado atualmente como:</p>
            <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                alt={user?.name || 'Visitante'}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-white">{user?.name || 'Não Registrado'}</p>
                <p className="text-[10px] text-slate-400 capitalize">Função: {user?.role || 'Aluno'}</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={loginAsSalomaoMuanjita}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 mx-auto transition-all cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>Autenticar como Salomão Muanjita (Acesso de Autor)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner - Management Authority */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full text-amber-300 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Gestão Institucional de Autoria de <strong>Salomão Muanjita</strong></span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            Centro de Comando & Gestão Acadêmica
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Cadastre outros professores, carregue novos vídeos de aulas, acompanhe o registro de entrada e saída dos alunos e gerencie comunicados com facilidade.
          </p>
        </div>

        {/* Quick Actions in Header */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              setActiveTab('teachers');
              setShowTeacherModal(true);
            }}
            className="px-3.5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Colocar Outro Professor</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('upload_video');
              setShowLessonModal(true);
            }}
            className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Carregar Vídeo Aula</span>
          </button>
        </div>
      </div>

      {/* Internal Management Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 text-xs font-semibold overflow-x-auto shadow-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Visão Geral</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-emerald-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Carregar Notificações ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('upload_content')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'upload_content'
              ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Carregar Conteúdos Bíblicos</span>
        </button>

        <button
          onClick={() => setActiveTab('students_access')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'students_access'
              ? 'bg-purple-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Alunos & Nível Avançado</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'teachers'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Professores ({teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students_presence')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'students_presence'
              ? 'bg-indigo-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Controle de Presença</span>
        </button>
      </div>

      {/* Tab 1: Overview & Metrics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">Professores Cadastrados</span>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold font-serif text-slate-900">{teachers.length}</div>
              <p className="text-[11px] text-slate-400">Credenciados por Salomão Muanjita</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">Vídeo Aulas no Ar</span>
                <Video className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold font-serif text-slate-900">{lessons.length}</div>
              <p className="text-[11px] text-slate-400">Entre gravadas e transmissões ao vivo</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">Estudantes Online Agora</span>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div className="text-2xl font-bold font-serif text-emerald-600">{todayOnlineCount}</div>
              <p className="text-[11px] text-slate-400">Com registro de entrada ativo</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">Presenças Computadas</span>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold font-serif text-slate-900">{records.length}</div>
              <p className="text-[11px] text-slate-400">Histórico de entrada e saída</p>
            </div>

          </div>

          {/* Quick Hub Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Faculty summary */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  Corpo Docente Atual (Professores)
                </h3>
                <button
                  onClick={() => {
                    setActiveTab('teachers');
                    setShowTeacherModal(true);
                  }}
                  className="text-xs text-purple-600 hover:text-purple-800 font-bold underline cursor-pointer"
                >
                  + Adicionar
                </button>
              </div>

              <div className="space-y-3">
                {teachers.slice(0, 4).map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-slate-300" />
                      <div>
                        <div className="font-bold text-slate-900">{t.name}</div>
                        <div className="text-[11px] text-slate-500">{t.title}</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold">
                      {t.levelTarget}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Upload Banner */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 p-6 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
                  Upload Rápido de Aulas
                </span>
                <h3 className="text-base font-bold font-serif text-slate-900 mt-2">
                  Carregar Vídeo Aula do Computador ou Celular
                </h3>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  Você pode selecionar diretamente um arquivo de vídeo (MP4, WebM) para carregar no sistema, ou colar links de transmissões e aulas no YouTube.
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveTab('upload_content');
                  setContentSubtab('video');
                  setShowLessonModal(true);
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Abrir Formulário de Envio de Vídeo</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Teachers Management */}
      {activeTab === 'teachers' && (
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider">
                <Users className="w-4 h-4" /> Corpo Docente Institucional
              </div>
              <h2 className="text-xl font-bold font-serif text-slate-900 mt-1">
                Professores Cadastrados por Salomão Muanjita
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Gerencie quem pode ministrar aulas, coordenar chamadas de vídeo no WhatsApp e responder aos alunos.
              </p>
            </div>

            <button
              onClick={() => setShowTeacherModal(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Professor</span>
            </button>
          </div>

          {/* Teachers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teachers.map(t => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 shadow-xs"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                        <p className="text-xs text-slate-500">{t.title}</p>
                      </div>
                    </div>

                    {t.id !== 'teacher-salomao' && (
                      <button
                        onClick={() => onRemoveTeacher(t.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition-colors cursor-pointer"
                        title="Remover professor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {t.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {t.subjects.map((subj, idx) => (
                      <span key={idx} className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md font-semibold">
                        {subj}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    {t.whatsapp && (
                      <a
                        href={`https://wa.me/${t.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-emerald-600 hover:underline font-semibold"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400">
                    Nível: <strong>{t.levelTarget}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Tab 3: Upload & Manage Biblical Content (Videos, Books, Debates) */}
      {activeTab === 'upload_content' && (
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
                <Video className="w-4 h-4" /> Gestão de Conteúdos Teológicos
              </div>
              <h2 className="text-xl font-bold font-serif text-slate-900 mt-1">
                Carregar Conteúdos: Vídeos, Livros e Debates
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Central oficial de Salomão Muanjita para carregar e disponibilizar materiais para os estudantes.
              </p>
            </div>

            {/* Subtabs for Content */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setContentSubtab('video')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  contentSubtab === 'video'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Vídeo Aulas ({lessons.length})</span>
              </button>
              <button
                onClick={() => setContentSubtab('book')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  contentSubtab === 'book'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Livros & Apostilas ({books.length})</span>
              </button>
              <button
                onClick={() => setContentSubtab('debate')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  contentSubtab === 'debate'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Debates & Estudos</span>
              </button>
            </div>
          </div>

          {/* Subtab A: Videos */}
          {contentSubtab === 'video' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Video className="w-4 h-4 text-amber-600" />
                  <span>Aulas Gravadas e Transmissões ({lessons.length})</span>
                </h3>
                <button
                  onClick={() => setShowLessonModal(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Carregar Nova Vídeo Aula</span>
                </button>
              </div>

              {/* Lessons Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-4">Aula / Tema</th>
                        <th className="p-4">Professor Responsável</th>
                        <th className="p-4">Nível</th>
                        <th className="p-4">Formato / Tipo</th>
                        <th className="p-4">Duração</th>
                        <th className="p-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lessons.map(lesson => (
                        <tr key={lesson.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                              <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="line-clamp-1">{lesson.title}</div>
                              <div className="text-[11px] font-normal text-slate-500">{lesson.category}</div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-700 font-medium">
                            {lesson.instructor}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                              lesson.level === 'iniciante'
                                ? 'bg-emerald-100 text-emerald-800'
                                : lesson.level === 'intermediario'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {lesson.level}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600">
                            {lesson.isLive ? (
                              <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px]">
                                AO VIVO
                              </span>
                            ) : lesson.videoType === 'file' ? (
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[10px]">
                                ARQUIVO MP4 ({lesson.fileSize || 'Local'})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                                STREAM / EMBED
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-slate-600 font-mono text-[11px]">
                            {lesson.duration}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => onRemoveLesson(lesson.id)}
                              className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Excluir aula"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Subtab B: Books & Study Materials */}
          {contentSubtab === 'book' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">
                    Biblioteca Digital EAD
                  </span>
                  <h3 className="text-base font-bold font-serif text-slate-900 mt-1">
                    Carregar Livro ou Apostila (PDF)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Disponibilize materiais didáticos para os alunos.
                  </p>
                </div>

                {bookSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Livro carregado com sucesso na Biblioteca!</span>
                  </div>
                )}

                <form onSubmit={handlePublishBook} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Título do Livro / Apostila *</label>
                    <input
                      type="text"
                      required
                      value={bTitle}
                      onChange={e => setBTitle(e.target.value)}
                      placeholder="Ex: Teologia Sistemática e Doutrinas Bíblicas"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Autor / Coordenador</label>
                      <input
                        type="text"
                        value={bAuthor}
                        onChange={e => setBAuthor(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nível Alvo</label>
                      <select
                        value={bLevel}
                        onChange={e => setBLevel(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                      >
                        <option value="todos">Todos os Níveis</option>
                        <option value="iniciante">Nível 1 - Iniciante</option>
                        <option value="intermediario">Nível 2 - Intermediário</option>
                        <option value="avancado">Nível 3 - Avançado</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Categoria / Matéria</label>
                      <input
                        type="text"
                        value={bCategory}
                        onChange={e => setBCategory(e.target.value)}
                        placeholder="Ex: Doutrina Bíblica"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nº de Páginas</label>
                      <input
                        type="number"
                        value={bPages}
                        onChange={e => setBPages(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Capa do Livro (URL)</label>
                    <input
                      type="url"
                      value={bCover}
                      onChange={e => setBCover(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sinopse e Conteúdo Programático</label>
                    <textarea
                      rows={2}
                      value={bSynopsis}
                      onChange={e => setBSynopsis(e.target.value)}
                      placeholder="Resumo dos capítulos e conteúdo bíblico..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Trecho / Capítulo 1 para Leitura Online</label>
                    <textarea
                      rows={2}
                      value={bExcerpt}
                      onChange={e => setBExcerpt(e.target.value)}
                      placeholder="Texto do primeiro capítulo para leitura imediata..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Carregar Livro na Biblioteca</span>
                  </button>
                </form>
              </div>

              {/* Books List Preview */}
              <div className="lg:col-span-2 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                  <span>Livros Disponíveis na Biblioteca Digital ({books.length})</span>
                  <span className="text-xs text-slate-400 font-normal">Acesso imediato para alunos</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {books.map(bk => (
                    <div key={bk.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex gap-3 text-xs">
                      <img src={bk.coverImage} alt={bk.title} className="w-16 h-22 rounded-lg object-cover border border-slate-200 shrink-0 shadow-xs" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{bk.title}</div>
                          <div className="text-[11px] text-slate-500">{bk.author}</div>
                          <div className="text-[10px] text-slate-400 mt-1">{bk.category} • {bk.pages} páginas</div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 capitalize">
                            {bk.level}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold">PDF Disponível</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Subtab C: Debates */}
          {contentSubtab === 'debate' && (
            <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                  Debates Teológicos com WhatsApp
                </span>
                <h3 className="text-lg font-bold font-serif text-slate-900 mt-1">
                  Carregar Tópico de Debate e Estudo Bíblico
                </h3>
                <p className="text-xs text-slate-500">
                  Crie um tema de discussão com integração direta para chamadas de vídeo via WhatsApp.
                </p>
              </div>

              {debateSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tópico de debate criado com sucesso!</span>
                </div>
              )}

              <form onSubmit={handlePublishDebate} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tema / Questão Teológica *</label>
                  <input
                    type="text"
                    required
                    value={dTopic}
                    onChange={e => setDTopic(e.target.value)}
                    placeholder="Ex: Hermenêutica Bíblica: Como Interpretar as Epístolas Paulinas?"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nível Bíblico</label>
                    <select
                      value={dLevel}
                      onChange={e => setDLevel(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                    >
                      <option value="todos">Todos os Níveis</option>
                      <option value="iniciante">Nível 1 - Iniciante</option>
                      <option value="intermediario">Nível 2 - Intermediário</option>
                      <option value="avancado">Nível 3 - Avançado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Passagem Bíblica</label>
                    <input
                      type="text"
                      value={dPassages}
                      onChange={e => setDPassages(e.target.value)}
                      placeholder="Ex: Romanos 12:1-2"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp para Chamadas de Vídeo com os Alunos</label>
                  <input
                    type="tel"
                    value={dWhatsapp}
                    onChange={e => setDWhatsapp(e.target.value)}
                    placeholder="+244 943 004 073"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição e Instruções para os Alunos *</label>
                  <textarea
                    rows={4}
                    required
                    value={dDesc}
                    onChange={e => setDDesc(e.target.value)}
                    placeholder="Apresente os pontos de reflexão bíblica para debate..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Carregar Tópico no Fórum de Debates</span>
                </button>
              </form>
            </div>
          )}

        </div>
      )}

      {/* Tab 4: Students Management & Advanced Level Access Control */}
      {activeTab === 'students_access' && (
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider">
                  <Lock className="w-4 h-4" /> Controle de Matrículas & Acesso Avançado
                </div>
                <h2 className="text-xl font-bold font-serif text-slate-900 mt-1">
                  Alunos Matriculados & Liberação do Nível Avançado
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gerencie quais estudantes possuem autorização para cursar o Nível Avançado (Exegese, Grego/Hebraico e Teologia Sistemática).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  placeholder="Buscar aluno ou telefone..."
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl w-48 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={studentLevelFilter}
                  onChange={e => setStudentLevelFilter(e.target.value as any)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none"
                >
                  <option value="todos">Todos os Níveis</option>
                  <option value="iniciante">Inscrito: Iniciante</option>
                  <option value="intermediario">Inscrito: Intermediário</option>
                  <option value="avancado">Inscrito: Avançado</option>
                </select>
              </div>
            </div>

            {/* Explanatory Policy Banner */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <Shield className="w-4 h-4 text-amber-700" />
                <span>Regra Fundamental de Acesso ao Nível Avançado:</span>
              </div>
              <p className="leading-relaxed">
                O <strong>Nível Avançado só é acessado por quem o escolheu no momento da inscrição</strong>. Caso um aluno do nível Iniciante ou Intermediário necessite de acesso especial, <strong>Salomão Muanjita (Autor Master)</strong> pode conceder a liberação individual clicando no botão abaixo.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xl font-bold text-slate-900 font-serif">{studentsList.length}</div>
                <div className="text-[11px] text-slate-500">Total de Alunos</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-center">
                <div className="text-xl font-bold text-purple-900 font-serif">
                  {studentsList.filter(s => s.registeredLevel === 'avancado').length}
                </div>
                <div className="text-[11px] text-purple-700">Inscritos no Avançado</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <div className="text-xl font-bold text-emerald-900 font-serif">
                  {studentsList.filter(s => s.registeredLevel !== 'avancado' && s.advancedAccessGranted).length}
                </div>
                <div className="text-[11px] text-emerald-700">Liberados por Salomão</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xl font-bold text-slate-900 font-serif">
                  {studentsList.filter(s => s.registeredLevel !== 'avancado' && !s.advancedAccessGranted).length}
                </div>
                <div className="text-[11px] text-slate-500">Avançado Bloqueado</div>
              </div>
            </div>
          </div>

          {/* Students Directory Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentsList
              .filter(s => {
                const matchSearch = !studentSearch || 
                  s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                  s.phone?.includes(studentSearch);
                const matchLevel = studentLevelFilter === 'todos' || (s.registeredLevel || s.level) === studentLevelFilter;
                return matchSearch && matchLevel;
              })
              .map(student => {
                const isOriginalAdvanced = student.registeredLevel === 'avancado';
                const hasAccess = isOriginalAdvanced || student.advancedAccessGranted;

                return (
                  <div key={student.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                          <div className="text-xs text-slate-500 font-mono">
                            {student.phone ? `WhatsApp: ${student.phone}` : student.email || 'Estudante'}
                          </div>
                          {student.congregation && (
                            <div className="text-[11px] text-slate-400">
                              {student.congregation} {student.city && `• ${student.city}`}
                            </div>
                          )}
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize border ${
                        student.registeredLevel === 'avancado'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : student.registeredLevel === 'intermediario'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        Inscrito: {student.registeredLevel || student.level}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        {hasAccess ? (
                          <div className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>
                              {isOriginalAdvanced ? 'Matrícula no Avançado' : 'Liberado por Salomão'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                            <span>Avançado Bloqueado</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Direct WhatsApp chat */}
                        {student.phone && (
                          <a
                            href={`https://wa.me/${student.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Olá ${student.name}, aqui é o Salomão Muanjita da Academia Bíblica EAD.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Conversar no WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span className="text-[11px]">WhatsApp</span>
                          </a>
                        )}

                        {/* Grant or Revoke Advanced Access */}
                        {!isOriginalAdvanced ? (
                          <button
                            onClick={() => grantAdvancedAccess(student.id, !student.advancedAccessGranted)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              student.advancedAccessGranted
                                ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-xs'
                            }`}
                          >
                            {student.advancedAccessGranted ? (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>Revogar Avançado</span>
                              </>
                            ) : (
                              <>
                                <Key className="w-3.5 h-3.5" />
                                <span>Liberar Nível Avançado</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium italic">
                            Inscrito originalmente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

        </div>
      )}

      {/* Tab 5: Students Attendance */}
      {activeTab === 'students_presence' && (
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                <UserCheck className="w-4 h-4" /> Controle de Matrículas & Frequência
              </div>
              <h2 className="text-xl font-bold font-serif text-slate-900 mt-1">
                Registros de Presença: Entrada e Saída
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Acompanhe o tempo de estudo dos alunos matriculados nos níveis Iniciante, Intermediário e Avançado.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Buscar por nome do aluno..."
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-52"
              />
            </div>
          </div>

          {/* Attendance Log Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Estudante</th>
                    <th className="p-4">Nível</th>
                    <th className="p-4">Data</th>
                    <th className="p-4">Horário Entrada</th>
                    <th className="p-4">Horário Saída</th>
                    <th className="p-4">Tempo Total</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records
                    .filter(r => !searchFilter || r.userName.toLowerCase().includes(searchFilter.toLowerCase()))
                    .map(rec => (
                      <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-bold text-slate-900 flex items-center gap-2.5">
                          <img src={rec.userAvatar} alt={rec.userName} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <div>{rec.userName}</div>
                            <div className="text-[10px] text-slate-400 capitalize">{rec.role}</div>
                          </div>
                        </td>
                        <td className="p-4 capitalize">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-semibold">
                            {rec.userLevel}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 font-mono text-[11px]">{rec.date}</td>
                        <td className="p-4 font-bold text-emerald-700">{rec.checkInTime}</td>
                        <td className="p-4 text-slate-600">{rec.checkOutTime || '—'}</td>
                        <td className="p-4 text-slate-600 font-medium">
                          {rec.durationMinutes ? `${rec.durationMinutes} min` : (rec.status === 'online' ? 'Em andamento' : '—')}
                        </td>
                        <td className="p-4">
                          {rec.status === 'online' ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 w-fit">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Online
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium text-[10px]">
                              Finalizado
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Tab 6: Official Announcements & Notifications (Carregar Notificações) */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs uppercase tracking-wider text-emerald-600 font-bold flex items-center gap-1.5">
                <Bell className="w-4 h-4" /> Notificações & Comunicados Oficiais
              </span>
              <h2 className="text-xl font-bold font-serif text-slate-900 mt-1">
                Carregar Notificação para os Estudantes
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Emita avisos, convites de lives, comunicados de horários e alertas direcionados para alunos de níveis específicos ou gerais.
              </p>
            </div>

            {annSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Notificação carregada com sucesso e fixada no mural dos estudantes!</span>
              </div>
            )}

            <form onSubmit={handlePublishAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título da Notificação / Comunicado *
                </label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={e => setAnnTitle(e.target.value)}
                  placeholder="Ex: Plantão Teológico ao Vivo neste Sábado via WhatsApp"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoria da Notificação
                  </label>
                  <select
                    value={annTag}
                    onChange={e => setAnnTag(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="Aviso Urgente">Aviso Urgente</option>
                    <option value="Live Especial">Live Especial</option>
                    <option value="Novo Material">Novo Material</option>
                    <option value="Evento">Evento / Cronograma</option>
                    <option value="Devocional">Devocional Teológico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nível Bíblico Alvo
                  </label>
                  <select
                    value={annLevelTarget}
                    onChange={e => setAnnLevelTarget(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="todos">Todos os Níveis (Geral)</option>
                    <option value="iniciante">Apenas Nível 1 - Iniciante</option>
                    <option value="intermediario">Apenas Nível 2 - Intermediário</option>
                    <option value="avancado">Apenas Nível 3 - Avançado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Imagem / Banner da Notificação (URL Opcional)
                  </label>
                  <input
                    type="url"
                    value={annImageUrl}
                    onChange={e => setAnnImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={annIsPinned}
                      onChange={e => setAnnIsPinned(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                    />
                    <span>Fixar no topo do Feed com Destaque Oficial</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mensagem Oficial e Orientações *
                </label>
                <textarea
                  rows={5}
                  required
                  value={annContent}
                  onChange={e => setAnnContent(e.target.value)}
                  placeholder="Escreva as instruções, orientações teológicas, links de chamada ou avisos para os alunos..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4 text-amber-300" />
                <span>Carregar & Disparar Notificação Oficial</span>
              </button>
            </form>
          </div>

          {/* List of currently active notifications */}
          <div className="max-w-3xl mx-auto space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Notificações e Avisos no Mural ({announcements.length})</span>
              <span className="text-xs text-slate-500">Visíveis para os estudantes</span>
            </h3>

            <div className="space-y-3">
              {announcements.map(ann => (
                <div key={ann.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ann.tag === 'Aviso Urgente' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ann.tag}
                      </span>
                      {ann.pinned && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                          📌 Fixado
                        </span>
                      )}
                      <span className="text-slate-400 text-[11px]">
                        Alvo: <strong className="capitalize">{ann.levelTarget || 'todos'}</strong>
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px] font-mono">{ann.date}</span>
                  </div>

                  <div className="font-bold text-slate-900 text-sm">{ann.title}</div>
                  <p className="text-slate-600 line-clamp-2 leading-relaxed">{ann.content}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Autor: <strong className="text-slate-800">{ann.author}</strong> ({ann.authorRole})</span>
                    <span className="text-emerald-600 font-semibold">Ativo no Feed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Cadastrar Novo Professor */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-7 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">
                  Corpo Docente
                </span>
                <h3 className="text-base font-bold font-serif text-slate-900">
                  Cadastrar Novo Professor
                </h3>
              </div>
              <button onClick={() => setShowTeacherModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTeacherSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo do Professor *
                </label>
                <input
                  type="text"
                  required
                  value={tName}
                  onChange={e => setTName(e.target.value)}
                  placeholder="Ex: Pr. Daniel Alvarenga"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Titulação / Ministério *
                  </label>
                  <input
                    type="text"
                    required
                    value={tTitle}
                    onChange={e => setTTitle(e.target.value)}
                    placeholder="Ex: Mestre em Teologia"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nível de Atuação
                  </label>
                  <select
                    value={tLevel}
                    onChange={e => setTLevel(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="todos">Todos os Níveis</option>
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp (para chamadas de vídeo)
                  </label>
                  <input
                    type="tel"
                    value={tWhatsapp}
                    onChange={e => setTWhatsapp(e.target.value)}
                    placeholder="+55 (11) 98888-7777"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email de Contato
                  </label>
                  <input
                    type="email"
                    value={tEmail}
                    onChange={e => setTEmail(e.target.value)}
                    placeholder="professor@email.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Disciplinas / Matérias Ministradas
                </label>
                <input
                  type="text"
                  value={tSubjects}
                  onChange={e => setTSubjects(e.target.value)}
                  placeholder="Ex: Pentateuco, Grego Bíblico, Homilética (separar por vírgula)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Breve Biografia / Perfil Pastoral
                </label>
                <textarea
                  rows={2}
                  value={tBio}
                  onChange={e => setTBio(e.target.value)}
                  placeholder="Formação, igreja de origem, anos de ministério..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Adicionar Professor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Carregar Vídeos para Aulas */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-7 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">
                  Carregar Conteúdo
                </span>
                <h3 className="text-base font-bold font-serif text-slate-900">
                  Carregar Vídeo Aula para a Plataforma
                </h3>
              </div>
              <button onClick={() => setShowLessonModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="space-y-3.5">
              
              {/* Method Toggle: Upload file vs External link */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    uploadMode === 'file'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-amber-600" />
                  <span>Arquivo do Dispositivo (MP4)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    uploadMode === 'url'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  <span>Link Online (YouTube / Stream)</span>
                </button>
              </div>

              {/* Upload file section */}
              {uploadMode === 'file' ? (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Selecione o Arquivo de Vídeo (MP4, WebM, MOV) *
                  </label>
                  
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50 rounded-2xl p-5 text-center cursor-pointer transition-all"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {videoFileName ? (
                      <div className="space-y-1">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                          <Check className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-900">{videoFileName}</p>
                        <p className="text-[11px] text-slate-500 font-mono">Tamanho: {videoFileSize} • Pronto para exibição</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Upload className="w-8 h-8 text-amber-600 mx-auto" />
                        <p className="text-xs font-bold text-slate-800">Clique para escolher o vídeo do seu dispositivo</p>
                        <p className="text-[11px] text-slate-500">Suporta arquivos de aula gravada em alta qualidade</p>
                      </div>
                    )}
                  </div>

                  {videoPreviewUrl && (
                    <div className="rounded-xl overflow-hidden bg-black aspect-video max-h-44 border border-slate-300">
                      <video src={videoPreviewUrl} controls className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL do Vídeo (YouTube, Vimeo ou Link MP4 direto) *
                  </label>
                  <input
                    type="url"
                    required
                    value={vUrl}
                    onChange={e => setVUrl(e.target.value)}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título da Aula *
                </label>
                <input
                  type="text"
                  required
                  value={vTitle}
                  onChange={e => setVTitle(e.target.value)}
                  placeholder="Ex: Introdução ao Grego Bíblico do Novo Testamento"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professor Responsável
                  </label>
                  <select
                    value={vInstructor}
                    onChange={e => setVInstructor(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="Salomão Muanjita">Salomão Muanjita (Responsável Geral)</option>
                    {teachers
                      .filter(t => t.name !== 'Salomão Muanjita')
                      .map(t => (
                        <option key={t.id} value={t.name}>{t.name} ({t.title})</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nível Teológico
                  </label>
                  <select
                    value={vLevel}
                    onChange={e => setVLevel(e.target.value as BiblicalLevel)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="iniciante">Nível 1 - Iniciante</option>
                    <option value="intermediario">Nível 2 - Intermediário</option>
                    <option value="avancado">Nível 3 - Avançado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Disciplina / Categoria
                  </label>
                  <input
                    type="text"
                    value={vCategory}
                    onChange={e => setVCategory(e.target.value)}
                    placeholder="Ex: Exegese Bíblica"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duração Estimada
                  </label>
                  <input
                    type="text"
                    value={vDuration}
                    onChange={e => setVDuration(e.target.value)}
                    placeholder="Ex: 45 min"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Passagens Bíblicas de Referência
                </label>
                <input
                  type="text"
                  value={vPassages}
                  onChange={e => setVPassages(e.target.value)}
                  placeholder="Ex: João 1:1-14, Hebreus 1:1-4"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descrição e Resumo Teológico
                </label>
                <textarea
                  rows={2}
                  value={vDesc}
                  onChange={e => setVDesc(e.target.value)}
                  placeholder="Principais conceitos explicados na aula..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Publicar Vídeo Aula</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
