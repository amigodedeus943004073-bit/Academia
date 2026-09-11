import { VideoLesson, BookItem, DebateTopic, FeedAnnouncement, AttendanceRecord, Teacher } from '../types';

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'teacher-salomao',
    name: 'Salomão Muanjita',
    title: 'Responsável Geral & Diretor Acadêmico',
    bio: 'Idealizador e Responsável Geral pela Academia Bíblica EAD. Dedicado ao ensino sistemático das Escrituras Sagradas, formação de obreiros e coordenação teológica.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    whatsapp: '+244 943 004 073',
    email: 'amigodeDeus943004073@gmail.com',
    subjects: ['Fundamentos Bíblicos', 'Teologia Sistemática', 'Liderança Cristã', 'Hermenêutica'],
    levelTarget: 'todos',
    registeredBy: 'Autoria Própria',
    createdAt: '2025-01-01',
    active: true
  },
  {
    id: 'teacher-carlos',
    name: 'Pr. Carlos Eduardo Vieira',
    title: 'Mestre em Teologia Bíblica',
    bio: 'Especialista em Antigo Testamento, línguas semíticas e teologia do Pentateuco.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    whatsapp: '+55 11 97654-3210',
    email: 'carlos.vieira@academiabiblica.com',
    subjects: ['Antigo Testamento', 'Pentateuco', 'Profetas'],
    levelTarget: 'iniciante',
    registeredBy: 'Salomão Muanjita',
    createdAt: '2025-01-05',
    active: true
  },
  {
    id: 'teacher-miriam',
    name: 'Dra. Miriam Santos',
    title: 'Doutora em Espiritualidade Bíblica',
    bio: 'Professora de Vida Cristã, Práticas Devocionais e Espiritualidade Cristã.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    whatsapp: '+55 21 98877-6655',
    email: 'miriam.santos@academiabiblica.com',
    subjects: ['Vida Cristã', 'Oração e Jejum', 'Discipulado'],
    levelTarget: 'iniciante',
    registeredBy: 'Salomão Muanjita',
    createdAt: '2025-01-10',
    active: true
  },
  {
    id: 'teacher-samuel',
    name: 'Rev. Dr. Samuel Oliveira',
    title: 'Ph.D em Hermenêutica Bíblica',
    bio: 'Catedrático em Teologia Exegética, Grego Koiné e Hermenêutica Reformada.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    whatsapp: '+55 31 99123-4567',
    email: 'samuel.oliveira@academiabiblica.com',
    subjects: ['Hermenêutica', 'Exegese do Grego', 'Teologia Paulina'],
    levelTarget: 'intermediario',
    registeredBy: 'Salomão Muanjita',
    createdAt: '2025-01-15',
    active: true
  }
];

