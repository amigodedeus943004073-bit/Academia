import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BiblicalLevel } from '../types';
import { VALID_COUNTRIES, CountryInfo, validatePhoneNumber, formatFullInternational } from '../data/countries';
import { MessageSquare, ShieldCheck, X, Check, BookOpen, GraduationCap, Phone, User, Church, AlertCircle, Sparkles, RefreshCw, MessageCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithWhatsApp, loginWithFacebook } = useAuth();
  const [authMethod, setAuthMethod] = useState<'whatsapp' | 'facebook'>('whatsapp');
  
  // WhatsApp Form fields
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(VALID_COUNTRIES[0]);
  const [waName, setWaName] = useState('');
  const [waPhone, setWaPhone] = useState('');
  const [waChurch, setWaChurch] = useState('');
  const [waLevel, setWaLevel] = useState<BiblicalLevel>('iniciante');
  const [phoneError, setPhoneError] = useState('');

  // WhatsApp OTP Verification fields
  const [waStep, setWaStep] = useState<'form' | 'verify'>('form');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [waCode, setWaCode] = useState('');
  const [otpError, setOtpError] = useState('');

  // Facebook Form fields
  const [fbName, setFbName] = useState('');
  const [fbLevel, setFbLevel] = useState<BiblicalLevel>('iniciante');

  if (!isAuthModalOpen) return null;

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');

    if (!waName.trim()) {
      setPhoneError('Por favor, informe seu nome.');
      return;
    }

    const validation = validatePhoneNumber(waPhone, selectedCountry);
    if (!validation.valid) {
      setPhoneError(validation.reason || 'Número de WhatsApp inválido.');
      return;
    }

    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomCode);
    setWaCode('');
    setOtpError('');
    setWaStep('verify');
  };

  const handleConfirmVerification = () => {
    if (!waCode.trim() || waCode.trim().length < 6) {
      setOtpError('Digite o código de 6 dígitos enviado ao seu WhatsApp.');
      return;
    }

    if (waCode.trim() !== generatedOtp) {
      setOtpError('Código de verificação incorreto. Tente novamente.');
      return;
    }

    const fullPhone = formatFullInternational(selectedCountry, waPhone);
    loginWithWhatsApp({
      name: waName.trim(),
      phone: fullPhone,
      countryCode: selectedCountry.dialCode,
      countryName: selectedCountry.name,
      level: waLevel,
      church: waChurch.trim() || 'Igreja Local',
      isVerified: true
    });
    setWaStep('form');
  };

  const handleQuickFillCode = () => {
    if (generatedOtp) {
      setWaCode(generatedOtp);
      setOtpError('');
    }
  };

  const handleFacebookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = fbName || 'Aluno(a) Cristão';
    loginWithFacebook({
      name,
      fbId: 'fb-' + Math.floor(Math.random() * 1000000),
      level: fbLevel
    });
  };

  // Quick Preset demo logins
  const handleQuickLogin = (role: 'iniciante' | 'intermediario' | 'avancado' | 'professor') => {
    if (role === 'professor') {
      loginWithWhatsApp({
        name: 'Pr. Carlos Eduardo Vieira',
        phone: '+55 (11) 99887-1122',
        level: 'avancado',
        church: 'Igreja Batista Bíblica'
      });
    } else {
      const names = {
        iniciante: 'Gabriel Santos (Iniciante)',
        intermediario: 'Mariana Oliveira (Intermediário)',
        avancado: 'Presbítero João Paulo (Avançado)'
      };
      loginWithWhatsApp({
        name: names[role],
        phone: '+55 (21) 98765-4321',
        level: role,
        church: 'Assembleia Central'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif tracking-wide text-amber-200">
                Acesso à Formação Bíblica
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Cadastre-se ou entre com a sua conta do WhatsApp ou Facebook
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-2 mt-6 p-1 bg-slate-800/80 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => { setAuthMethod('whatsapp'); setWaStep('form'); }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                authMethod === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-300" />
              WhatsApp
            </button>

            <button
              type="button"
              onClick={() => setAuthMethod('facebook')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                authMethod === 'facebook'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {authMethod === 'whatsapp' ? (
            waStep === 'form' ? (
              <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                {phoneError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{phoneError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" /> Seu Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={waName}
                    onChange={(e) => setWaName(e.target.value)}
                    placeholder="Ex: João da Silva Santos"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all"
                  />
                </div>

                {/* Country + WhatsApp Phone */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" /> País e WhatsApp *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    <div className="sm:col-span-2">
                      <select
                        value={selectedCountry.code}
                        onChange={(e) => {
                          const found = VALID_COUNTRIES.find(c => c.code === e.target.value);
                          if (found) {
                            setSelectedCountry(found);
                            setPhoneError('');
                          }
                        }}
                        className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        {VALID_COUNTRIES.map(country => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.name} ({country.dialCode})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <input
                        type="tel"
                        required
                        value={waPhone}
                        onChange={(e) => {
                          setWaPhone(e.target.value);
                          setPhoneError('');
                        }}
                        placeholder={selectedCountry.placeholder}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white font-mono transition-all"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Ex: {selectedCountry.name} ({selectedCountry.dialCode}) — O código de 6 dígitos será enviado para validar este WhatsApp.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <Church className="w-3.5 h-3.5 text-slate-500" /> Congregação / Igreja Local (Opcional)
                  </label>
                  <input
                    type="text"
                    value={waChurch}
                    onChange={(e) => setWaChurch(e.target.value)}
                    placeholder="Ex: Igreja Batista Central, Assembleia de Deus..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500" /> Nível de Formação Bíblica Desejado
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'iniciante', label: 'Iniciante', sub: 'Fundamentos' },
                      { id: 'intermediario', label: 'Intermediário', sub: 'Hermenêutica' },
                      { id: 'avancado', label: 'Avançado', sub: 'Exegese / Grego' },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setWaLevel(lvl.id as BiblicalLevel)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          waLevel === lvl.id
                            ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-semibold ring-1 ring-emerald-500'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-bold">{lvl.label}</div>
                        <div className="text-[10px] text-slate-500">{lvl.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  Mandar Código de Verificação
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-center py-2">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">
                  Código de Verificação WhatsApp
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Enviamos o código para <strong>{selectedCountry.dialCode} {waPhone}</strong> ({selectedCountry.name}).
                </p>

                {otpError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded-xl max-w-xs mx-auto">
                    {otpError}
                  </div>
                )}

                {/* Demonstration code banner */}
                {generatedOtp && (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 max-w-xs mx-auto text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Código gerado:
                      </span>
                      <button
                        type="button"
                        onClick={handleQuickFillCode}
                        className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded font-semibold cursor-pointer"
                      >
                        Auto-preencher
                      </button>
                    </div>
                    <div className="text-center font-mono text-xl font-bold tracking-widest text-emerald-950 mt-1">
                      {generatedOtp}
                    </div>
                  </div>
                )}

                <div className="max-w-xs mx-auto">
                  <input
                    type="text"
                    maxLength={6}
                    value={waCode}
                    onChange={(e) => {
                      setWaCode(e.target.value);
                      setOtpError('');
                    }}
                    placeholder="Digite o código (6 dígitos)"
                    className="w-full text-center tracking-widest text-xl font-mono font-bold py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => setWaStep('form')}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-600 text-xs font-medium hover:bg-slate-50 cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmVerification}
                    className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Validar & Entrar
                  </button>
                </div>
              </div>
            )
          ) : (
            <form onSubmit={handleFacebookSubmit} className="space-y-4">
              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-2.5">
                <div className="p-1 rounded bg-blue-600 text-white mt-0.5">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div>
                  <strong>Conexão Segura Facebook:</strong> Seus dados de perfil serão vinculados à sua matrícula na Academia Bíblica para emissão de certificados e acesso às salas.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" /> Nome no Perfil do Facebook
                </label>
                <input
                  type="text"
                  required
                  value={fbName}
                  onChange={(e) => setFbName(e.target.value)}
                  placeholder="Seu nome como aparece no Facebook"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" /> Seu Nível Teológico
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'iniciante', label: 'Iniciante', sub: 'Fundamentos' },
                    { id: 'intermediario', label: 'Intermediário', sub: 'Hermenêutica' },
                    { id: 'avancado', label: 'Avançado', sub: 'Exegese / Grego' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setFbLevel(lvl.id as BiblicalLevel)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        fbLevel === lvl.id
                          ? 'border-blue-500 bg-blue-50/80 text-blue-900 font-semibold ring-1 ring-blue-500'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="font-bold">{lvl.label}</div>
                      <div className="text-[10px] text-slate-500">{lvl.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continuar com o Facebook
              </button>
            </form>
          )}

          {/* Quick Access Demologins for easy testing */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center mb-2.5">
              Acesso Rápido para Avaliação e Demonstração
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('iniciante')}
                className="p-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg text-center font-medium transition-colors"
              >
                🌱 Iniciante
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('intermediario')}
                className="p-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 rounded-lg text-center font-medium transition-colors"
              >
                📖 Intermediário
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('avancado')}
                className="p-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-purple-50 hover:text-purple-800 rounded-lg text-center font-medium transition-colors"
              >
                🏛️ Avançado
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('professor')}
                className="p-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-800 rounded-lg text-center font-medium transition-colors"
              >
                👨‍🏫 Professor
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
