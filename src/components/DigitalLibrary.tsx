import React, { useState } from 'react';
import { BookItem, BiblicalLevel } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, Plus, Search, Filter, Download, 
  Eye, BookMarked, Check, X, Sparkles, User, Calendar
} from 'lucide-react';

interface DigitalLibraryProps {
  books: BookItem[];
  onAddBook: (book: BookItem) => void;
  selectedLevel: BiblicalLevel | 'todos';
  onSelectLevel: (lvl: BiblicalLevel | 'todos') => void;
}

export const DigitalLibrary: React.FC<DigitalLibraryProps> = ({
  books,
  onAddBook,
  selectedLevel,
  onSelectLevel
}) => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [readingBook, setReadingBook] = useState<BookItem | null>(null);

  // Form for adding a new book
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [level, setLevel] = useState<BiblicalLevel | 'todos'>('iniciante');
  const [category, setCategory] = useState('Teologia Sistemática');
  const [pages, setPages] = useState(250);
  const [synopsis, setSynopsis] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80');

  const categories = ['todos', 'Teologia Básica', 'Introdução Bíblica', 'Hermenêutica', 'História da Igreja', 'Línguas Originais', 'Teologia Sistemática'];

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.synopsis.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = selectedLevel === 'todos' || b.level === 'todos' || b.level === selectedLevel;
    const matchesCat = selectedCategory === 'todos' || b.category === selectedCategory;
    return matchesSearch && matchesLevel && matchesCat;
  });

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) return;

    const newBook: BookItem = {
      id: `book-${Date.now()}`,
      title,
      author,
      level,
      category,
      pages: Number(pages) || 150,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      synopsis: synopsis || 'Obra de edificação e fundamentação teológica cristã.',
      readingExcerpt: excerpt || synopsis || 'Texto bíblico selecionado para leitura e meditação diária nas Sagradas Escrituras.',
      publishedYear: new Date().getFullYear().toString(),
      addedBy: user?.name || 'Coordenação',
      addedAt: new Date().toISOString().split('T')[0]
    };

    onAddBook(newBook);
    setShowAddModal(false);
    setTitle('');
    setAuthor('');
    setSynopsis('');
    setExcerpt('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 border border-amber-900/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> Biblioteca Teológica Digital
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-serif tracking-tight mt-1 text-amber-100">
            Acervo Bíblico, Comentários e Apostilas
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Acesse livros didáticos para todos os níveis de formação, leia trechos exegéticos online ou adicione novas obras ao catálogo.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Adicionar Livro à Biblioteca
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por título, autor ou assunto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Level Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {(['todos', 'iniciante', 'intermediario', 'avancado'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => onSelectLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs capitalize transition-all font-medium ${
                selectedLevel === lvl
                  ? 'bg-slate-900 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl === 'todos' ? 'Todos os Níveis' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBooks.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 p-8">
            <BookMarked className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600">Nenhum livro encontrado com este filtro.</p>
            <p className="text-xs text-slate-400 mt-1">Experimente buscar por outros termos ou adicione uma nova obra.</p>
          </div>
        ) : (
          filteredBooks.map(book => (
            <div
              key={book.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              <div className="h-44 bg-slate-900 relative overflow-hidden">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm ${
                    book.level === 'iniciante'
                      ? 'bg-emerald-600 text-white'
                      : book.level === 'intermediario'
                      ? 'bg-amber-600 text-white'
                      : book.level === 'avancado'
                      ? 'bg-purple-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}>
                    {book.level}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] text-amber-300 font-medium">{book.category}</span>
                  <h4 className="text-sm font-bold font-serif line-clamp-1 text-slate-100">{book.title}</h4>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-xs font-semibold text-slate-700">Por {book.author}</div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {book.synopsis}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{book.pages} páginas</span>
                  <span>Ano: {book.publishedYear}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setReadingBook(book)}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    Ler Trecho
                  </button>

                  <button
                    onClick={() => alert(`Iniciando download da apostila digital em PDF: "${book.title}"`)}
                    className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Baixar PDF
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reader Modal (Visualizador de Trecho Teológico) */}
      {readingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 animate-in fade-in duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-slate-900">{readingBook.title}</h3>
                  <p className="text-xs text-slate-500">Por {readingBook.author} • {readingBook.category}</p>
                </div>
              </div>
              <button
                onClick={() => setReadingBook(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200/50 text-xs font-serif leading-relaxed text-slate-800 whitespace-pre-line max-h-96 overflow-y-auto">
              {readingBook.readingExcerpt || readingBook.synopsis}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-400">
                Inserido por {readingBook.addedBy} em {readingBook.addedAt}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Download completo do arquivo PDF iniciado.`)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Baixar Livro Completo (PDF)
                </button>
                <button
                  onClick={() => setReadingBook(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Fechar Leitor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Livro à Biblioteca */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                Adicionar Novo Livro ou Apostila
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título da Obra / Apostila
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: Introdução à Teologia Paulina"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Autor(a) / Teólogo
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    placeholder="Ex: Pr. Carlos Eduardo Vieira"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nível Teológico
                  </label>
                  <select
                    value={level}
                    onChange={e => setLevel(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                    <option value="todos">Todos os Níveis</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="Teologia Básica">Teologia Básica</option>
                    <option value="Introdução Bíblica">Introdução Bíblica</option>
                    <option value="Hermenêutica">Hermenêutica</option>
                    <option value="História da Igreja">História da Igreja</option>
                    <option value="Línguas Originais">Línguas Originais</option>
                    <option value="Teologia Sistemática">Teologia Sistemática</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Número de Páginas
                  </label>
                  <input
                    type="number"
                    value={pages}
                    onChange={e => setPages(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sinopse / Resumo do Livro
                </label>
                <textarea
                  rows={2}
                  value={synopsis}
                  onChange={e => setSynopsis(e.target.value)}
                  placeholder="Apresentação geral da obra e tópicos abordados..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trecho ou Capítulo Inicial (Para o leitor online)
                </label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  placeholder="Insira trechos ou prefácio do livro para pré-visualização dos alunos..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Cadastrar Livro no Acervo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