export const INITIAL_LESSONS: VideoLesson[] = [
  {
    id: 'lesson-salomao-master',
    title: 'Diretrizes Fundamentais da Formação Bíblica EAD',
    description: 'Aula inaugural ministrada pelo Responsável Geral Salomão Muanjita sobre a visão da academia, método de estudo das Escrituras e perseverança no conhecimento bíblico.',
    instructor: 'Salomão Muanjita',
    instructorTitle: 'Responsável Geral & Diretor Acadêmico',
    level: 'iniciante',
    category: 'Fundamentos da Fé',
    duration: '35 min',
    videoUrl: 'https://www.youtube.com/embed/S_B7Yn-q6eM',
    videoType: 'embed',
    thumbnail: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80',
    isLive: false,
    tags: ['Salomão Muanjita', 'Inaugural', 'Fundamentos', 'Visão Teológica'],
    referencePassages: ['2 Timóteo 3:16-17', 'Oséias 6:3', 'Salmos 119:105'],
    attachedFiles: [
      { name: 'Manual_do_Aluno_Salomao_Muanjita.pdf', size: '2.5 MB', url: '#' },
      { name: 'Cronograma_Geral_Formacao.pdf', size: '1.1 MB', url: '#' }
    ]
  },
  {
    id: 'lesson-1',
    title: 'Panorama do Pentateuco e a Aliança Abraâmica',
    description: 'Compreenda a estrutura dos cinco primeiros livros da Bíblia (Torá) e a gênese do plano redentor divino desde a criação até a aliança.',
    instructor: 'Pr. Carlos Eduardo Vieira',
    instructorTitle: 'Mestre em Teologia Bíblica',
    level: 'iniciante',
    category: 'Antigo Testamento',
    duration: '42 min',
    videoUrl: 'https://www.youtube.com/embed/S_B7Yn-q6eM',
    thumbnail: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80',
    isLive: false,
    tags: ['Gênesis', 'Pentateuco', 'Aliança', 'Fundamentos'],
    referencePassages: ['Gênesis 1-3', 'Gênesis 12:1-3', 'Deuteronômio 6:4-9'],
    attachedFiles: [
      { name: 'Guia_Estudo_Pentateuco.pdf', size: '1.8 MB', url: '#' },
      { name: 'Cronologia_Patriarcas.pdf', size: '950 KB', url: '#' }
    ]
  },
  {
    id: 'lesson-live-1',
    title: 'AULA AO VIVO: Métodos de Leitura e Oração Contemplativa',
    description: 'Transmissão em tempo real tirando dúvidas ao vivo com os alunos sobre disciplina espiritual e métodos devocionais diários.',
    instructor: 'Dra. Miriam Santos',
    instructorTitle: 'Doutora em Espiritualidade Bíblica',
    level: 'iniciante',
    category: 'Vida Cristã',
    duration: 'Em andamento (55 min)',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    thumbnail: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=800&q=80',
    isLive: true,
    liveStatus: 'live',
    viewersCount: 38,
    tags: ['Ao Vivo', 'Devocional', 'Oração', 'Disciplina'],
    referencePassages: ['Salmos 119:105', 'Mateus 6:5-15'],
    attachedFiles: [
      { name: 'Roteiro_Devocional_Diario.pdf', size: '1.2 MB', url: '#' }
    ]
  },
  {
    id: 'lesson-2',
    title: 'Os Evangelhos Sinóticos e a Cristologia de Marcos',
    description: 'Uma introdução comparativa entre Mateus, Marcos e Lucas, com foco especial no Evangelho do Servo Sofredor.',
    instructor: 'Prof. Marcos Aurelio Fontes',
    instructorTitle: 'Especialista em Novo Testamento',
    level: 'iniciante',
    category: 'Novo Testamento',
    duration: '38 min',
    videoUrl: 'https://www.youtube.com/embed/O46T_N3B6oM',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    isLive: false,
    tags: ['Evangelhos', 'Cristologia', 'Marcos'],
    referencePassages: ['Marcos 10:45', 'Marcos 1:1-15'],
    attachedFiles: []
  },
  {
    id: 'lesson-3',
    title: 'Princípios Fundamentais de Hermenêutica Bíblica',
    description: 'Aprenda a fazer a ponte entre o contexto histórico-gramatical do texto antigo e a sua aplicação prática na contemporaneidade.',
    instructor: 'Rev. Dr. Samuel Oliveira',
    instructorTitle: 'Ph.D em Hermenêutica Bíblica',
    level: 'intermediario',
    category: 'Hermenêutica',
    duration: '54 min',
    videoUrl: 'https://www.youtube.com/embed/2vJ_18_j2u0',
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    isLive: false,
    tags: ['Interpretação', 'Contexto', 'Exegese Básica'],
    referencePassages: ['2 Timóteo 2:15', 'Neemias 8:8'],
    attachedFiles: [
      { name: 'Regras_Hermenêuticas_Essenciais.pdf', size: '2.4 MB', url: '#' }
    ]
  },
  {
    id: 'lesson-4',
    title: 'História da Igreja: Da Era Patrística à Reforma Protestante',
    description: 'Análise aprofundada dos Concílios Ecumênicos, a defesa da ortodoxia cristã e o ressurgimento da teologia bíblica no século XVI.',
    instructor: 'Profª. Raquel Nogueira',
    instructorTitle: 'Historiadora e Mestre em Teologia Histórica',
    level: 'intermediario',
    category: 'História Cristã',
    duration: '49 min',
    videoUrl: 'https://www.youtube.com/embed/WsnrMhA9gB8',
    thumbnail: 'https://images.unsplash.com/photo-1548625361-0943673f44e1?auto=format&fit=crop&w=800&q=80',
    isLive: false,
    tags: ['Patrística', 'Reforma', 'Concílios', 'Doutrina'],
    referencePassages: ['Atos 15:1-35', 'Judas 1:3'],
    attachedFiles: [
      { name: 'Linha_do_Tempo_Igreja.pdf', size: '3.1 MB', url: '#' }
    ]
  },
  {
    id: 'lesson-5',
    title: 'Exegese do Texto Grego: Epístola aos Romanos',
    description: 'Tradução, análise sintática e desdobramento teológico do vocabulário paulino em Romanos 3 a 8 no texto grego koiné.',
    instructor: 'Prof. Dr. Elias Ben-Zion',
    instructorTitle: 'Doutor em Línguas Semíticas e Grego Clássico',
    level: 'avancado',
    category: 'Línguas Bíblicas & Exegese',
    duration: '62 min',
    videoUrl: 'https://www.youtube.com/embed/5NV6Rdv1a3I',
    thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
    isLive: false,
    tags: ['Grego Bíblico', 'Romanos', 'Justificação', 'Sintaxe'],
    referencePassages: ['Romanos 3:21-26', 'Romanos 8:28-39'],
    attachedFiles: [
      { name: 'Apostila_Grego_Romanos.pdf', size: '4.5 MB', url: '#' }
    ]
  },
  {
    id: 'lesson-6',
    title: 'Escatologia Sistemática e Apocalíptica Bíblica Comparada',
    description: 'Estudo crítico das correntes milenaristas (pré, pós e amilenarismo) e o simbolismo escatológico de Daniel e Apocalipse.',
    instructor: 'Dr. Josué Bittencourt',
    instructorTitle: 'Catedrático em Teologia Sistemática',
    level: 'avancado',
    category: 'Teologia Sistemática',
    duration: '58 min',
    videoUrl: 'https://www.youtube.com/embed/lTRiuFIWV54',
    thumbnail: 'https://images.unsplash.com/photo-1507842229451-79b1be886a20?auto=format&fit=crop&w=800&q=80',
    isLive: false,
    tags: ['Escatologia', 'Apocalipse', 'Profecias', 'Milenarismo'],
    referencePassages: ['Daniel 7-12', 'Apocalipse 20'],
    attachedFiles: [
      { name: 'Comparativo_Escatologico.pdf', size: '2.1 MB', url: '#' }
    ]
  }
];

