import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, BiblicalLevel, UserRole, Teacher } from '../types';

export const SALOMAO_MUANJITA_USER: UserProfile = {
  id: 'user-salomao-muanjita',
  name: 'Salomão Muanjita',
  email: 'amigodeDeus943004073@gmail.com',
  authProvider: 'diretoria',
  whatsappNumber: '+244 943 004 073',
  countryCode: '+244',
  countryName: 'Angola',
  isVerifiedWhatsApp: true,
  verifiedAt: '2025-01-01',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  role: 'responsavel',
  level: 'avancado',
  registeredLevel: 'avancado',
  advancedAccessGranted: true,
  congregation: 'Diretoria Geral & Coordenação Acadêmica',
  city: 'Coordenação Central',
  joinedAt: '2025-01-01',
  totalHoursStudied: 160,
  isAuthorMaster: true
};

export const INITIAL_ENROLLED_STUDENTS: UserProfile[] = [
  {
    id: 'student-1',
    name: 'Mateus Ferreira de Souza',
    whatsappNumber: '+244 923 111 222',
    countryCode: '+244',
    countryName: 'Angola',
    isVerifiedWhatsApp: true,
    authProvider: 'whatsapp',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Mateus',
    role: 'aluno',
    level: 'iniciante',
    registeredLevel: 'iniciante',
    advancedAccessGranted: false,
    congregation: 'Igreja Batista de Luanda',
    city: 'Luanda',
    joinedAt: '2026-02-10',
    totalHoursStudied: 18
  },
  {
    id: 'student-2',
    name: 'Priscila Rocha dos Santos',
    whatsappNumber: '+55 11 98888-7777',
    countryCode: '+55',
    countryName: 'Brasil',
    isVerifiedWhatsApp: true,
    authProvider: 'whatsapp',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Priscila',
    role: 'aluno',
    level: 'intermediario',
    registeredLevel: 'intermediario',
    advancedAccessGranted: false,
    congregation: 'Igreja Presbiteriana Central',
    city: 'São Paulo',
    joinedAt: '2026-02-15',
    totalHoursStudied: 32
  },
  {
    id: 'student-3',
    name: 'Ezequiel Kiala Manuel',
    whatsappNumber: '+244 944 555 666',
    countryCode: '+244',
    countryName: 'Angola',
    isVerifiedWhatsApp: true,
    authProvider: 'whatsapp',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ezequiel',
    role: 'aluno',
    level: 'avancado',
    registeredLevel: 'avancado',
    advancedAccessGranted: true,
    congregation: 'Assembleia de Deus Pentecostal',
    city: 'Benguela',
    joinedAt: '2026-01-20',
    totalHoursStudied: 74
  }
];

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isSalomaoMuanjita: boolean;
  canAccessAdvanced: boolean;
  canAccessLevel: (lvl: BiblicalLevel | 'todos') => boolean;
  studentsList: UserProfile[];
  grantAdvancedAccess: (userId: string, granted: boolean) => void;
  loginWithWhatsApp: (data: { 
    name: string; 
    phone: string; 
    countryCode?: string; 
    countryName?: string; 
    level: BiblicalLevel; 
    church?: string; 
    city?: string;
    isVerified?: boolean;
  }) => void;
  loginWithFacebook: (data: { name: string; fbId: string; level: BiblicalLevel; email?: string }) => void;
  loginAsSalomaoMuanjita: () => void;
  loginAsTeacherProfile: (teacher: Teacher) => void;
  logout: () => void;
  updateLevel: (level: BiblicalLevel) => boolean;
  toggleRole: () => void;
  setRole: (role: UserRole) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('biblical_academy_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure registeredLevel is present
        if (!parsed.registeredLevel) {
          parsed.registeredLevel = parsed.level || 'iniciante';
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [studentsList, setStudentsList] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('biblical_academy_students_directory');
      return saved ? JSON.parse(saved) : INITIAL_ENROLLED_STUDENTS;
    } catch {
      return INITIAL_ENROLLED_STUDENTS;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('biblical_academy_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('biblical_academy_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('biblical_academy_students_directory', JSON.stringify(studentsList));
  }, [studentsList]);

  const isSalomaoMuanjita = !!(
    user && (user.isAuthorMaster || user.name.toLowerCase().includes('salomão muanjita') || user.name.toLowerCase().includes('salomao muanjita') || user.role === 'responsavel')
  );

  // Advanced level access check rule:
  // "o nível avançado só acessa quem fez no momento da inscrição ou for liberado pelo gestor Salomão Muanjita"
  const canAccessAdvanced = !!(
    user && (
      isSalomaoMuanjita ||
      user.role === 'responsavel' ||
      user.role === 'professor' ||
      user.registeredLevel === 'avancado' ||
      user.advancedAccessGranted === true
    )
  );

  const canAccessLevel = (lvl: BiblicalLevel | 'todos'): boolean => {
    if (lvl === 'todos' || lvl === 'iniciante' || lvl === 'intermediario') {
      return true;
    }
    if (lvl === 'avancado') {
      return canAccessAdvanced;
    }
    return true;
  };

  const grantAdvancedAccess = (userId: string, granted: boolean) => {
    setStudentsList(prev => prev.map(st => {
      if (st.id === userId) {
        return {
          ...st,
          advancedAccessGranted: granted,
          level: granted ? 'avancado' : st.registeredLevel
        };
      }
      return st;
    }));

    // If active user is the one being modified, update active state too
    if (user && user.id === userId) {
      setUser({
        ...user,
        advancedAccessGranted: granted,
        level: granted ? 'avancado' : user.registeredLevel
      });
    }
  };

  const loginWithWhatsApp = (data: { 
    name: string; 
    phone: string; 
    countryCode?: string; 
    countryName?: string; 
    level: BiblicalLevel; 
    church?: string; 
    city?: string;
    isVerified?: boolean;
  }) => {
    const isMaster = data.name.trim().toLowerCase() === 'salomão muanjita' || data.name.trim().toLowerCase() === 'salomao muanjita';
    const isAdvEnrolled = data.level === 'avancado' || isMaster;

    const newUser: UserProfile = {
      id: isMaster ? 'user-salomao-muanjita' : `user-wa-${Date.now()}`,
      name: isMaster ? 'Salomão Muanjita' : data.name,
      authProvider: 'whatsapp',
      whatsappNumber: data.phone,
      countryCode: data.countryCode || '+244',
      countryName: data.countryName || 'Angola',
      isVerifiedWhatsApp: data.isVerified ?? true,
      verifiedAt: new Date().toISOString(),
      avatar: isMaster 
        ? SALOMAO_MUANJITA_USER.avatar 
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
      role: isMaster ? 'responsavel' : 'aluno',
      level: data.level,
      registeredLevel: data.level, // Store level chosen at registration
      advancedAccessGranted: isAdvEnrolled,
      congregation: data.church || (isMaster ? 'Diretoria Geral' : 'Igreja Local'),
      city: data.city || 'Comunidade Cristã',
      joinedAt: new Date().toISOString().split('T')[0],
      totalHoursStudied: isMaster ? 160 : 0,
      isAuthorMaster: isMaster
    };

    setUser(newUser);

    // Add to students directory if not master
    if (!isMaster) {
      setStudentsList(prev => {
        const filtered = prev.filter(s => s.whatsappNumber !== newUser.whatsappNumber);
        return [newUser, ...filtered];
      });
    }

    setIsAuthModalOpen(false);
  };

  const loginWithFacebook = (data: { name: string; fbId: string; level: BiblicalLevel; email?: string }) => {
    const isMaster = data.name.trim().toLowerCase() === 'salomão muanjita' || data.name.trim().toLowerCase() === 'salomao muanjita';
    const isAdvEnrolled = data.level === 'avancado' || isMaster;

    const newUser: UserProfile = {
      id: isMaster ? 'user-salomao-muanjita' : `user-fb-${Date.now()}`,
      name: isMaster ? 'Salomão Muanjita' : data.name,
      email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '')}@facebook.com`,
      authProvider: 'facebook',
      facebookId: data.fbId,
      avatar: isMaster 
        ? SALOMAO_MUANJITA_USER.avatar 
        : `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      role: isMaster ? 'responsavel' : 'aluno',
      level: data.level,
      registeredLevel: data.level,
      advancedAccessGranted: isAdvEnrolled,
      congregation: isMaster ? 'Diretoria Geral' : 'Membro em Comunhão',
      city: 'Comunidade Cristã Facebook',
      joinedAt: new Date().toISOString().split('T')[0],
      totalHoursStudied: isMaster ? 160 : 0,
      isAuthorMaster: isMaster
    };

    setUser(newUser);

    if (!isMaster) {
      setStudentsList(prev => {
        const filtered = prev.filter(s => s.id !== newUser.id);
        return [newUser, ...filtered];
      });
    }

    setIsAuthModalOpen(false);
  };

  const loginAsSalomaoMuanjita = () => {
    setUser(SALOMAO_MUANJITA_USER);
    setIsAuthModalOpen(false);
  };

  const loginAsTeacherProfile = (teacher: Teacher) => {
    const teacherUser: UserProfile = {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      authProvider: 'whatsapp',
      whatsappNumber: teacher.whatsapp,
      avatar: teacher.avatar,
      role: 'professor',
      level: teacher.levelTarget === 'todos' ? 'avancado' : teacher.levelTarget,
      registeredLevel: 'avancado',
      advancedAccessGranted: true,
      congregation: 'Corpo Docente',
      city: 'Docência EAD',
      joinedAt: teacher.createdAt,
      totalHoursStudied: 80,
      isAuthorMaster: false
    };
    setUser(teacherUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const updateLevel = (level: BiblicalLevel): boolean => {
    if (!user) return false;

    // Strict validation for advanced level
    if (level === 'avancado') {
      const allowed = canAccessAdvanced;
      if (!allowed) {
        return false;
      }
    }

    setUser({ ...user, level });
    return true;
  };

  const toggleRole = () => {
    if (user) {
      if (user.isAuthorMaster) {
        setUser({
          ...user,
          role: user.role === 'responsavel' ? 'aluno' : 'responsavel'
        });
      } else {
        setUser({
          ...user,
          role: user.role === 'aluno' ? 'professor' : 'aluno'
        });
      }
    }
  };

  const setRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isSalomaoMuanjita,
        canAccessAdvanced,
        canAccessLevel,
        studentsList,
        grantAdvancedAccess,
        loginWithWhatsApp,
        loginWithFacebook,
        loginAsSalomaoMuanjita,
        loginAsTeacherProfile,
        logout,
        updateLevel,
        toggleRole,
        setRole,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        isAuthModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
