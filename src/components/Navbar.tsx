import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { BiblicalLevel } from '../types';
import { 
  BookOpen, Video, MessageSquare, Bell, UserCheck, 
  Clock, LogIn, LogOut, Shield, GraduationCap, ChevronDown,
  Lock, AlertCircle, X, MessageCircle
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'sala' | 'biblioteca' | 'debates' | 'feed' | 'presenca' | 'gestao';
  onSelectTab: (tab: 'sala' | 'biblioteca' | 'debates' | 'feed' | 'presenca' | 'gestao') => void;
  selectedLevel: BiblicalLevel | 'todos';
  onSelectLevel: (lvl: BiblicalLevel | 'todos') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  selectedLevel,
  onSelectLevel
}) => {
  const { user, isSalomaoMuanjita, canAccessAdvanced, openAuthModal, toggleRole, updateLevel, logout } = useAuth();
  const { activeRecord, openPresenceModal, todayOnlineCount } = useAttendance();
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);

  const handleLevelClick = (lvl: BiblicalLevel | 'todos') => {
    if (lvl === 'avancado' && !canAccessAdvanced) {
      setShowRestrictedModal(true);
      return;
    }

    onSelectLevel(lvl);
    if (user && lvl !== 'todos') {
      updateLevel(lvl);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      
      {/* Top utility row: Presence reminder banner & quick stats */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{todayOnlineCount} estudantes e professores online</span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <div className="hidden sm:flex items-center gap-1 text-amber-300/90 text-[11px] font-medium">
            <Shield className="w-3 h-3 text-amber-400" />
            <span>Responsável Geral: <strong>Salomão Muanjita</strong></span>
          </div>
        </div>

        {/* Presence prompt button directly on top bar */}
        <div className="flex items-center gap-2">
          {activeRecord ? (
            <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-0.5 rounded-full text-[11px] text-emerald-300">
              <Clock className="w-3 h-3 text-emerald-400 animate-spin" />
              <span>Entrada: <strong>{activeRecord.checkInTime}</strong></span>
              <button
                onClick={openPresenceModal}
                className="ml-1 text-emerald-200 hover:text-white underline font-bold cursor-pointer"
              >
                Marcar Saída
              </button>
            </div>
          ) : (
            <button
              onClick={openPresenceModal}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-0.5 rounded-full text-[11px] shadow-xs transition-colors cursor-pointer"
            >
              <LogIn className="w-3 h-3" />
              Marcar Presença de Entrada
            </button>
          )}

          {/* Role indicator / switcher */}
          <button
            onClick={toggleRole}
            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
            title="Alternar função"
          >
            Modo: <strong className="text-amber-400 capitalize">{user?.role || 'Aluno'}</strong>
          </button>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand */}
        <div
          onClick={() => onSelectTab('sala')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold font-serif tracking-wide text-amber-200 flex items-center gap-1.5">
              Academia Bíblica EAD
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Teologia & Formação Bíblica a Distância
            </div>
          </div>
        </div>

        {/* Central Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => onSelectTab('sala')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'sala'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Sala Virtual & Ao Vivo</span>
          </button>

          <button
            onClick={() => onSelectTab('biblioteca')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'biblioteca'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Biblioteca</span>
          </button>

          <button
            onClick={() => onSelectTab('debates')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'debates'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
            <span>Debates & Vídeo WhatsApp</span>
          </button>

          <button
            onClick={() => onSelectTab('feed')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'feed'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Feed Comunicados</span>
          </button>

          <button
            onClick={() => onSelectTab('presenca')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'presenca'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Controle Presença</span>
          </button>

          <button
            onClick={() => onSelectTab('gestao')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'gestao'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : isSalomaoMuanjita
                ? 'text-amber-300 hover:text-amber-200 hover:bg-amber-500/20 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Gestão Salomão Muanjita</span>
            {isSalomaoMuanjita && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/30 text-amber-300 font-bold">
                Autor
              </span>
            )}
          </button>
        </nav>

        {/* User Account / Profile Info */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2.5 bg-slate-800/90 pl-2 pr-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-600"
              />
              <div className="hidden sm:block text-left">
                <div className="font-bold text-slate-100 line-clamp-1 max-w-[130px]">{user.name}</div>
                <div className="text-[10px] text-amber-300 font-semibold capitalize flex items-center gap-1">
                  <span>Nível {user.level}</span>
                  <span>•</span>
                  <span className="text-slate-400">Inscrito: {user.registeredLevel || user.level}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 ml-1 border-l border-slate-700 pl-2">
                <button
                  onClick={openAuthModal}
                  className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                  title="Trocar perfil ou entrar com outra conta"
                >
                  Trocar
                </button>
                <span className="text-slate-600 text-[10px]">•</span>
                <button
                  onClick={logout}
                  className="text-[11px] text-red-400 hover:text-red-300 underline cursor-pointer"
                  title="Sair / Desconectar da plataforma"
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              Entrar (WhatsApp / Facebook)
            </button>
          )}
        </div>

      </div>

      {/* Secondary Level Filter Banner */}
      <div className="bg-slate-800/80 px-4 py-2 border-t border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400 font-medium">Filtrar Conteúdo por Nível Teológico:</span>
        </div>

        <div className="flex items-center gap-1.5">
          {(['todos', 'iniciante', 'intermediario', 'avancado'] as const).map(lvl => {
            const isRestrictedAdv = lvl === 'avancado' && !canAccessAdvanced;
            return (
              <button
                key={lvl}
                onClick={() => handleLevelClick(lvl)}
                title={isRestrictedAdv ? 'Nível Avançado restrito aos alunos cadastrados neste nível' : undefined}
                className={`px-3 py-1 rounded-lg text-xs capitalize transition-all font-semibold cursor-pointer flex items-center gap-1.5 ${
                  selectedLevel === lvl
                    ? lvl === 'iniciante'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : lvl === 'intermediario'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : lvl === 'avancado'
                      ? 'bg-purple-600 text-white shadow-2xs'
                      : 'bg-slate-200 text-slate-900 font-bold'
                    : isRestrictedAdv
                    ? 'text-slate-500 hover:text-slate-300 bg-slate-800/60 border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
                }`}
              >
                {isRestrictedAdv && <Lock className="w-3 h-3 text-amber-400" />}
                <span>{lvl === 'todos' ? 'Todos os Níveis' : lvl}</span>
                {isRestrictedAdv && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-mono">
                    Restrito
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Level Restriction Modal */}
      {showRestrictedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lock className="w-6 h-6" />
              </div>
              <button
                onClick={() => setShowRestrictedModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold font-serif text-amber-300">
                Acesso Restrito: Nível Avançado
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                De acordo com as regras estabelecidas pela Academia Bíblica, <strong>o Nível Avançado (Exegese, Grego/Hebraico e Teologia Sistemática) só pode ser acessado por quem o selecionou no momento da inscrição</strong>.
              </p>
              {user && (
                <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl text-xs space-y-1">
                  <div className="text-slate-400">Seu registro atual:</div>
                  <div className="font-semibold text-white">
                    Estudante: <span className="text-amber-300">{user.name}</span>
                  </div>
                  <div className="text-slate-300">
                    Nível escolhido na matrícula: <strong className="capitalize text-emerald-400">{user.registeredLevel || user.level}</strong>
                  </div>
                </div>
              )}
              <p className="text-xs text-slate-400 leading-relaxed">
                Para solicitar a liberação excepcional do Nível Avançado, entre em contato diretamente com o gestor <strong>Salomão Muanjita</strong>.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <a
                href={`https://wa.me/244943004073?text=${encodeURIComponent(
                  `Olá Salomão Muanjita, sou o aluno(a) ${user?.name || 'da Academia Bíblica'} e gostaria de solicitar liberação para o Nível Avançado.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Falar com Salomão no WhatsApp</span>
              </a>
              <button
                onClick={() => setShowRestrictedModal(false)}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
