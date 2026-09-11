import React, { useState } from 'react';
import { FeedAnnouncement, BiblicalLevel } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Bell, Pin, Heart, MessageSquare, Send, Plus, 
  Sparkles, Calendar, Tag, ShieldAlert, Share2, X
} from 'lucide-react';

interface AnnouncementsFeedProps {
  announcements: FeedAnnouncement[];
  onAddAnnouncement: (ann: FeedAnnouncement) => void;
  selectedLevel: BiblicalLevel | 'todos';
}

export const AnnouncementsFeed: React.FC<AnnouncementsFeedProps> = ({
  announcements,
  onAddAnnouncement,
  selectedLevel
}) => {
  const { user } = useAuth();
  const [feedItems, setFeedItems] = useState<FeedAnnouncement[]>(announcements);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Comment states
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // New announcement form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState<'Aviso Urgente' | 'Evento' | 'Live Especial' | 'Novo Material' | 'Devocional'>('Live Especial');
  const [isPinned, setIsPinned] = useState(false);
  const [levelTarget, setLevelTarget] = useState<BiblicalLevel | 'todos'>('todos');
  const [imageUrl, setImageUrl] = useState('');

  const filteredFeed = feedItems.filter(item => {
    if (selectedLevel === 'todos') return true;
    return item.levelTarget === 'todos' || item.levelTarget === selectedLevel;
  });

  const handleToggleLike = (id: string) => {
    setFeedItems(prev => prev.map(item => {
      if (item.id === id) {
        const isLiked = !!item.likedByMe;
        return {
          ...item,
          likes: isLiked ? item.likes - 1 : item.likes + 1,
          likedByMe: !isLiked
        };
      }
      return item;
    }));
  };

  const handleAddComment = (announcementId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputs[announcementId]?.trim();
    if (!commentText || !user) return;

    const newComment = {
      id: `comm-${Date.now()}`,
      author: user.name,
      authorAvatar: user.avatar,
      content: commentText,
      date: 'Agora mesmo'
    };

    setFeedItems(prev => prev.map(item => {
      if (item.id === announcementId) {
        return {
          ...item,
          comments: [...item.comments, newComment]
        };
      }
      return item;
    }));

    setCommentInputs(prev => ({ ...prev, [announcementId]: '' }));
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !user) return;

    const newAnn: FeedAnnouncement = {
      id: `feed-${Date.now()}`,
      title,
      content,
      author: user.name,
      authorRole: user.role === 'professor' ? 'Docente & Coordenação' : 'Comunicação Oficial',
      authorAvatar: user.avatar,
      date: 'Agora mesmo',
      tag,
      pinned: isPinned,
      likes: 0,
      likedByMe: false,
      levelTarget,
      imageUrl: imageUrl || undefined,
      comments: []
    };

    onAddAnnouncement(newAnn);
    setFeedItems(prev => [newAnn, ...prev]);
    setShowCreateModal(false);
    setTitle('');
    setContent('');
    setImageUrl('');
  };

  const getTagBadgeColor = (t: string) => {
    switch (t) {
      case 'Aviso Urgente':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Live Especial':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Novo Material':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Devocional':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Feed Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <Bell className="w-4 h-4" /> Mural da Academia Bíblica
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-serif text-slate-900 mt-1">
            Feed Oficial de Comunicados & Notícias
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhe avisos da coordenação, horários de lives, novos materiais e comunicados teológicos.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Publicar Comunicado
        </button>
      </div>

      {/* Feed Stream */}
      <div className="space-y-5">
        {filteredFeed.map(item => (
          <article
            key={item.id}
            className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
              item.pinned ? 'border-amber-300 ring-1 ring-amber-300/60' : 'border-slate-200'
            }`}
          >
            {/* Pinned Banner */}
            {item.pinned && (
              <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-[11px] font-bold flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5 fill-current" />
                COMUNICADO FIXADO PELA COORDENAÇÃO
              </div>
            )}

            <div className="p-6 space-y-4">
              {/* Author & Tag */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.authorAvatar}
                    alt={item.author}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.author}</h4>
                    <p className="text-[10px] text-slate-400">{item.authorRole} • {item.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getTagBadgeColor(item.tag)}`}>
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Title & Body Content */}
              <div>
                <h3 className="text-base md:text-lg font-bold font-serif text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>

              {/* Optional Image */}
              {item.imageUrl && (
                <div className="rounded-xl overflow-hidden max-h-72 bg-slate-100 border border-slate-200">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Action Bar (Likes & Comments Count) */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleLike(item.id)}
                    className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                      item.likedByMe
                        ? 'text-red-600 font-bold bg-red-50'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${item.likedByMe ? 'fill-current text-red-600' : ''}`} />
                    <span>{item.likes} Curtidas</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MessageSquare className="w-4 h-4" />
                    <span>{item.comments.length} Comentários</span>
                  </div>
                </div>

                <button
                  onClick={() => alert('Link do comunicado copiado para a área de transferência!')}
                  className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Compartilhar
                </button>
              </div>

              {/* Comments Section */}
              <div className="pt-3 space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                {item.comments.map(comm => (
                  <div key={comm.id} className="flex items-start gap-2.5 text-xs">
                    <img
                      src={comm.authorAvatar}
                      alt={comm.author}
                      className="w-6 h-6 rounded-full object-cover mt-0.5"
                    />
                    <div className="flex-1 bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="font-bold text-slate-800">{comm.author}</span>
                        <span className="text-slate-400">{comm.date}</span>
                      </div>
                      <p className="text-slate-600">{comm.content}</p>
                    </div>
                  </div>
                ))}

                {/* Comment Input */}
                <form onSubmit={e => handleAddComment(item.id, e)} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={commentInputs[item.id] || ''}
                    onChange={e => setCommentInputs({ ...commentInputs, [item.id]: e.target.value })}
                    placeholder="Adicione um comentário ou confirmação de presença..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

            </div>
          </article>
        ))}
      </div>

      {/* Modal: Publicar Novo Comunicado */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" />
                Publicar Comunicado no Feed
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título do Comunicado
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: Calendário de Avaliações e Aulas em Tempo Real"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoria do Aviso
                  </label>
                  <select
                    value={tag}
                    onChange={e => setTag(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="Live Especial">Live Especial</option>
                    <option value="Aviso Urgente">Aviso Urgente</option>
                    <option value="Novo Material">Novo Material</option>
                    <option value="Evento">Evento</option>
                    <option value="Devocional">Devocional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Público Alvo
                  </label>
                  <select
                    value={levelTarget}
                    onChange={e => setLevelTarget(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="todos">Todos os Níveis</option>
                    <option value="iniciante">Nível Iniciante</option>
                    <option value="intermediario">Nível Intermediário</option>
                    <option value="avancado">Nível Avançado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Texto do Comunicado
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Instruções claras para os alunos, datas, horários e links..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL da Imagem / Banner (Opcional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <label className="flex items-center gap-2 text-xs font-bold text-amber-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={e => setIsPinned(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>Fixar este comunicado no topo do Feed</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Publicar Comunicado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
