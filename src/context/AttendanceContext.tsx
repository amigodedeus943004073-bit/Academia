import React, { createContext, useContext, useState, useEffect } from 'react';
import { AttendanceRecord, BiblicalLevel } from '../types';
import { INITIAL_ATTENDANCE_LOGS } from '../data/mockData';
import { useAuth } from './AuthContext';

interface AttendanceContextType {
  records: AttendanceRecord[];
  activeRecord: AttendanceRecord | null;
  hasPromptedEntry: boolean;
  isPresenceModalOpen: boolean;
  openPresenceModal: () => void;
  closePresenceModal: () => void;
  registerCheckIn: (notes?: string) => void;
  registerCheckOut: (notes?: string) => void;
  deleteRecord: (id: string) => void;
  markManualPresence: (record: Omit<AttendanceRecord, 'id'>) => void;
  todayOnlineCount: number;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('biblical_academy_attendance');
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_LOGS;
    } catch {
      return INITIAL_ATTENDANCE_LOGS;
    }
  });

  const [activeRecord, setActiveRecord] = useState<AttendanceRecord | null>(() => {
    try {
      const saved = localStorage.getItem('biblical_academy_active_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isPresenceModalOpen, setIsPresenceModalOpen] = useState(false);
  const [hasPromptedEntry, setHasPromptedEntry] = useState(false);

  // Automatically prompt attendance registration when user arrives if not already checked in
  useEffect(() => {
    if (user && !activeRecord && !hasPromptedEntry) {
      // Delay slightly so UI loads smoothly
      const timer = setTimeout(() => {
        setIsPresenceModalOpen(true);
        setHasPromptedEntry(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, activeRecord, hasPromptedEntry]);

  useEffect(() => {
    localStorage.setItem('biblical_academy_attendance', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    if (activeRecord) {
      localStorage.setItem('biblical_academy_active_session', JSON.stringify(activeRecord));
    } else {
      localStorage.removeItem('biblical_academy_active_session');
    }
  }, [activeRecord]);

  const getCurrentTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const registerCheckIn = (notes?: string) => {
    if (!user) return;
    const nowStr = getCurrentTimeString();
    const today = new Date().toISOString().split('T')[0];

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userLevel: user.level,
      role: user.role,
      date: today,
      checkInTime: nowStr,
      status: 'online',
      notes: notes || 'Entrada registrada pelo aluno'
    };

    setActiveRecord(newRecord);
    setRecords(prev => [newRecord, ...prev]);
    setIsPresenceModalOpen(false);
  };

  const registerCheckOut = (notes?: string) => {
    if (!activeRecord) return;
    const nowStr = getCurrentTimeString();

    // calculate approximate duration
    const [inHours, inMins] = activeRecord.checkInTime.split(':').map(Number);
    const now = new Date();
    const outHours = now.getHours();
    const outMins = now.getMinutes();
    const duration = Math.max(1, (outHours * 60 + outMins) - (inHours * 60 + inMins));

    const updated: AttendanceRecord = {
      ...activeRecord,
      checkOutTime: nowStr,
      durationMinutes: duration,
      status: 'finalizado',
      notes: notes || activeRecord.notes || 'Saída confirmada pelo aluno'
    };

    setRecords(prev => prev.map(r => r.id === activeRecord.id ? updated : r));
    setActiveRecord(null);
    setIsPresenceModalOpen(false);
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    if (activeRecord && activeRecord.id === id) {
      setActiveRecord(null);
    }
  };

  const markManualPresence = (newRec: Omit<AttendanceRecord, 'id'>) => {
    const record: AttendanceRecord = {
      ...newRec,
      id: `att-manual-${Date.now()}`
    };
    setRecords(prev => [record, ...prev]);
  };

  const todayOnlineCount = records.filter(
    r => r.status === 'online' && r.date === new Date().toISOString().split('T')[0]
  ).length;

  return (
    <AttendanceContext.Provider
      value={{
        records,
        activeRecord,
        hasPromptedEntry,
        isPresenceModalOpen,
        openPresenceModal: () => setIsPresenceModalOpen(true),
        closePresenceModal: () => setIsPresenceModalOpen(false),
        registerCheckIn,
        registerCheckOut,
        deleteRecord,
        markManualPresence,
        todayOnlineCount
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
