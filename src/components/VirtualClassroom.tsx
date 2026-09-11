import React, { useState, useRef } from 'react';
import { VideoLesson, BiblicalLevel, Teacher } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Play, Radio, Video, BookOpen, Clock, Users, Plus, 
  Send, Sparkles, CheckCircle, FileText, Download, Share2, 
  ChevronRight, BookmarkCheck, MessageSquare, AlertCircle,
  Upload, Shield, Check, ExternalLink
} from 'lucide-react';

interface VirtualClassroomProps {
  lessons: VideoLesson[];
  onAddLesson: (lesson: VideoLesson) => void;
  selectedLevel: BiblicalLevel | 'todos';
  onSelectLevel: (lvl: BiblicalLevel | 'todos') => void;
  teachers?: Teacher[];
}

export const VirtualClassroom: React.FC<VirtualClassroomProps> = ({
  lessons,
  onAddLesson,
  selectedLevel,
  onSelectLevel,
  teachers = []
}) => {
  const { user, isSalomaoMuanjita } = useAuth();
  const [activeLesson, setActiveLesson] = useState<VideoLesson>(() => {
    return lessons.find(l => l.isLive) || lessons[0];
  });
  const [viewTab, setViewTab] = useState<'aulas' | 'aovivo'>('aulas');
  const [showAddModal, setShowAddModal] = useState(false);
  const [studentNotes, setStudentNotes] = useState('');
  const [notesSavedNotice, setNotesSavedNotice] = useState(false);

  // Live chat messages simulation
  const [chatMessages, setChatMessages] = useState([
    { id: 'c1', sender: 'Irmã Eunice', time: '19:32', text: 'A paz do Senhor Jesus a todos! Ligada de Curitiba.' },
    { id: 'c2', sender: 'Diácono Paulo', time: '19:34', text: 'Amém! Aula abençoada sobre o Pentateuco.' },
    { id: 'c3', sender: 'Pr. Carlos Vieira', time: '19:35', text: 'Podem enviar suas dúvidas pelo chat ou solicitar tutoria no WhatsApp!' },
    { id: 'c4', sender: 'Lucas Medeiros', time: '19:36', text: 'Professor, qual o versículo de apoio sobre a aliança eterna?' }
  ]);
  const [newChatText, setNewChatText] = useState('');

  // Form for publishing new video lesson or live stream
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newInstructor, setNewInstructor] = useState('Salomão Muanjita');
  const [newLevel, setNewLevel] = useState<BiblicalLevel>('iniciante');
  const [newCategory, setNewCategory] = useState('Teologia Bíblica');
  const [newDuration, setNewDuration] = useState('45 min');
  const [newVideoUrl, setNewVideoUrl] = useState('https://www.youtube.com/embed/jfKfPfyJRdk');
  const [newIsLive, setNewIsLive] = useState(false);
  const [newPassages, setNewPassages] = useState('Gênesis 12, João 3:16');

  const filteredLessons = lessons.filter(l => {
    if (viewTab === 'aovivo') return l.isLive;
    if (selectedLevel === 'todos') return !l.isLive;
    return !l.isLive && l.level === selectedLevel;
  });

  const liveLessons = lessons.filter(l => l.isLive);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    const blobUrl = URL.createObjectURL(file);
    setUploadedPreview(blobUrl);

    if (!newTitle) {
      setNewTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    const msg = {
      id: `chat-${Date.now()}`,
      sender: user?.name || 'Estudante Conectado',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: newChatText.trim()
    };
    setChatMessages(prev => [...prev, msg]);
    setNewChatText('');
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let finalUrl = newVideoUrl;
    let finalType: 'file' | 'embed' | 'stream' = 'embed';

    if (uploadMode === 'file' && uploadedPreview) {
      finalUrl = uploadedPreview;
      finalType = 'file';
    } else {
      if (finalUrl.includes('watch?v=')) {
        finalUrl = finalUrl.replace('watch?v=', 'embed/');
      }
      finalType = newIsLive ? 'stream' : 'embed';
    }

    const created: VideoLesson = {
      id: `lesson-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Aula ministrada na Academia Bíblica EAD.',
      instructor: newInstructor,
      instructorTitle: newInstructor.includes('Salomão Muanjita') ? 'Responsável Geral & Diretor' : 'Professor(a) de Teologia',
      level: newLevel,
      category: newCategory,
      duration: newIsLive ? 'Em Tempo Real' : newDuration,
      videoUrl: finalUrl,
      videoType: finalType,
      fileName: uploadMode === 'file' ? uploadedFileName : undefined,
      fileSize: uploadMode === 'file' ? uploadedFileSize : undefined,
      thumbnail: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80',
      isLive: newIsLive,
      liveStatus: newIsLive ? 'live' : 'offline',
      viewersCount: newIsLive ? 1 : undefined,
      tags: [newLevel, newCategory, uploadMode === 'file' ? 'Arquivo de Vídeo' : 'Transmissão'],
      referencePassages: newPassages.split(',').map(s => s.trim()).filter(Boolean),
      attachedFiles: [
        { name: `Apostila_${newTitle.replace(/\s+/g, '_')}.pdf`, size: '2.1 MB', url: '#' }
      ]
    };

    onAddLesson(created);
    setActiveLesson(created);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setUploadedFile(null);
    setUploadedPreview('');
    setUploadedFileName('');
    setUploadedFileSize('');
  };

  const isVideoFile = 
    activeLesson.videoType === 'file' ||
    activeLesson.videoUrl.startsWith('blob:') ||
    activeLesson.videoUrl.endsWith('.mp4') ||
    activeLesson.videoUrl.endsWith('.webm') ||
    activeLesson.videoUrl.endsWith('.mov');

  const handleSaveNotes = () => {
    setNotesSavedNotice(true);
    setTimeout(() => setNotesSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Mode Toggle */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Video className="w-4 h-4" /> Sala Virtual de Aprendizado
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-serif tracking-tight mt-1 text-slate-100">
            Aulas Bíblicas e Transmissões em Tempo Real
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Aprofunde-se nos fundamentos, hermenêutica e exegese teológica com materiais de apoio e transmissões diretas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Toggle between recorded lessons and live stream */}
          <div className="bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700">
            <button
              onClick={() => setViewTab('aulas')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewTab === 'aulas'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Vídeo Aulas Gravadas
            </button>
            <button
              onClick={() => {
                setViewTab('aovivo');
                const liveOne = lessons.find(l => l.isLive);
                if (liveOne) setActiveLesson(liveOne);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                viewTab === 'aovivo'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-red-300" />
              Ao Vivo ({liveLessons.length})
            </button>
          </div>

          {/* Button for sending new lesson / live video */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Mandar Vídeo Aula / Live
          </button>
        </div>
      </div>

      {/* Main Classroom Screen: Video Player + Interactive Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Stage (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-800 aspect-video relative group">
            {isVideoFile ? (
              <video
                key={activeLesson.id}
                src={activeLesson.videoUrl}
                controls
                controlsList="nodownload"
                className="w-full h-full object-contain bg-black"
              >
                Seu navegador não suporta a tag de vídeo HTML5.
              </video>
            ) : activeLesson.videoUrl.includes('youtube.com') || activeLesson.videoUrl.includes('youtu.be') ? (
              <iframe
                src={activeLesson.videoUrl}
                title={activeLesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-white p-6 text-center">
                <Play className="w-16 h-16 text-amber-400 mb-3" />
                <h3 className="font-bold text-lg">{activeLesson.title}</h3>
                <p className="text-xs text-slate-400 max-w-md mt-1">{activeLesson.description}</p>
              </div>
            )}

            {activeLesson.isLive && (
              <div className="absolute top-4 left-4 bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                TRANSMISSÃO EM TEMPO REAL
              </div>
            )}
          </div>

          {/* Lesson Metadata & Tabs */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                  activeLesson.level === 'iniciante'
                    ? 'bg-emerald-100 text-emerald-800'
                    : activeLesson.level === 'intermediario'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  Nível {activeLesson.level}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {activeLesson.category}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {activeLesson.duration}
                </span>
                {activeLesson.isLive && (
                  <span className="flex items-center gap-1 text-red-600 font-semibold">
                    <Users className="w-3.5 h-3.5" />
                    {activeLesson.viewersCount || 38} alunos assistindo
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 font-serif">
                {activeLesson.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {activeLesson.description}
              </p>
            </div>

            {/* Instructor and References */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Professor Responsável
                </span>
                <div className="text-xs font-bold text-slate-900 mt-0.5">{activeLesson.instructor}</div>
                <div className="text-[11px] text-slate-500">{activeLesson.instructorTitle}</div>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                  Passagens Bíblicas de Apoio
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeLesson.referencePassages.map((ref, idx) => (
                    <span key={idx} className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[11px] font-medium">
                      📖 {ref}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Attached Handouts / Downloads */}
            {activeLesson.attachedFiles && activeLesson.attachedFiles.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" /> Apostilas e Materiais Didáticos
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeLesson.attachedFiles.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => alert(`Iniciando download do material: ${file.name}`)}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 text-slate-700 rounded-xl text-xs font-medium border border-slate-200 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{file.name}</span>
                      <span className="text-[10px] text-slate-400">({file.size})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Student Personal Study Notebook */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4 text-emerald-600" /> Meu Caderno Teológico de Anotações
                </label>
                {notesSavedNotice && (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Anotação salva!
                  </span>
                )}
              </div>
              <textarea
                rows={3}
                value={studentNotes}
                onChange={e => setStudentNotes(e.target.value)}
                placeholder="Escreva seus versículos memorizados, insights e dúvidas durante a aula..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Salvar no Meu Histórico
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Side Column: If Live -> Live Chat; Else -> Course Playlist / Other Lessons */}
        <div className="space-y-4">
          
          {viewTab === 'aovivo' ? (
            /* Real-Time Live Chat Room */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[560px] overflow-hidden">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="font-bold text-xs">Chat da Transmissão Ao Vivo</span>
                </div>
                <span className="text-[10px] text-emerald-300 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  Ao Vivo
                </span>
              </div>

              {/* Chat list */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                  <strong>Regra de Comunhão:</strong> Mantenha a edificação mútua. Pedidos de oração e perguntas teológicas são bem-vindos.
                </div>

                {chatMessages.map(msg => (
                  <div key={msg.id} className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-slate-900">{msg.sender}</span>
                      <span className="text-slate-400 font-mono">{msg.time}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat input */}
              <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={newChatText}
                  onChange={e => setNewChatText(e.target.value)}
                  placeholder="Envie uma pergunta ou oração..."
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* Recorded Lessons Playlist */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-amber-600" /> Grade de Aulas
                </h4>
                <div className="flex items-center gap-1 text-[11px]">
                  {(['todos', 'iniciante', 'intermediario', 'avancado'] as const).map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => onSelectLevel(lvl)}
                      className={`px-2 py-0.5 rounded capitalize ${
                        selectedLevel === lvl
                          ? 'bg-amber-600 text-white font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {lvl === 'todos' ? 'Todos' : lvl.slice(0, 4) + '.'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredLessons.map(lesson => (
                  <div
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                      activeLesson.id === lesson.id
                        ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-400'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                      <img
                        src={lesson.thumbnail}
                        alt={lesson.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center">
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        lesson.level === 'iniciante'
                          ? 'bg-emerald-100 text-emerald-800'
                          : lesson.level === 'intermediario'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {lesson.level}
                      </span>
                      <h5 className="text-xs font-bold text-slate-900 truncate mt-1">
                        {lesson.title}
                      </h5>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                        <span>{lesson.duration}</span>
                        <span>•</span>
                        <span>{lesson.instructor.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modal: Mandar Vídeos Aulas e Vídeos em Tempo Real */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold font-serif text-slate-900 mb-1">
              Publicar Nova Vídeo Aula ou Iniciar Live
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Disponibilize conteúdos gravados ou abra transmissão em tempo real para os alunos.
            </p>

            <form onSubmit={handleCreateLesson} className="space-y-3.5">
              
              {/* Upload Mode Selector */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    uploadMode === 'file'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Arquivo de Vídeo (MP4)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    uploadMode === 'url'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  <span>Link / Stream Online</span>
                </button>
              </div>

              {uploadMode === 'file' ? (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Selecione o Vídeo da Aula do Computador/Celular *
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/70 rounded-2xl p-4 text-center cursor-pointer transition-all"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {uploadedFileName ? (
                      <div className="space-y-1">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                          <Check className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-bold text-slate-900">{uploadedFileName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">Tamanho: {uploadedFileSize} • Pronto para reprodução</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="w-7 h-7 text-emerald-600 mx-auto" />
                        <p className="text-xs font-bold text-slate-800">Clique para carregar o arquivo de vídeo</p>
                        <p className="text-[10px] text-slate-500">Formatos aceitos: MP4, WebM, MOV</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Link do Vídeo ou Transmissão (YouTube / MP4 / Stream) *
                  </label>
                  <input
                    type="url"
                    required
                    value={newVideoUrl}
                    onChange={e => setNewVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título da Aula / Live *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ex: Teologia Bíblica dos Profetas Menores"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nível de Ensino
                  </label>
                  <select
                    value={newLevel}
                    onChange={e => setNewLevel(e.target.value as BiblicalLevel)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="iniciante">Nível 1 - Iniciante</option>
                    <option value="intermediario">Nível 2 - Intermediário</option>
                    <option value="avancado">Nível 3 - Avançado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Formato
                  </label>
                  <select
                    value={newIsLive ? 'live' : 'recorded'}
                    onChange={e => setNewIsLive(e.target.value === 'live')}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="recorded">Vídeo Aula Gravada</option>
                    <option value="live">Transmissão em Tempo Real (Live)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professor(a) Responsável
                  </label>
                  <select
                    value={newInstructor}
                    onChange={e => setNewInstructor(e.target.value)}
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
                    Passagens Bíblicas
                  </label>
                  <input
                    type="text"
                    value={newPassages}
                    onChange={e => setNewPassages(e.target.value)}
                    placeholder="Ex: Romanos 8:1-17, Salmo 23"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descrição e Objetivos de Aprendizagem
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Resumo do tema, contexto histórico e doutrina..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{newIsLive ? 'Iniciar Live em Tempo Real' : 'Publicar Vídeo Aula'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
