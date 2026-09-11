import React, { useState, useEffect } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Clock, LogIn, LogOut, X, Calendar, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';

export const AttendanceModal: React.FC = () => {
  const { isPresenceModalOpen, closePresenceModal, activeRecord, registerCheckIn, registerCheckOut } = useAttendance();
  const { user } = useAuth();
  const [notes, setNotes] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isPresenceModalOpen) return null;

  const todayFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const handleCheckIn = () => {
    registerCheckIn(notes || 'Acesso à Sala Virtual de Formação Bíblica');
    setNotes('');
  };

  const handleCheckOut = () => {
    registerCheckOut(notes || 'Estudo concluído com êxito');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className={`p-6 text-white ${activeRecord ? 'bg-gradient-to-r from-amber-600 to-amber-700' : 'bg-gradient-to-r from-emerald-600 to-teal-700'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {activeRecord ? 'Registro de Saída (Check-out)' : 'Registro de Presença (Entrada)'}
                </h3>
                <p className="text-xs text-emerald-100 opacity-90">
                  {activeRecord ? 'Finalize seu turno de estudo teológico' : 'Bem-vindo(a) à Academia Bíblica EAD'}
                </p>
              </div>
            </div>
            <button
              onClick={closePresenceModal}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Current clock badge */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="capitalize">{todayFormatted}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              {currentTime}
            </div>
          </div>

          {/* Student Status Card */}
          {user && (
            <div className="flex items-center gap-3 p-3 bg-slate-100/70 rounded-xl border border-slate-200">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-300"
              />
              <div className="text-xs">
                <div className="font-bold text-slate-900">{user.name}</div>
                <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="capitalize font-medium text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    Nível {user.level}
                  </span>
                  <span>• {user.congregation || 'Igreja Local'}</span>
                </div>
              </div>
            </div>
          )}

          {activeRecord ? (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <div className="font-semibold flex items-center gap-1.5 text-amber-800">
                  <Clock className="w-4 h-4" /> Sua sessão de presença está ativa!
                </div>
                <div className="mt-1">
                  Horário de Entrada registrado: <strong>{activeRecord.checkInTime}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Observações ou Conteúdos Estudados Hoje:
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Assisti a aula de Hermenêutica e participei do debate sobre os Salmos..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closePresenceModal}
                  className="flex-1 py-2.5 px-3 border border-slate-300 text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Continuar Conectado
                </button>
                <button
                  type="button"
                  onClick={handleCheckOut}
                  className="flex-1 py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Marcar Saída
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                <div className="font-semibold flex items-center gap-1.5 text-emerald-800">
                  <Sparkles className="w-4 h-4" /> Controle de Presença Obrigatório
                </div>
                <p className="mt-1 text-emerald-800">
                  Para cômputo de horas complementares e certificado teológico, confirme a sua entrada agora.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Objetivo de Estudo do Momento (Opcional):
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Assistir vídeo-aula, ler livro da biblioteca..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closePresenceModal}
                  className="py-2.5 px-3 border border-slate-300 text-slate-600 text-xs font-medium rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Lembrar Mais Tarde
                </button>
                <button
                  type="button"
                  onClick={handleCheckIn}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  Marcar Minha Presença (Entrada)
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
