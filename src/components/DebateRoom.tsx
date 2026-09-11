import React, { useState } from 'react';
import { DebateTopic, DebateReply, BiblicalLevel } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquare, Video, PhoneCall, Plus, ThumbsUp, 
  Send, Users, ShieldCheck, HelpCircle, Sparkles, X, 
  ExternalLink, Calendar, MessageCircle, Copy, Check, Phone
} from 'lucide-react';

interface DebateRoomProps {
  debates: DebateTopic[];
  onAddDebate: (debate: DebateTopic) => void;
  onAddReply: (debateId: string, reply: DebateReply) => void;
  selectedLevel: BiblicalLevel | 'todos';
}

export const DebateRoom: React.FC<DebateRoomProps> = ({
  debates,
  onAddDebate,
  onAddReply,
  selectedLevel
}) => {
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<DebateTopic | null>(debates[0] || null);
  const [replyText, setReplyText] = useState('');
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [showWhatsAppCallModal, setShowWhatsAppCallModal] = useState(false);

  // New Debate Form State
  const [newTitle, setNewTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState('Hermenêutica e Doutrina');
  const [newLevel, setNewLevel] = useState<BiblicalLevel>('iniciante');
  const [includeVideoCall, setIncludeVideoCall] = useState(true);
  const [whatsAppPhone, setWhatsAppPhone] = useState(user?.whatsappNumber || '244943004073');

  // WhatsApp Video Call config state
  const [callTarget, setCallTarget] = useState<'salomao' | 'author' | 'custom'>('salomao');
  const [customPhone, setCustomPhone] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const getEffectiveCallPhone = () => {
    if (callTarget === 'salomao') return '244943004073';
    if (callTarget === 'author' && selectedTopic?.whatsAppContact) {
      return selectedTopic.whatsAppContact.replace(/\D/g, '');
    }
    return customPhone.replace(/\D/g, '') || '244943004073';
  };

  const getTargetName = () => {
    if (callTarget === 'salomao') return 'Salomão Muanjita (Diretor & Docente)';
    if (callTarget === 'author') return selectedTopic ? selectedTopic.authorName : 'Autor do Debate';
    return 'Contato Personalizado';
  };

  const buildWhatsAppVideoUrl = () => {
    const phone = getEffectiveCallPhone();
    const topicTitle = selectedTopic?.title || 'Debate Bíblico & Mesa Redonda';
    const message = customMessage || 
      `Paz do Senhor! Estou participando da Academia Bíblica EAD e gostaria de iniciar uma Chamada de Vídeo pelo WhatsApp para debater sobre: "${topicTitle}". Meu nome é ${user?.name || 'Estudante'}.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const handleCopyCallLink = () => {
    const url = buildWhatsAppVideoUrl();
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const openWhatsAppCallModalForTopic = (topic?: DebateTopic) => {
    if (topic) {
      setSelectedTopic(topic);
    }
    setCustomMessage('');
    setShowWhatsAppCallModal(true);
  };

  const filteredDebates = debates.filter(d => {
    if (selectedLevel === 'todos') return true;
    return d.level === 'geral' || d.level === selectedLevel;
  });

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newQuestion || !user) return;

    const cleanedPhone = whatsAppPhone.replace(/\D/g, '') || '5511999998888';
    const waLink = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(
      `Paz do Senhor! Gostaria de participar da Chamada de Vídeo pelo WhatsApp para o debate bíblico: "${newTitle}"`
    )}`;

    const newTopic: DebateTopic = {
      id: `debate-${Date.now()}`,
      title: newTitle,
      question: newQuestion,
      category: newCategory,
      level: newLevel,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorRole: user.role,
      createdAt: 'Agora mesmo',
      likes: 1,
      likedByMe: true,
      hasWhatsAppVideoCall: includeVideoCall,
      whatsAppRoomLink: waLink,
      whatsAppContact: whatsAppPhone,
      replies: []
    };

    onAddDebate(newTopic);
    setSelectedTopic(newTopic);
    setShowNewTopicModal(false);
    setNewTitle('');
    setNewQuestion('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTopic || !user) return;

    const reply: DebateReply = {
      id: `reply-${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatar,
      content: replyText.trim(),
      createdAt: 'Agora mesmo',
      likes: 0
    };

    onAddReply(selectedTopic.id, reply);
    setReplyText('');

    // Update locally selected view
    setSelectedTopic(prev => {
      if (!prev) return null;
      return {
        ...prev,
        replies: [...prev.replies, reply]
      };
    });
  };

  const triggerDirectWhatsAppVideo = (topic?: DebateTopic) => {
    const targetTopic = topic || selectedTopic;
    const phone = targetTopic?.whatsAppContact ? targetTopic.whatsAppContact.replace(/\D/g, '') : '5511999998888';
    const title = targetTopic?.title || 'Estudo Teológico em Grupo';
    const link = `https://wa.me/${phone}?text=${encodeURIComponent(
      `Olá! Estou na plataforma de Formação Bíblica EAD e quero iniciar/conectar à Chamada de Vídeo no WhatsApp referente ao debate: "${title}".`
    )}`;
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Hero WhatsApp Video Call integration banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white rounded-2xl p-6 border border-emerald-700/50 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Video className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            Chamadas de Vídeo Integradas via WhatsApp
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-serif text-emerald-100">
            Sala de Debates Teológicos & Perguntas com Tutoria em Vídeo
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tire dúvidas em tempo real, debata pontos de hermenêutica e participe de chamadas de vídeo diretas com professores e irmãos pelo WhatsApp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => openWhatsAppCallModalForTopic()}
            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Video className="w-4 h-4" />
            Iniciar Chamada de Vídeo no WhatsApp
          </button>

          <button
            onClick={() => setShowNewTopicModal(true)}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nova Pergunta / Debate
          </button>
        </div>
      </div>

      {/* Main Forum Grid: Topics Sidebar + Active Discussion Window */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Topic List (1 Col) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" /> Tópicos de Perguntas
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">{filteredDebates.length} discussões</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredDebates.map(debate => (
              <div
                key={debate.id}
                onClick={() => setSelectedTopic(debate)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedTopic?.id === debate.id
                    ? 'bg-emerald-50/60 border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    debate.level === 'iniciante'
                      ? 'bg-emerald-100 text-emerald-800'
                      : debate.level === 'intermediario'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {debate.level}
                  </span>
                  
                  {debate.hasWhatsAppVideoCall && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      <Video className="w-3 h-3 text-emerald-600" /> WhatsApp Vídeo
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                  {debate.title}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
                  <span>{debate.authorName.split(' ')[0]}</span>
                  <span>{debate.replies.length} respostas</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Topic & Answers (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          {selectedTopic ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
              
              {/* Question Header Card */}
              <div className="space-y-3 pb-5 border-b border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedTopic.authorAvatar}
                      alt={selectedTopic.authorName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{selectedTopic.authorName}</div>
                      <div className="text-[11px] text-slate-400">{selectedTopic.createdAt} • {selectedTopic.category}</div>
                    </div>
                  </div>

                  {/* Direct WhatsApp Call for this topic */}
                  {selectedTopic.hasWhatsAppVideoCall && (
                    <button
                      onClick={() => openWhatsAppCallModalForTopic(selectedTopic)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Chamada de Vídeo WhatsApp deste Tópico
                    </button>
                  )}
                </div>

                <h3 className="text-base md:text-lg font-bold font-serif text-slate-900">
                  {selectedTopic.title}
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-line">
                  {selectedTopic.question}
                </p>

                {selectedTopic.whatsAppContact && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 flex items-center justify-between">
                    <span>
                      <strong>Contato para chamada de vídeo:</strong> {selectedTopic.whatsAppContact}
                    </span>
                    <button
                      onClick={() => openWhatsAppCallModalForTopic(selectedTopic)}
                      className="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      Abrir no WhatsApp <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Replies list */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> Respostas e Fundamentações Teológicas ({selectedTopic.replies.length})
                </h4>

                {selectedTopic.replies.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-xl">
                    Seja o primeiro a responder esta pergunta bíblica com fundamentação escriturística!
                  </div>
                ) : (
                  selectedTopic.replies.map(rep => (
                    <div
                      key={rep.id}
                      className={`p-4 rounded-xl border text-xs space-y-2 ${
                        rep.authorRole === 'professor'
                          ? 'bg-amber-50/50 border-amber-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rep.authorAvatar}
                            alt={rep.authorName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-bold text-slate-900">{rep.authorName}</span>
                            {rep.authorRole === 'professor' && (
                              <span className="ml-1.5 bg-amber-200 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                Docente
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">{rep.createdAt}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed pl-9">
                        {rep.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Adicionar Resposta ou Contribuição Teológica:
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Cite versículos e elabore sua resposta com reverência bíblica..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Enviar Resposta
                  </button>
                </div>
              </form>

            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200">
              Selecione um tópico de debate ao lado.
            </div>
          )}
        </div>

      </div>

      {/* Modal: Novo Tópico de Pergunta / Debate */}
      {showNewTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                Criar Nova Pergunta ou Debate Bíblico
              </h3>
              <button onClick={() => setShowNewTopicModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pergunta ou Tese Principal
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ex: Como compreender o paradoxo da soberania divina e responsabilidade humana?"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nível Teológico
                  </label>
                  <select
                    value={newLevel}
                    onChange={e => setNewLevel(e.target.value as BiblicalLevel)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="Doutrina Cristã">Doutrina Cristã</option>
                    <option value="Hermenêutica e Doutrina">Hermenêutica e Doutrina</option>
                    <option value="Exegese Bíblica">Exegese Bíblica</option>
                    <option value="História da Igreja">História da Igreja</option>
                    <option value="Vida Prática e Pastoral">Vida Prática e Pastoral</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detalhamento da Dúvida ou Tópico
                </label>
                <textarea
                  rows={3}
                  required
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  placeholder="Apresente seu raciocínio, versículos que geraram dúvida e o ponto a ser debatido..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-emerald-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeVideoCall}
                    onChange={e => setIncludeVideoCall(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Habilitar Chamada de Vídeo no WhatsApp para este debate</span>
                </label>

                {includeVideoCall && (
                  <div>
                    <span className="text-[11px] text-emerald-800 block mb-1">
                      Número do WhatsApp para conectar a chamada de vídeo:
                    </span>
                    <input
                      type="tel"
                      value={whatsAppPhone}
                      onChange={e => setWhatsAppPhone(e.target.value)}
                      placeholder="+55 (11) 99999-8888"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg text-emerald-900 font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewTopicModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Publicar Pergunta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Chamada de Vídeo WhatsApp */}
      {showWhatsAppCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-slate-900">
                    Chamada de Vídeo via WhatsApp
                  </h3>
                  <p className="text-[11px] text-slate-500">Debates Teológicos & Tutoria Bíblica</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWhatsAppCallModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Conectar Chamada de Vídeo com:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCallTarget('salomao')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    callTarget === 'salomao'
                      ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold ring-1 ring-amber-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold">Salomão Muanjita</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Diretor Geral & Docente (+244 943 004 073)</p>
                </button>

                {selectedTopic?.whatsAppContact && (
                  <button
                    type="button"
                    onClick={() => setCallTarget('author')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      callTarget === 'author'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-bold truncate">{selectedTopic.authorName}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 truncate">Autor do Debate ({selectedTopic.whatsAppContact})</p>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setCallTarget('custom')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    callTarget === 'custom'
                      ? 'border-blue-500 bg-blue-50/80 text-blue-950 font-bold ring-1 ring-blue-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-bold">Outro Número</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Digitar WhatsApp com DDI</p>
                </button>
              </div>
            </div>

            {callTarget === 'custom' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Número de WhatsApp com DDI (Ex: 244943004073 ou 5511999998888):
                </label>
                <input
                  type="tel"
                  value={customPhone}
                  onChange={e => setCustomPhone(e.target.value)}
                  placeholder="244943004073"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            )}

            {/* Custom message */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mensagem Inicial de Abertura da Chamada:
              </label>
              <textarea
                rows={3}
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                placeholder={`Paz do Senhor! Gostaria de participar da Chamada de Vídeo pelo WhatsApp referente ao debate: "${selectedTopic?.title || 'Estudo Bíblico'}".`}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Info Box */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                Como funciona a chamada de vídeo:
              </div>
              <p className="text-[11px] text-slate-500">
                Ao clicar no botão abaixo, o aplicativo do WhatsApp será aberto com o contato e a mensagem de convocação pronta. Basta enviar e tocar no ícone de <strong>Câmera de Vídeo</strong> para iniciar a chamada ao vivo.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <a
                href={buildWhatsAppVideoUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer text-center"
              >
                <Video className="w-4 h-4" />
                <span>Abrir WhatsApp & Chamar em Vídeo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleCopyCallLink}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
