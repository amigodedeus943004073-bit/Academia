export interface CountryInfo {
  code: string;       // ISO 2-letter
  name: string;       // Name in Portuguese
  flag: string;       // Emoji flag
  dialCode: string;   // e.g. "+244"
  format: string;     // e.g. "9XX XXX XXX"
  example: string;    // e.g. "943 004 073"
  minLength: number;  // min digits without DDI
  maxLength: number;  // max digits without DDI
  isNational?: boolean; // Highlight national / regional
}

export const VALID_COUNTRIES: CountryInfo[] = [
  {
    code: 'AO',
    name: 'Angola',
    flag: '🇦🇴',
    dialCode: '+244',
    format: '9XX XXX XXX',
    example: '943 004 073',
    minLength: 9,
    maxLength: 9,
    isNational: true
  },
  {
    code: 'BR',
    name: 'Brasil',
    flag: '🇧🇷',
    dialCode: '+55',
    format: '(XX) 9XXXX-XXXX',
    example: '11 98765-4321',
    minLength: 10,
    maxLength: 11,
    isNational: true
  },
  {
    code: 'PT',
    name: 'Portugal',
    flag: '🇵🇹',
    dialCode: '+351',
    format: '9XX XXX XXX',
    example: '912 345 678',
    minLength: 9,
    maxLength: 9
  },
  {
    code: 'MZ',
    name: 'Moçambique',
    flag: '🇲🇿',
    dialCode: '+258',
    format: '8X XXX XXXX',
    example: '84 123 4567',
    minLength: 9,
    maxLength: 9
  },
  {
    code: 'CV',
    name: 'Cabo Verde',
    flag: '🇨🇻',
    dialCode: '+238',
    format: '9XX XX XX',
    example: '991 23 45',
    minLength: 7,
    maxLength: 7
  },
  {
    code: 'ST',
    name: 'São Tomé e Príncipe',
    flag: '🇸🇹',
    dialCode: '+239',
    format: '9XX XXXX',
    example: '991 2345',
    minLength: 7,
    maxLength: 7
  },
  {
    code: 'GW',
    name: 'Guiné-Bissau',
    flag: '🇬🇼',
    dialCode: '+245',
    format: '9XX XXX XXX',
    example: '955 123 456',
    minLength: 9,
    maxLength: 9
  },
  {
    code: 'US',
    name: 'Estados Unidos / Canadá',
    flag: '🇺🇸',
    dialCode: '+1',
    format: '(XXX) XXX-XXXX',
    example: '202 555 0143',
    minLength: 10,
    maxLength: 10
  },
  {
    code: 'GB',
    name: 'Reino Unido',
    flag: '🇬🇧',
    dialCode: '+44',
    format: '7XXX XXXXXX',
    example: '7911 123456',
    minLength: 10,
    maxLength: 11
  },
  {
    code: 'FR',
    name: 'França',
    flag: '🇫🇷',
    dialCode: '+33',
    format: '6 XX XX XX XX',
    example: '6 12 34 56 78',
    minLength: 9,
    maxLength: 9
  },
  {
    code: 'ES',
    name: 'Espanha',
    flag: '🇪🇸',
    dialCode: '+34',
    format: '6XX XXX XXX',
    example: '612 345 678',
    minLength: 9,
    maxLength: 9
  },
  {
    code: 'DE',
    name: 'Alemanha',
    flag: '🇩🇪',
    dialCode: '+49',
    format: '1XX XXXXXXXX',
    example: '151 23456789',
    minLength: 10,
    maxLength: 11
  },
  {
    code: 'ZA',
    name: 'África do Sul',
    flag: '🇿🇦',
    dialCode: '+27',
    format: 'XX XXX XXXX',
    example: '82 123 4567',
    minLength: 9,
    maxLength: 9
  },
  {
    code: 'CD',
    name: 'R. D. Congo',
    flag: '🇨🇩',
    dialCode: '+243',
    format: '8XX XXX XXX',
    example: '812 345 678',
    minLength: 9,
    maxLength: 9
  },
  {
    code: 'NA',
    name: 'Namíbia',
    flag: '🇳🇦',
    dialCode: '+264',
    format: '8X XXX XXXX',
    example: '81 123 4567',
    minLength: 9,
    maxLength: 9
  },
  {
    code: 'IT',
    name: 'Itália',
    flag: '🇮🇹',
    dialCode: '+39',
    format: '3XX XXXXXXX',
    example: '312 3456789',
    minLength: 9,
    maxLength: 10
  },
  {
    code: 'CH',
    name: 'Suíça',
    flag: '🇨🇭',
    dialCode: '+41',
    format: '7X XXX XX XX',
    example: '79 123 45 67',
    minLength: 9,
    maxLength: 9
  }
];

export function cleanPhoneNumber(raw: string): string {
  return raw.replace(/\D/g, '');
}

export function validatePhoneNumber(phone: string, country: CountryInfo): { valid: boolean; reason?: string } {
  const digits = cleanPhoneNumber(phone);
  if (!digits) {
    return { valid: false, reason: 'Digite o número do seu WhatsApp.' };
  }
  if (digits.length < country.minLength) {
    return { 
      valid: false, 
      reason: `Número muito curto para ${country.name}. Mínimo de ${country.minLength} dígitos (ex: ${country.example}).` 
    };
  }
  if (digits.length > country.maxLength) {
    return { 
      valid: false, 
      reason: `Número muito longo para ${country.name}. Máximo de ${country.maxLength} dígitos.` 
    };
  }
  return { valid: true };
}

export function formatFullInternational(country: CountryInfo, rawNumber: string): string {
  const clean = cleanPhoneNumber(rawNumber);
  return `${country.dialCode} ${clean}`;
}