export const INITIAL_BOOKS: BookItem[] = [
  {
    id: 'book-1',
    title: 'Manual Bíblico de Fundamentos da Fé',
    author: 'Equipe Pedagógica Teológica',
    level: 'iniciante',
    category: 'Teologia Básica',
    pages: 184,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Guia essencial para quem está iniciando na fé cristã, cobrindo doutrinas centrais, oração, batismo e vida em comunhão.',
    publishedYear: '2023',
    readingExcerpt: `Capítulo 1: O Que é a Bíblia?\nA Palavra de Deus é viva e eficaz. Ela foi inspirada pelo Espírito Santo através de mais de 40 autores humanos ao longo de cerca de 1.500 anos. O propósito central das Escrituras é revelar o caráter santo de Deus, o estado pecador do homem e a redenção gloriosa através de Cristo Jesus.`,
    addedBy: 'Coordenação Acadêmica',
    addedAt: '2025-01-15'
  },
  {
    id: 'book-2',
    title: 'Panorama Geral do Antigo Testamento',
    author: 'Pr. Carlos Eduardo Vieira',
    level: 'iniciante',
    category: 'Introdução Bíblica',
    pages: 240,
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Introdução livro a livro aos 39 livros do Antigo Testamento, contextualizando época, autoria, tema principal e tipologia de Cristo.',
    publishedYear: '2024',
    readingExcerpt: `Gênesis é o livro dos começos. Nele encontramos a origem do universo, da humanidade, da família, do pecado e do concerto gracioso estabelecido por Deus com Abraão. Cada promessa aponta com precisão profética para o Cordeiro pascal.`,
    addedBy: 'Pr. Carlos Vieira',
    addedAt: '2025-02-01'
  },
  {
    id: 'book-3',
    title: 'Hermenêutica Sagrada: Princípios de Interpretação',
    author: 'Rev. Dr. Samuel Oliveira',
    level: 'intermediario',
    category: 'Hermenêutica',
    pages: 320,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Aprofundamento nas regras hermenêuticas fundamentais: contexto histórico, análise léxica, gêneros literários bíblicos e a analogia da fé.',
    publishedYear: '2022',
    readingExcerpt: `Regra de Ouro da Hermenêutica: O texto sagrado tem um significado intencionado pelo autor original guiado pelo Espírito Santo. Nossa tarefa não é inventar novos significados, mas descobrir através de exegese cuidadosa o que o texto significou originalmente.`,
    addedBy: 'Rev. Samuel Oliveira',
    addedAt: '2025-01-20'
  },
  {
    id: 'book-4',
    title: 'Compêndio de Teologia Histórica e Patrística',
    author: 'Profª. Raquel Nogueira',
    level: 'intermediario',
    category: 'História da Igreja',
    pages: 410,
    coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Estudo das defesas da fé cristã diante das heresias dos primeiros séculos: Atanásio, Agostinho de Hipona, João Crisóstomo e os credos ecumênicos.',
    publishedYear: '2023',
    readingExcerpt: `No Concílio de Nicéia (325 d.C.), o bispo Atanásio defendeu com firmeza que o Filho é 'homoousios' (da mesma substância) que o Pai, refutando a falsa premissa ariana e assegurando a confissão eterna da deidade de Cristo.`,
    addedBy: 'Coordenação Acadêmica',
    addedAt: '2025-02-10'
  },
  {
    id: 'book-5',
    title: 'Gramática Exegética do Grego Neotestamentário',
    author: 'Prof. Dr. Elias Ben-Zion',
    level: 'avancado',
    category: 'Línguas Originais',
    pages: 520,
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3dd45?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Morfologia, sintaxe de casos, sistema verbal de aspecto e análise de diagramas sintáticos para pregadores e eruditos bíblicos.',
    publishedYear: '2021',
    readingExcerpt: `O tempo aoristo no grego helenístico expressa aspecto perfectivo (visão totalizante da ação, sem foco no seu desenvolvimento contínuo). Em João 1:1 ('En archē ēn ho Logos'), o imperfeito 'ēn' denota existência contínua e eterna do Verbo.`,
    addedBy: 'Prof. Elias Ben-Zion',
    addedAt: '2025-01-05'
  },
  {
    id: 'book-6',
    title: 'Teologia Sistemática da Escatologia Bíblica',
    author: 'Dr. Josué Bittencourt',
    level: 'avancado',
    category: 'Teologia Sistemática',
    pages: 480,
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Exame minucioso da profecia bíblica, ressurreição corporal, julgamento final e a inauguração dos novos céus e nova terra.',
    publishedYear: '2024',
    readingExcerpt: `A esperança cristã não é uma fuga etérea, mas a renovação cósmica total prometida em Apocalipse 21: 'Eis que faço novas todas as coisas'. A ressurreição de Jesus é as primícias indeléveis da redenção universal.`,
    addedBy: 'Dr. Josué Bittencourt',
    addedAt: '2025-02-28'
  }
];

