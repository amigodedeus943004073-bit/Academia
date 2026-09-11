import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { BiblicalLevel, Teacher } from '../types';
import { VALID_COUNTRIES, CountryInfo, validatePhoneNumber, formatFullInternational } from '../data/countries';
import { 
  BookOpen, CheckCircle, Shield, MessageCircle, 
  Facebook, User, Phone, MapPin, Church, ArrowRight, 
  Sparkles, Lock, Key, Award, Users, Video, Globe, 
  RefreshCw, Check, AlertCircle, ArrowLeft
} from 'lucide-react';

interface RegisterGateProps {
  teachers: Teacher[];
}

export const RegisterGate: React.FC<RegisterGateProps> = ({ teachers }) => {
  const { loginWithWhatsApp, loginWithFacebook, loginAsSalomaoMuanjita, loginAsTeacherProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'whatsapp' | 'salomao' | 'professores' | 'facebook'>('whatsapp');

  // Country & WhatsApp form state
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(VALID_COUNTRIES[0]); // Default: Angola (+244)
  const [waName, setWaName] = useState('');
  const [waPhone, setWaPhone] = useState('');
  const [waLevel, setWaLevel] = useState<BiblicalLevel>('iniciante');
  const [waChurch, setWaChurch] = useState('');
  const [waCity, setWaCity] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Verification OTP State
  const [waStep, setWaStep] = useState<'form' | 'verify'>('form');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Facebook form
  const [fbName, setFbName] = useState('');
  const [fbId, setFbId] = useState('');
  const [fbEmail, setFbEmail] = useState('');
  const [fbLevel, setFbLevel] = useState<BiblicalLevel>('iniciante');

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (waStep === 'verify' && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [waStep, countdown]);

  // Handle WhatsApp form submit -> Generate verification code
  const handleRequestVerificationCode = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');

    if (!waName.trim()) {
      setPhoneError('Por favor, informe seu nome completo.');
      return;
    }

    const validation = validatePhoneNumber(waPhone, selectedCountry);
    if (!validation.valid) {
      setPhoneError(validation.reason || 'Número de WhatsApp inválido.');
      return;
    }

    // Generate 6-digit random code
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomCode);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setCountdown(60);
    setWaStep('verify');

    // Auto-focus first input after brief delay
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 150);
  };

  // Handle individual OTP digit input
  const handleOtpChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);
    setOtpError('');

    // If digit entered, auto-focus next
    if (char && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits entered, auto-validate
    if (char && index === 5 && newDigits.every(d => d !== '')) {
      validateAndComplete(newDigits.join(''));
    }
  };

  // Handle backspace key navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste full code
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const arr = pasted.split('');
      setOtpDigits(arr);
      validateAndComplete(pasted);
    }
  };

  // Fast-fill helper for instant testing
  const handleQuickFillCode = () => {
    if (!generatedOtp) return;
    const arr = generatedOtp.split('');
    setOtpDigits(arr);
    validateAndComplete(generatedOtp);
  };

  // Resend OTP code
  const handleResendOtp = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomCode);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setCountdown(60);
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 100);
  };

  // Validate OTP code and log in
  const validateAndComplete = (codeToTest?: string) => {
    const code = codeToTest || otpDigits.join('');
    if (code.length < 6) {
      setOtpError('Digite os 6 dígitos do código recebido no seu WhatsApp.');
      return;
    }

    if (code !== generatedOtp) {
      setOtpError('Código de verificação incorreto. Verifique a mensagem do WhatsApp e tente novamente.');
      return;
    }

    setIsVerifying(true);
    setVerificationSuccess(true);

    setTimeout(() => {
      const fullPhone = formatFullInternational(selectedCountry, waPhone);
      loginWithWhatsApp({
        name: waName.trim(),
        phone: fullPhone,
        countryCode: selectedCountry.dialCode,
        countryName: selectedCountry.name,
        level: waLevel,
        church: waChurch.trim() || 'Igreja Local',
        city: waCity.trim() || selectedCountry.name,
        isVerified: true
      });
    }, 800);
  };

  const handleFacebookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbName.trim()) return;

    loginWithFacebook({
      name: fbName.trim(),
      fbId: fbId.trim() || `fb-${Date.now()}`,
      email: fbEmail.trim(),
      level: fbLevel
    });
  };

  const handleSalomaoAccess = () => {
    loginAsSalomaoMuanjita();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Real-time WhatsApp Notification Dispatch Simulation Banner */}
      {generatedOtp && waStep === 'verify' && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-lg bg-emerald-950/95 border-2 border-emerald-500 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 shadow-md">
            <MessageCircle className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Mensagem WhatsApp Recebida
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Agora</span>
            </div>
            <p className="mt-1 text-slate-100 text-xs">
              Academia Bíblica EAD: Seu código oficial de validação é:{' '}
              <strong className="text-amber-300 text-sm tracking-widest bg-emerald-900/90 px-2.5 py-0.5 rounded-md font-mono border border-emerald-600">
                {generatedOtp}
              </strong>
            </p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-[10px] text-emerald-300">
                Para: {selectedCountry.flag} {selectedCountry.dialCode} {waPhone}
              </span>
              <button
                type="button"
                onClick={handleQuickFillCode}
                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded shadow-xs cursor-pointer"
              >
                ⚡ Preencher Código
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setGeneratedOtp(null)}
            className="text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
            title="Fechar aviso"
          >
            ✕
          </button>
        </div>
      )}

      {/* Platform Branding & Authority Banner */}
      <div className="max-w-3xl mx-auto w-full text-center space-y-3 mb-6">
        
        {/* Emblem & Responsible info */}
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-amber-300 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>Responsável Geral & Direção Acadêmica: <strong>Salomão Muanjita</strong></span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
            <BookOpen className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 tracking-wide">
            Academia Bíblica EAD
          </h1>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Formação teológica a distância com três níveis de maturidade: <strong>Iniciante</strong>, <strong>Intermediário</strong> e <strong>Avançado</strong>.
        </p>

        {/* Mandatory Registration Notice */}
        <div className="bg-amber-500/15 border border-amber-400/40 rounded-xl p-3 max-w-xl mx-auto text-center">
          <div className="text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            CADASTRO OBRIGATÓRIO VIA WHATSAPP COM CÓDIGO DE VALIDAÇÃO
          </div>
          <p className="text-slate-300 text-[11px] mt-0.5">
            O cadastro com conta de WhatsApp (nacional ou internacional) e validação por código é <strong>obrigatório para todos os estudantes</strong> antes de entrar na plataforma.
          </p>
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="max-w-xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">
        
        {/* Navigation Tabs for registration methods */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-800 bg-slate-950/60 p-1.5 text-xs font-semibold gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
            <span>WhatsApp (Obrigatório)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('salomao')}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'salomao'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Salomão (Diretor)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('professores')}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'professores'
                ? 'bg-purple-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-purple-300" />
            <span>Professores</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('facebook')}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'facebook'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Facebook className="w-3.5 h-3.5 text-blue-300" />
            <span>Facebook</span>
          </button>
        </div>

        {/* Tab 1: WhatsApp Mandatory Registration */}
        {activeTab === 'whatsapp' && (
          <div>
            {waStep === 'form' ? (
              <form onSubmit={handleRequestVerificationCode} className="p-6 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      Cadastro com WhatsApp & Código de Validação
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      Obrigatório
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Insira seu país (nacional ou internacional) e número de WhatsApp. Enviaremos um código de 6 dígitos para validar o seu acesso.
                  </p>
                </div>

                {phoneError && (
                  <div className="bg-red-950/80 border border-red-700/80 text-red-200 text-xs p-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{phoneError}</span>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nome Completo do Estudante *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={waName}
                      onChange={e => setWaName(e.target.value)}
                      placeholder="Ex: Mateus Ferreira de Souza"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Country & Phone Number */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    País e Número do WhatsApp *
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Country Selector */}
                    <div className="relative">
                      <select
                        value={selectedCountry.code}
                        onChange={e => {
                          const found = VALID_COUNTRIES.find(c => c.code === e.target.value);
                          if (found) {
                            setSelectedCountry(found);
                            setPhoneError('');
                          }
                        }}
                        className="w-full py-2 px-2.5 text-xs bg-slate-800/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      >
                        <optgroup label="Países Nacionais / Oficiais">
                          {VALID_COUNTRIES.filter(c => c.isNational).map(c => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.name} ({c.dialCode})
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Outros Países Válidos">
                          {VALID_COUNTRIES.filter(c => !c.isNational).map(c => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.name} ({c.dialCode})
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {/* Phone Input */}
                    <div className="sm:col-span-2 relative">
                      <div className="absolute left-3 top-2.5 text-xs font-bold text-amber-400 flex items-center gap-1 select-none">
                        <span>{selectedCountry.flag}</span>
                        <span>{selectedCountry.dialCode}</span>
                      </div>
                      <input
                        type="tel"
                        required
                        value={waPhone}
                        onChange={e => {
                          setWaPhone(e.target.value);
                          setPhoneError('');
                        }}
                        placeholder={`Ex: ${selectedCountry.example}`}
                        className="w-full pl-22 pr-3 py-2 text-xs bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <span>Formato aceito: <code className="text-emerald-300">{selectedCountry.format}</code></span>
                    <span>{selectedCountry.minLength === selectedCountry.maxLength ? `${selectedCountry.minLength} dígitos` : `${selectedCountry.minLength}-${selectedCountry.maxLength} dígitos`}</span>
                  </div>
                </div>

                {/* Biblical Level Selection - MANDATORY AND EXCLUSIVE RULE */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-amber-300">
                      Nível Teológico da Matrícula (Obrigatório) *
                    </label>
                    <span className="text-[10px] text-slate-400">Escolha com atenção</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Nível 1: Iniciante */}
                    <button
                      type="button"
                      onClick={() => setWaLevel('iniciante')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                        waLevel === 'iniciante'
                          ? 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/50 shadow-md'
                          : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400">Nível 1 • Iniciante</span>
                          {waLevel === 'iniciante' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          )}
                        </div>
                        <p className="text-[11px] font-semibold text-slate-200">Fundamentos & Doutrinas</p>
                        <p className="text-[10px] text-slate-400 leading-snug">
                          Evangelhos, Salvação, Fé Cristã e Fundamentos Elementares.
                        </p>
                      </div>
                      <div className="mt-2 text-[9px] font-semibold text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded-md inline-block self-start">
                        Acesso Aberto
                      </div>
                    </button>

                    {/* Nível 2: Intermediário */}
                    <button
                      type="button"
                      onClick={() => setWaLevel('intermediario')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                        waLevel === 'intermediario'
                          ? 'bg-amber-950/80 border-amber-500 ring-2 ring-amber-500/50 shadow-md'
                          : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-400">Nível 2 • Intermediário</span>
                          {waLevel === 'intermediario' && (
                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          )}
                        </div>
                        <p className="text-[11px] font-semibold text-slate-200">Hermenêutica & História</p>
                        <p className="text-[10px] text-slate-400 leading-snug">
                          Interpretação Bíblica, Contexto Histórico e Epístolas.
                        </p>
                      </div>
                      <div className="mt-2 text-[9px] font-semibold text-amber-300 bg-amber-900/50 px-2 py-0.5 rounded-md inline-block self-start">
                        Acesso Aberto
                      </div>
                    </button>

                    {/* Nível 3: Avançado */}
                    <button
                      type="button"
                      onClick={() => setWaLevel('avancado')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                        waLevel === 'avancado'
                          ? 'bg-purple-950/90 border-purple-500 ring-2 ring-purple-500/60 shadow-md'
                          : 'bg-slate-800/80 border-slate-700 hover:border-purple-600/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-purple-400" />
                            Nível 3 • Avançado
                          </span>
                          {waLevel === 'avancado' && (
                            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                          )}
                        </div>
                        <p className="text-[11px] font-semibold text-slate-100">Exegese & Teologia Sist.</p>
                        <p className="text-[10px] text-slate-300 leading-snug">
                          Grego, Hebraico, Dogmática e Hermenêutica Profunda.
                        </p>
                      </div>
                      <div className="mt-2 text-[9px] font-bold text-purple-200 bg-purple-900/80 border border-purple-700/60 px-2 py-0.5 rounded-md inline-block self-start">
                        Acesso Exclusivo no Cadastro
                      </div>
                    </button>
                  </div>

                  {/* Clarification banner based on selected level */}
                  {waLevel === 'avancado' ? (
                    <div className="bg-purple-950/50 border border-purple-700/60 p-2.5 rounded-xl text-xs text-purple-200 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div className="text-[11px]">
                        <strong>Nível Avançado selecionado:</strong> Seu acesso às disciplinas exegéticas, apostilas profundas e salas avançadas será liberado imediatamente desde o momento da inscrição.
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-xl text-xs text-slate-300 flex items-start gap-2">
                      <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-[11px] leading-relaxed">
                        <strong className="text-amber-300">Regra de Acesso ao Nível Avançado:</strong> O Nível Avançado é restrito exclusivamente a quem se matricular nele no momento da inscrição. Ao se matricular no nível <strong>{waLevel === 'iniciante' ? 'Iniciante' : 'Intermediário'}</strong>, o acesso ao Nível Avançado fica bloqueado e só poderá ser liberado pelo Gestor <strong>Salomão Muanjita</strong>.
                      </div>
                    </div>
                  )}
                </div>

                {/* Optional Church & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Congregação / Igreja Local (Opcional)
                    </label>
                    <div className="relative">
                      <Church className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={waChurch}
                        onChange={e => setWaChurch(e.target.value)}
                        placeholder="Ex: Igreja Evangélica Central"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Cidade / Província / Estado (Opcional)
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={waCity}
                        onChange={e => setWaCity(e.target.value)}
                        placeholder="Ex: Luanda, Lisboa, São Paulo"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button to send code */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Mandar Código de Verificação WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-2">
                    🔒 O envio do código de verificação é instantâneo e valida o seu WhatsApp na plataforma.
                  </p>
                </div>
              </form>
            ) : (
              /* Step 2: Verification Code Validation Screen */
              <div className="p-6 space-y-5 animate-in fade-in zoom-in duration-200">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-inner">
                    <Shield className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-base font-bold font-serif text-slate-100">
                    Validação do Código de Verificação
                  </h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Enviamos um código de segurança de 6 dígitos para o WhatsApp:
                  </p>
                  <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-mono font-bold text-amber-300">
                    <span>{selectedCountry.flag}</span>
                    <span>{selectedCountry.dialCode} {waPhone}</span>
                  </div>
                </div>

                {otpError && (
                  <div className="bg-red-950/80 border border-red-700/80 text-red-200 text-xs p-3 rounded-xl flex items-center gap-2 text-center justify-center">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{otpError}</span>
                  </div>
                )}

                {/* 6 Digit Input Cells */}
                <div className="space-y-2">
                  <label className="block text-center text-xs font-semibold text-slate-300">
                    Digite o código de 6 dígitos recebido:
                  </label>
                  <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={el => { otpInputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(idx, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(idx, e)}
                        className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono bg-slate-800 border-2 border-slate-700 focus:border-emerald-500 rounded-xl text-white focus:outline-none shadow-sm transition-all focus:ring-2 focus:ring-emerald-500/20"
                      />
                    ))}
                  </div>
                </div>

                {/* Quick Auto-Fill helper button */}
                {generatedOtp && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleQuickFillCode}
                      className="text-xs text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 font-medium"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Inserir código recebido automaticamente ({generatedOtp})</span>
                    </button>
                  </div>
                )}

                {/* Validation Actions */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    disabled={isVerifying}
                    onClick={() => validateAndComplete()}
                    className={`w-full py-3 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                      verificationSuccess 
                        ? 'bg-emerald-500 shadow-emerald-900/50' 
                        : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
                    }`}
                  >
                    {isVerifying ? (
                      <>
                        <Check className="w-4 h-4 animate-spin" />
                        <span>Validando WhatsApp e Liberando Acesso...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Validar Código & Entrar na Academia</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1 px-1">
                    <button
                      type="button"
                      onClick={() => setWaStep('form')}
                      className="text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Corrigir número</span>
                    </button>

                    {countdown > 0 ? (
                      <span className="text-slate-400 text-[11px] font-mono">
                        Reenviar código em 00:{countdown < 10 ? `0${countdown}` : countdown}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer underline text-[11px]"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reenviar novo código</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Salomão Muanjita (Responsável e Diretor) */}
        {activeTab === 'salomao' && (
          <div className="p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Shield className="w-4 h-4" />
                Autoria & Direção Geral
              </div>
              <h3 className="text-base font-bold font-serif text-slate-100 mt-1">
                Acesso Exclusivo: Salomão Muanjita
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ambiente de gestão, supervisão acadêmica, cadastro de professores, upload de aulas e controle integral da plataforma.
              </p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Salomão Muanjita"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/60 shadow-md shrink-0"
              />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-200">Salomão Muanjita</h4>
                <p className="text-[11px] text-slate-300">Responsável Geral & Diretor Acadêmico</p>
                <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
                  <span className="flex items-center gap-1">🇦🇴 +244 943 004 073</span>
                  <span>•</span>
                  <span className="text-amber-400">WhatsApp Oficial</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-300 bg-slate-800/70 p-3 rounded-xl border border-slate-700/80 space-y-1.5">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Privilégios de Autoria Exclusiva:
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1 pl-4 list-disc">
                <li>Opção de cadastrar e gerenciar novos professores</li>
                <li>Carregar arquivos de vídeo das aulas e gerenciar links</li>
                <li>Painel de Gestão centralizado e de autoria exclusiva</li>
                <li>Controle total de presenças de entrada e saída dos alunos</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleSalomaoAccess}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Entrar como Salomão Muanjita (Acesso de Gestão)</span>
            </button>
          </div>
        )}

        {/* Tab 3: Faculty / Professores */}
        {activeTab === 'professores' && (
          <div className="p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                Acesso do Corpo Docente (Professores)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Se você foi credenciado por <strong>Salomão Muanjita</strong>, selecione seu perfil docente para entrar:
              </p>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {teachers.map(teacher => (
                <div
                  key={teacher.id}
                  onClick={() => loginAsTeacherProfile(teacher)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={teacher.avatar}
                      alt={teacher.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-600"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                        {teacher.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">{teacher.title}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-800/60 text-purple-300 font-semibold mt-0.5 inline-block">
                        {teacher.subjects.join(' • ')}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-600 group-hover:bg-purple-500 text-white font-semibold transition-colors">
                    Entrar
                  </span>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 text-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
              Novos professores são cadastrados exclusivamente por <strong>Salomão Muanjita</strong> no Painel de Gestão.
            </div>
          </div>
        )}

        {/* Tab 4: Facebook Registration */}
        {activeTab === 'facebook' && (
          <form onSubmit={handleFacebookSubmit} className="p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-400" />
                Matrícula com Facebook
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Conecte seu perfil do Facebook para ter acesso às disciplinas bíblicas e à biblioteca.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nome do Estudante (como no Facebook) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={fbName}
                  onChange={e => setFbName(e.target.value)}
                  placeholder="Ex: João Batista Ribeiro"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email ou Telefone associado ao Facebook (Opcional)
              </label>
              <input
                type="text"
                value={fbEmail}
                onChange={e => setFbEmail(e.target.value)}
                placeholder="estudante@email.com"
                className="w-full px-3 py-2 text-xs bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Facebook Biblical Level Selection */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-blue-300">
                  Nível Teológico da Matrícula *
                </label>
                <span className="text-[10px] text-slate-400">Escolha com atenção</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setFbLevel('iniciante')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    fbLevel === 'iniciante'
                      ? 'bg-blue-950/80 border-blue-500 ring-2 ring-blue-500/50'
                      : 'bg-slate-800/80 border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold text-emerald-400 block">Nível 1 • Iniciante</span>
                  <span className="text-[10px] text-slate-300 block">Fundamentos e Doutrinas</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFbLevel('intermediario')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    fbLevel === 'intermediario'
                      ? 'bg-blue-950/80 border-blue-500 ring-2 ring-blue-500/50'
                      : 'bg-slate-800/80 border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold text-amber-400 block">Nível 2 • Intermediário</span>
                  <span className="text-[10px] text-slate-300 block">Hermenêutica e História</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFbLevel('avancado')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    fbLevel === 'avancado'
                      ? 'bg-purple-950/90 border-purple-500 ring-2 ring-purple-500/50'
                      : 'bg-slate-800/80 border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold text-purple-300 block flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Nível 3 • Avançado
                  </span>
                  <span className="text-[9px] text-purple-300 bg-purple-900/60 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block">
                    Exclusivo no Cadastro
                  </span>
                </button>
              </div>

              {fbLevel === 'avancado' ? (
                <div className="bg-purple-950/40 border border-purple-800/50 p-2 rounded-lg text-[11px] text-purple-200">
                  ✓ Acesso avançado garantido por ter sido escolhido na inscrição inicial.
                </div>
              ) : (
                <div className="bg-slate-800/80 border border-slate-700 p-2 rounded-lg text-[11px] text-slate-300">
                  🔒 O Nível Avançado fica restrito. Para acessá-lo depois, precisará de autorização de Salomão Muanjita.
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition-all cursor-pointer"
              >
                <span>Conectar com Facebook e Entrar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Footer Info */}
      <div className="max-w-xl mx-auto w-full text-center mt-6 text-slate-500 text-[11px] space-y-1">
        <p>© Academia Bíblica EAD — Formação Teológica Integral.</p>
        <p>Direção & Responsabilidade: Salomão Muanjita • Validação WhatsApp Nacional & Internacional</p>
      </div>

    </div>
  );
};

