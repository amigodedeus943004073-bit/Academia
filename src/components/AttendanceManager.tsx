import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { useAuth } from '../context/AuthContext';
import { BiblicalLevel, AttendanceRecord } from '../types';
import { 
  Users, CheckCircle2, Clock, Search, Filter, Plus, 
  Download, Trash2, ArrowUpRight, UserCheck, ShieldCheck, UserX 
} from 'lucide-react';

export const AttendanceManager: React.FC = () => {
  const { records, deleteRecord, markManualPresence, openPresenceModal, activeRecord } = useAttendance();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<'todos' | BiblicalLevel>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'online' | 'finalizado'>('todos');
  const [showAddManual, setShowAddManual] = useState(false);

  // Manual record form
  const [manualName, setManualName] = useState('');
  const [manualLevel, setManualLevel] = useState<BiblicalLevel>('iniciante');
  const [manualInTime, setManualInTime] = useState('08:00');
  const [manualOutTime, setManualOutTime] = useState('09:30');
  const [manualNotes, setManualNotes] = useState('');

  const filteredRecords = records.filter(rec => {
    const matchesSearch = rec.userName.toLowerCase().includes(search.toLowerCase()) ||
      (rec.notes && rec.notes.toLowerCase().includes(search.toLowerCase()));
    const matchesLevel = levelFilter === 'todos' || rec.userLevel === levelFilter;
    const matchesStatus = statusFilter === 'todos' || rec.status === statusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const onlineCount = records.filter(r => r.status === 'online').length;
  const completedCount = records.filter(r => r.status === 'finalizado').length;

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName) return;

    markManualPresence({
      userId: `user-manual-${Date.now()}`,
      userName: manualName,
      userAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(manualName)}`,
      userLevel: manualLevel,
      role: 'aluno',
      date: new Date().toISOString().split('T')[0],
      checkInTime: manualInTime,
      checkOutTime: manualOutTime || undefined,
      durationMinutes: 90,
      status: manualOutTime ? 'finalizado' : 'online',
      notes: manualNotes || 'Registro manual inserido pela coordenação'
    });

    setManualName('');
    setManualNotes('');
    setShowAddManual(false);
  };

  const handleExportCSV = () => {
    const headers = 'ID,Nome,Nivel,Data,Entrada,Saida,Duracao(min),Status,Observacoes\n';
    const rows = filteredRecords.map(r => 
      `"${r.id}","${r.userName}","${r.userLevel}","${r.date}","${r.checkInTime}","${r.checkOutTime || ''}","${r.durationMinutes || ''}","${r.status}","${r.notes || ''}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `frequencia_biblica_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Control Summary Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Alunos Online Agora
            </span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1 flex items-center gap-2">
              {onlineCount}
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Presentes nas salas virtuais</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sessões Concluídas Hoje
            </span>
            <div className="text-2xl font-extrabold text-slate-800 mt-1">
              {completedCount}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Registraram saída com sucesso</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Seu Status Pessoal
            </span>
            <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
              {activeRecord ? (
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-xs font-bold">
                  ● Presença Ativa ({activeRecord.checkInTime})
                </span>
              ) : (
                <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-xs font-bold">
                  ○ Entrada Não Registrada
                </span>
              )}
            </div>
            <button
              onClick={openPresenceModal}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline mt-1.5 inline-block cursor-pointer"
            >
              {activeRecord ? 'Registrar Saída' : 'Marcar Entrada Agora'}
            </button>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Índice de Frequência
            </span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">
              92.4%
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
              +4.8% em relação à semana anterior
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Control Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Header & Actions */}
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              Controle Geral de Presença (Entrada e Saída)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Supervisão em tempo real da assiduidade e pontualidade dos estudantes teológicos
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddManual(!showAddManual)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Lançamento Manual
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Exportar Lista (CSV)
            </button>
          </div>
        </div>

        {/* Manual Add Form Toggle */}
        {showAddManual && (
          <div className="p-6 bg-slate-50 border-b border-slate-200 animate-in fade-in duration-200">
            <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider mb-3">
              Adicionar Registro de Presença Manual (Coordenação)
            </h4>
            <form onSubmit={handleCreateManual} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <input
                type="text"
                required
                placeholder="Nome do Aluno..."
                value={manualName}
                onChange={e => setManualName(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
              />
              <select
                value={manualLevel}
                onChange={e => setManualLevel(e.target.value as BiblicalLevel)}
                className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
              >
                <option value="iniciante">Nível Iniciante</option>
                <option value="intermediario">Nível Intermediário</option>
                <option value="avancado">Nível Avançado</option>
              </select>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500">Entrada:</span>
                <input
                  type="time"
                  required
                  value={manualInTime}
                  onChange={e => setManualInTime(e.target.value)}
                  className="px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg w-full"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500">Saída:</span>
                <input
                  type="time"
                  value={manualOutTime}
                  onChange={e => setManualOutTime(e.target.value)}
                  className="px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg w-full"
                />
              </div>
              <button
                type="submit"
                className="py-2 px-4 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 cursor-pointer"
              >
                Salvar Presença
              </button>
            </form>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar aluno ou matéria..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Level Filter */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300 text-xs">
              {(['todos', 'iniciante', 'intermediario', 'avancado'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors font-medium ${
                    levelFilter === lvl
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300 text-xs">
              {(['todos', 'online', 'finalizado'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors font-medium ${
                    statusFilter === st
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st === 'online' ? 'Online' : st === 'finalizado' ? 'Finalizado' : 'Todos'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table of Records */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Estudante Teológico</th>
                <th className="py-3 px-4">Nível</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Entrada</th>
                <th className="py-3 px-4">Saída</th>
                <th className="py-3 px-4">Tempo Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Observação / Estudo</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Nenhum registro de presença encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={r.userAvatar}
                          alt={r.userName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{r.userName}</div>
                          <div className="text-[10px] text-slate-400 capitalize">{r.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                        r.userLevel === 'iniciante'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.userLevel === 'intermediario'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {r.userLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {r.date}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-emerald-700">
                      {r.checkInTime}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {r.checkOutTime || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">
                      {r.durationMinutes ? `${r.durationMinutes} min` : 'Em curso'}
                    </td>
                    <td className="py-3 px-4">
                      {r.status === 'online' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          Finalizado
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate" title={r.notes}>
                      {r.notes || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteRecord(r.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Excluir registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