export const INITIAL_DEBATES: DebateTopic[] = [
  {
    id: 'debate-1',
    title: 'Como interpretar as figuras de linguagem nos Salmos e Profetas?',
    question: 'Paz do Senhor irmãos e professores! Ao estudar os Salmos imprecatórios e as metáforas nos profetas menores, como distinguir com exatidão o que é hipérbole poética hebraica de mandamentos literais?',
    category: 'Hermenêutica e Poesia Bíblica',
    level: 'intermediario',
    authorId: 'user-lucas',
    authorName: 'Lucas Medeiros',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    authorRole: 'aluno',
    createdAt: 'Hoje às 10:30',
    likes: 14,
    likedByMe: false,
    hasWhatsAppVideoCall: true,
    whatsAppRoomLink: 'https://wa.me/5511999998888?text=Olá!%20Gostaria%20de%20entrar%20na%20chamada%20de%20vídeo%20de%20debate%20bíblico%20sobre%20Salmos%20e%20Profetas.',
    whatsAppContact: '+55 11 99999-8888 (Prof. Samuel)',
    replies: [
      {
        id: 'reply-1',
        authorId: 'prof-samuel',
        authorName: 'Rev. Dr. Samuel Oliveira',
        authorRole: 'professor',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        content: 'Excelente indagação, Lucas! A poesia hebraica opera com o princípio do paralelismo (sinônimo, antitético e sintético). Salmos imprecatórios expressam anelo por justiça divina dentro da aliança mosaica. Podemos abrir uma chamada de vídeo no WhatsApp para destrinchar o paralelismo sintético juntos!',
        createdAt: 'Hoje às 11:15',
        likes: 9
      },
      {
        id: 'reply-2',
        authorId: 'user-ana',
        authorName: 'Ana Beatriz Souza',
        authorRole: 'aluno',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        content: 'Muito esclarecedor professor! Vou acompanhar a chamada de vídeo de mentoria pelo WhatsApp.',
        createdAt: 'Hoje às 11:40',
        likes: 3
      }
    ]
  },
  {
    id: 'debate-2',
    title: 'Qual a diferença central entre Justificação e Santificação em Romanos?',
    question: 'Para quem está iniciando no nível básico: a Justificação é um ato imediato ou um processo? E como a Santificação se relaciona com a perseverança do crente?',
    category: 'Doutrina Cristã',
    level: 'iniciante',
    authorId: 'user-marcos',
    authorName: 'Marcos Vinicius Lima',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    authorRole: 'aluno',
    createdAt: 'Ontem às 16:20',
    likes: 22,
    likedByMe: true,
    hasWhatsAppVideoCall: true,
    whatsAppRoomLink: 'https://wa.me/5521988887777?text=Paz!%20Desejo%20participar%20da%20sala%20de%20tutoria%20bíblica%20em%20vídeo%20sobre%20Justificação%20e%20Santificação.',
    whatsAppContact: '+55 21 98888-7777 (Plantão Teológico)',
    replies: [
      {
        id: 'reply-3',
        authorId: 'prof-carlos',
        authorName: 'Pr. Carlos Eduardo Vieira',
        authorRole: 'professor',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        content: 'A Justificação é um ato forense legal de Deus, instantâneo e irrevogável, onde o pecador é declarado justo com base nos méritos de Cristo (Romanos 5:1). A Santificação, por outro lado, é a obra progressiva do Espírito ao longo de toda a vida terrena!',
        createdAt: 'Ontem às 17:05',
        likes: 18
      }
    ]
  },
  {
    id: 'debate-3',
    title: 'O uso de "Monogenês" em João 1:14 e 1:18 no grego koiné',
    question: 'Debate filológico para o nível avançado: Por que a tradução latina da Vulgata "unigenitus" influenciou certas visões e como a moderna crítica textual compreende o termo em relação à singularidade e filiação eterna?',
    category: 'Exegese e Texto Grego',
    level: 'avancado',
    authorId: 'prof-elias',
    authorName: 'Prof. Dr. Elias Ben-Zion',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    authorRole: 'professor',
    createdAt: 'Há 2 dias',
    likes: 31,
    likedByMe: false,
    hasWhatsAppVideoCall: true,
    whatsAppRoomLink: 'https://wa.me/5531977776666?text=Olá%20Prof.%20Elias!%20Gostaria%20de%20participar%20da%20chamada%20de%20vídeo%20do%20WhatsApp%20para%20debate%20do%20grego%20de%20João.',
    whatsAppContact: '+55 31 97777-6666 (Mesa Redonda Teológica)',
    replies: [
      {
        id: 'reply-4',
        authorId: 'user-thiago',
        authorName: 'Pr. Thiago Alencar',
        authorRole: 'aluno',
        authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
        content: 'Excelente debate prof. Elias. Estudos de Dale Moody e Richard Bauckham mostram que deriva de genos (espécie/gênero singular) e não de gennao (gerar). Significa literalmente único em seu gênero, o Único e Incomparável.',
        createdAt: 'Há 1 dia',
        likes: 12
      }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS: FeedAnnouncement[] = [
  {
    id: 'feed-1',
    title: '📢 Transmissão Ao Vivo com Plantão de Dúvidas neste Sábado às 19h30',
    content: 'Atenção alunos de todos os níveis! Teremos nossa aula magna e sala de debates transmitida ao vivo na Sala Virtual com todos os professores. Logo em seguida, abriremos grupos de chamada de vídeo no WhatsApp para tutorias personalizadas e oração intercessória. Não se esqueça de marcar sua presença ao entrar na plataforma!',
    author: 'Salomão Muanjita',
    authorRole: 'Responsável Geral & Direção Acadêmica',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    date: 'Hoje às 09:00',
    tag: 'Live Especial',
    pinned: true,
    likes: 47,
    likedByMe: true,
    levelTarget: 'todos',
    imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1000&q=80',
    comments: [
      {
        id: 'comm-1',
        author: 'Débora Ribeiro',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        content: 'Glória a Deus! Estarei presente e já convidei os irmãos da minha congregação.',
        date: 'Hoje às 09:40'
      },
      {
        id: 'comm-2',
        author: 'Roberto Siqueira',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        content: 'Maravilha de iniciativa! O link da chamada de vídeo no WhatsApp facilitou muito.',
        date: 'Hoje às 10:15'
      }
    ]
  },
  {
    id: 'feed-2',
    title: '📚 3 Novos Livros e Apostilas Adicionados à Biblioteca Digital',
    content: 'Disponibilizamos no acervo: "Compêndio de Teologia Histórica", "Manual de Fundamentos da Fé" e o "Panorama do Pentateuco". Todos já contam com pré-visualização de texto e download gratuito para leitura no tablet ou celular.',
    author: 'Prof. Samuel Oliveira',
    authorRole: 'Bibliotecário Chefe & Docente',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    date: 'Ontem às 14:00',
    tag: 'Novo Material',
    pinned: false,
    likes: 38,
    likedByMe: false,
    levelTarget: 'todos',
    comments: []
  },
  {
    id: 'feed-3',
    title: '⚠️ Lembrete Importante: Registro de Presença (Entrada e Saída)',
    content: 'Irmãos, para emissão do Certificado Teológico de Conclusão é obrigatório manter pelo menos 75% de presença registrada. Toda vez que acessar o sistema, clique em "Marcar Presença" no banner superior e finalize ao sair.',
    author: 'Secretaria Acadêmica',
    authorRole: 'Administração',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    date: 'Há 3 dias',
    tag: 'Aviso Urgente',
    pinned: true,
    likes: 62,
    likedByMe: false,
    levelTarget: 'todos',
    comments: []
  }
];

export const INITIAL_ATTENDANCE_LOGS: AttendanceRecord[] = [
  {
    id: 'att-1',
    userId: 'user-lucas',
    userName: 'Lucas Medeiros',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    userLevel: 'intermediario',
    role: 'aluno',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '08:15',
    status: 'online',
    notes: 'Acessando Sala Virtual de Hermenêutica'
  },
  {
    id: 'att-2',
    userId: 'user-ana',
    userName: 'Ana Beatriz Souza',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    userLevel: 'iniciante',
    role: 'aluno',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '09:00',
    checkOutTime: '10:45',
    durationMinutes: 105,
    status: 'finalizado',
    notes: 'Assistiu aula de Evangelhos e baixou apostila'
  },
  {
    id: 'att-3',
    userId: 'user-marcos',
    userName: 'Marcos Vinicius Lima',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    userLevel: 'iniciante',
    role: 'aluno',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '09:30',
    status: 'online',
    notes: 'Estudando na Biblioteca'
  },
  {
    id: 'att-4',
    userId: 'user-thiago',
    userName: 'Pr. Thiago Alencar',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    userLevel: 'avancado',
    role: 'aluno',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '07:45',
    checkOutTime: '09:15',
    durationMinutes: 90,
    status: 'finalizado',
    notes: 'Estudo de Grego Bíblico em Romanos'
  },
  {
    id: 'att-5',
    userId: 'prof-samuel',
    userName: 'Rev. Dr. Samuel Oliveira',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    userLevel: 'avancado',
    role: 'professor',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '08:00',
    status: 'online',
    notes: 'Docente em plantão e tutoria WhatsApp'
  }
];
