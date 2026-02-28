
import React, { useState, useEffect, useMemo } from 'react';
import { Article } from '../types';
import { getArticles, saveArticle, deleteArticle } from '../services/articleService';
import { generateArticleTags } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Save, Trash2, Plus, AlertCircle, Check, Lock, Search, Filter, X, User as UserIcon, Calendar, GripVertical, Edit2, Loader2, Sparkles } from 'lucide-react';
import Button from './Button';

interface AdminEditorProps {
  onBack: () => void;
}

const emptyArticle: Article = {
  id: '',
  title: '',
  excerpt: '',
  content: '',
  category: 'tip',
  author: 'ProHeadshot Team',
  date: new Date().toISOString().split('T')[0],
  imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
  readTime: '3 min read',
  tags: []
};

const AdminEditor: React.FC<AdminEditorProps> = ({ onBack }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Editor State
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article>(emptyArticle);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  
  // Tag State
  const [tagInput, setTagInput] = useState('');
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

  // Drag & Drop State
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  // Inline Edit State
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineEditForm, setInlineEditForm] = useState({ title: '', author: '' });
  const [isInlineSaving, setIsInlineSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { t } = useLanguage();

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchArticles();
    }
  }, [isAuthenticated]);

  // Auto-dismiss status messages
  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => {
        setStatus({ type: null, message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        article.title.toLowerCase().includes(term) || 
        article.tags?.some(tag => tag.toLowerCase().includes(term)); // Search in tags too
        
      const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
      const matchesAuthor = !filterAuthor || article.author.toLowerCase().includes(filterAuthor.toLowerCase());
      return matchesSearch && matchesCategory && matchesAuthor;
    });
  }, [articles, searchTerm, filterCategory, filterAuthor]);

  const isFiltered = searchTerm !== '' || filterCategory !== 'all' || filterAuthor !== '';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'AminAdmin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Access Denied: Incorrect Password');
      setPasswordInput('');
    }
  };

  const handleCreateNew = () => {
    const newId = `post-${Date.now()}`;
    setSelectedArticle({ ...emptyArticle, id: newId });
    setStatus({ type: null, message: '' });
    setShowDeleteConfirm(false);
  };

  const handleSelect = (article: Article) => {
    if (inlineEditingId) return; // Prevent selection while inline editing
    setSelectedArticle({ ...article, tags: article.tags || [] });
    setStatus({ type: null, message: '' });
    setShowDeleteConfirm(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle.title) return;

    setIsSaving(true);
    try {
      await saveArticle(selectedArticle);
      setStatus({ type: 'success', message: 'Article saved successfully' });
      await fetchArticles();
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Failed to save' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteArticle(selectedArticle.id);
      setStatus({ type: 'success', message: 'Article deleted' });
      await fetchArticles();
      handleCreateNew();
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Failed to delete' });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedArticle(prev => ({ ...prev, [name]: value }));
  };

  // --- Tag Management ---
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent) => {
    if ((e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') || !tagInput.trim()) return;
    e.preventDefault(); // Prevent form submit on Enter
    
    if (selectedArticle.tags?.includes(tagInput.trim())) {
        setTagInput('');
        return;
    }

    const newTags = [...(selectedArticle.tags || []), tagInput.trim()];
    setSelectedArticle(prev => ({ ...prev, tags: newTags }));
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = selectedArticle.tags?.filter(tag => tag !== tagToRemove) || [];
    setSelectedArticle(prev => ({ ...prev, tags: newTags }));
  };

  const handleAutoTag = async () => {
      if (!selectedArticle.content && !selectedArticle.excerpt) {
          setStatus({ type: 'error', message: 'Add content or excerpt to generate tags.' });
          return;
      }

      setIsGeneratingTags(true);
      try {
          const contentToAnalyze = (selectedArticle.title + "\n" + selectedArticle.excerpt + "\n" + selectedArticle.content);
          const suggestedTags = await generateArticleTags(contentToAnalyze);
          
          if (suggestedTags.length > 0) {
              // Merge with existing tags, avoiding duplicates
              const currentTags = new Set(selectedArticle.tags || []);
              suggestedTags.forEach(tag => currentTags.add(tag));
              
              setSelectedArticle(prev => ({ ...prev, tags: Array.from(currentTags) }));
              setStatus({ type: 'success', message: 'Tags suggested successfully!' });
          } else {
              setStatus({ type: 'error', message: 'Could not generate tags.' });
          }
      } catch (error) {
          console.error(error);
          setStatus({ type: 'error', message: 'Failed to generate tags.' });
      } finally {
          setIsGeneratingTags(false);
      }
  };


  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setFilterAuthor('');
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Optional: Set custom drag image if needed
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newArticles = [...articles];
    const [movedItem] = newArticles.splice(draggedItemIndex, 1);
    newArticles.splice(index, 0, movedItem);
    
    setArticles(newArticles);
    setDraggedItemIndex(null);
    setStatus({ type: 'success', message: 'Order updated (local only)' });
  };

  // --- Inline Edit Handlers ---
  const startInlineEdit = (e: React.MouseEvent, article: Article) => {
    e.stopPropagation();
    setInlineEditingId(article.id);
    setInlineEditForm({ title: article.title, author: article.author });
  };

  const cancelInlineEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInlineEditingId(null);
  };

  const saveInlineEdit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inlineEditingId) return;

    setIsInlineSaving(true);
    try {
      const originalArticle = articles.find(a => a.id === inlineEditingId);
      if (!originalArticle) return;

      const updatedArticle = { 
        ...originalArticle, 
        title: inlineEditForm.title, 
        author: inlineEditForm.author 
      };

      await saveArticle(updatedArticle);
      
      // Update local state optimistically
      setArticles(prev => prev.map(a => a.id === inlineEditingId ? updatedArticle : a));
      
      // If currently selected in main editor, update that too
      if (selectedArticle.id === inlineEditingId) {
        setSelectedArticle(updatedArticle);
      }

      setStatus({ type: 'success', message: 'Quick edit saved' });
      setInlineEditingId(null);
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to save quick edit' });
    } finally {
      setIsInlineSaving(false);
    }
  };


  // --- Login View ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 animate-fadeIn">
         <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-center mb-6">
               <div className="p-4 bg-indigo-500/10 rounded-full">
                  <Lock className="w-8 h-8 text-indigo-400" />
               </div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Admin Access</h2>
            <p className="text-slate-400 text-center mb-6 text-sm">Enter the secure password to manage content.</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
               <div>
                  <input 
                    type="password" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    autoFocus
                  />
               </div>
               
               {authError && (
                 <div className="text-red-400 text-xs flex items-center gap-2 justify-center bg-red-900/20 py-2 rounded-lg">
                    <AlertCircle className="w-3 h-3" />
                    {authError}
                 </div>
               )}

               <div className="flex gap-3 mt-6">
                 <Button type="button" variant="ghost" onClick={onBack} className="flex-1">
                    Cancel
                 </Button>
                 <Button type="submit" className="flex-1">
                    Login
                 </Button>
               </div>
            </form>
         </div>
      </div>
    );
  }

  // --- Editor View ---
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-300 animate-fadeIn min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="pl-0 hover:bg-transparent hover:text-white group">
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
            {t('back')}
        </Button>
        <div className="flex items-center gap-4">
           {status.message && (
                <div className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full animate-fadeIn shadow-lg ${status.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                    {status.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {status.message}
                </div>
            )}
           <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
        
        {/* Left Column: Filter & List */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  Articles
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />}
                </h2>
                <div className="flex gap-2">
                   <button 
                    onClick={() => setShowFilters(!showFilters)} 
                    className={`p-2 rounded-lg transition-colors ${showFilters || isFiltered ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'}`}
                    title="Toggle Filters"
                   >
                      <Filter className="w-4 h-4" />
                   </button>
                   <button 
                    onClick={handleCreateNew} 
                    className="p-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors"
                    title="Create New"
                   >
                      <Plus className="w-4 h-4" />
                   </button>
                </div>
            </div>

            {/* Filter Section */}
            {(showFilters || isFiltered) && (
              <div className="bg-slate-900/50 rounded-xl p-3 mb-4 space-y-3 border border-slate-700/50 animate-fadeIn">
                 <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Search titles or tags..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2">
                    <select 
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="all">All Categories</option>
                      <option value="tip">Tips</option>
                      <option value="job">Jobs</option>
                      <option value="news">News</option>
                    </select>

                    <input 
                      type="text" 
                      placeholder="Author..." 
                      value={filterAuthor}
                      onChange={(e) => setFilterAuthor(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                 </div>

                 {isFiltered && (
                   <button 
                     onClick={clearFilters}
                     className="w-full text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 py-1"
                   >
                     <X className="w-3 h-3" /> Clear Filters
                   </button>
                 )}
              </div>
            )}
            
            <div className="overflow-y-auto flex-grow space-y-2 pr-2 custom-scrollbar">
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No articles found matching filters.
                  </div>
                ) : (
                  filteredArticles.map((art, index) => (
                    <div 
                        key={art.id}
                        draggable={!isFiltered && !inlineEditingId}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e)}
                        onDrop={(e) => handleDrop(e, index)}
                        onClick={() => handleSelect(art)}
                        className={`
                          p-3 rounded-lg cursor-pointer transition-all border group relative
                          ${selectedArticle.id === art.id ? 'bg-indigo-900/40 border-indigo-500 shadow-md' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}
                          ${inlineEditingId === art.id ? 'ring-2 ring-indigo-500 border-indigo-500 bg-slate-800' : ''}
                        `}
                    >
                        {/* Inline Editing Mode */}
                        {inlineEditingId === art.id ? (
                          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                             <input 
                               type="text"
                               value={inlineEditForm.title}
                               onChange={(e) => setInlineEditForm(prev => ({ ...prev, title: e.target.value }))}
                               className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-indigo-500"
                               autoFocus
                             />
                             <div className="flex gap-2">
                                <input 
                                  type="text"
                                  value={inlineEditForm.author}
                                  onChange={(e) => setInlineEditForm(prev => ({ ...prev, author: e.target.value }))}
                                  className="flex-1 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                                />
                                <button 
                                  onClick={saveInlineEdit}
                                  disabled={isInlineSaving}
                                  className="p-1 bg-green-600 hover:bg-green-700 rounded text-white"
                                >
                                   {isInlineSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                </button>
                                <button 
                                  onClick={cancelInlineEdit}
                                  className="p-1 bg-slate-600 hover:bg-slate-500 rounded text-white"
                                >
                                   <X className="w-3 h-3" />
                                </button>
                             </div>
                          </div>
                        ) : (
                          /* Normal View Mode */
                          <div className="flex items-start gap-2">
                             {/* Drag Handle */}
                             {!isFiltered && (
                               <div className="mt-1 text-slate-600 cursor-grab active:cursor-grabbing hover:text-slate-400">
                                  <GripVertical className="w-4 h-4" />
                               </div>
                             )}

                             <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{art.title}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-medium ${
                                        art.category === 'job' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-900' : 
                                        art.category === 'news' ? 'bg-blue-900/50 text-blue-400 border border-blue-900' :
                                        'bg-yellow-900/50 text-yellow-400 border border-yellow-900'
                                      }`}>
                                        {art.category}
                                      </span>
                                      {art.author && (
                                        <span className="flex items-center text-[10px] text-slate-500" title={art.author}>
                                           <UserIcon className="w-3 h-3 mr-0.5" />
                                           <span className="truncate max-w-[60px]">{art.author}</span>
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-slate-500 flex items-center">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {art.date}
                                    </span>
                                </div>
                                {art.tags && art.tags.length > 0 && (
                                   <div className="flex gap-1 mt-1.5 overflow-hidden">
                                      {art.tags.slice(0, 3).map(t => (
                                          <span key={t} className="text-[9px] bg-slate-700/50 text-slate-400 px-1 rounded truncate max-w-[50px]">#{t}</span>
                                      ))}
                                      {art.tags.length > 3 && <span className="text-[9px] text-slate-500">+{art.tags.length - 3}</span>}
                                   </div>
                                )}
                             </div>

                             {/* Quick Edit Button (Visible on Hover) */}
                             <button 
                               onClick={(e) => startInlineEdit(e, art)}
                               className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded opacity-0 group-hover:opacity-100 transition-all"
                               title="Quick Edit"
                             >
                                <Edit2 className="w-3.5 h-3.5" />
                             </button>
                          </div>
                        )}
                    </div>
                  ))
                )}
            </div>
            <div className="mt-3 text-center text-xs text-slate-500 border-t border-slate-700 pt-3">
               Showing {filteredArticles.length} of {articles.length} articles
            </div>
        </div>

        {/* Right Column: Editor Form */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                <div>
                   <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{selectedArticle.id && articles.find(a => a.id === selectedArticle.id) ? 'Editing Article' : 'Creating New Article'}</h2>
                   <p className="text-xs text-slate-600 font-mono mt-1">ID: {selectedArticle.id}</p>
                </div>
                {selectedArticle.id && (
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400 border border-slate-700">
                      {articles.find(a => a.id === selectedArticle.id) ? 'Published' : 'Draft'}
                    </span>
                  </div>
                )}
            </div>

            <form onSubmit={handleSave} className="space-y-6 flex-grow flex flex-col">
                
                {/* Clean Title Input (Headline Style) */}
                <div>
                    <input
                        name="title"
                        value={selectedArticle.title}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none text-3xl font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-0 p-0"
                        placeholder="Article Title..."
                        required
                        autoComplete="off"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Category</label>
                            <select
                                name="category"
                                value={selectedArticle.category}
                                // @ts-ignore
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 focus:outline-none text-sm transition-colors hover:border-slate-600"
                            >
                                <option value="tip">Tip</option>
                                <option value="job">Job</option>
                                <option value="news">News</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Author</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                <input
                                    name="author"
                                    value={selectedArticle.author}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-white focus:border-indigo-500 focus:outline-none text-sm transition-colors hover:border-slate-600"
                                    placeholder="Writer Name"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Publish Date</label>
                            <input
                                name="date"
                                type="date"
                                value={selectedArticle.date}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 focus:outline-none text-sm transition-colors hover:border-slate-600"
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Read Time</label>
                            <input
                                name="readTime"
                                value={selectedArticle.readTime}
                                onChange={handleChange}
                                placeholder="e.g. 5 min read"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 focus:outline-none text-sm transition-colors hover:border-slate-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Tag Management Section */}
                <div>
                   <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide flex items-center justify-between">
                      <span>Tags (Keywords)</span>
                      <button 
                         type="button" 
                         onClick={handleAutoTag}
                         disabled={isGeneratingTags || (!selectedArticle.content && !selectedArticle.excerpt)}
                         className="flex items-center gap-1.5 text-[10px] text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                         {isGeneratingTags ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                         Auto-tag with AI
                      </button>
                   </label>
                   <div className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 flex flex-wrap gap-2 focus-within:border-indigo-500 transition-colors">
                      {selectedArticle.tags?.map((tag) => (
                         <span key={tag} className="bg-indigo-900/50 text-indigo-200 text-xs px-2 py-1 rounded flex items-center gap-1 border border-indigo-500/30">
                            #{tag}
                            <button 
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-white focus:outline-none"
                            >
                               <X className="w-3 h-3" />
                            </button>
                         </span>
                      ))}
                      <input 
                         type="text"
                         value={tagInput}
                         onChange={(e) => setTagInput(e.target.value)}
                         onKeyDown={handleAddTag}
                         placeholder={selectedArticle.tags && selectedArticle.tags.length > 0 ? "Add tag..." : "Type tag and press Enter..."}
                         className="bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none min-w-[120px] flex-grow"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Image URL</label>
                        <input
                            name="imageUrl"
                            value={selectedArticle.imageUrl}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 focus:outline-none font-mono text-xs"
                        />
                         <div className="mt-2 aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-800 relative group">
                            {selectedArticle.imageUrl ? (
                                <img src={selectedArticle.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No Image</div>
                            )}
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Excerpt</label>
                        <textarea
                            name="excerpt"
                            value={selectedArticle.excerpt}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none resize-none text-sm leading-relaxed"
                        />
                    </div>
                </div>

                <div className="flex-grow flex flex-col">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Content</label>
                    <textarea
                        name="content"
                        value={selectedArticle.content}
                        onChange={handleChange}
                        className="w-full flex-grow bg-slate-800 border border-slate-700 rounded-lg p-4 text-white focus:border-indigo-500 focus:outline-none font-mono text-sm min-h-[300px] leading-relaxed"
                        placeholder="<p>Write your article content here...</p>"
                    />
                </div>
                
                {/* Advanced: ID field (hidden by default unless new or specifically needed, here we show it small at bottom) */}
                <div className="pt-2">
                    <label className="text-[10px] text-slate-600 font-mono">Slug/ID: </label>
                    <input 
                        name="id"
                        value={selectedArticle.id}
                        onChange={handleChange}
                        className="bg-transparent border-none text-[10px] text-slate-500 font-mono focus:text-slate-300 focus:outline-none w-64"
                    />
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-700 items-center mt-auto">
                    <Button 
                        type="submit" 
                        disabled={isSaving}
                        className={`flex-1 flex items-center justify-center gap-2 transition-all duration-300 ${isSaving ? 'bg-indigo-700' : 'bg-green-600 hover:bg-green-700'} shadow-lg shadow-green-900/20`}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : status.message === 'Article saved successfully' ? (
                            <>
                                <Check className="w-4 h-4" />
                                Saved!
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Article
                            </>
                        )}
                    </Button>
                    
                    {articles.find(a => a.id === selectedArticle.id) && (
                        <>
                            {showDeleteConfirm ? (
                                <div className="flex gap-2 animate-fadeIn">
                                    <button 
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors border border-slate-600"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center text-sm font-bold transition-colors shadow-lg shadow-red-900/20"
                                    >
                                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Delete'}
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    type="button" 
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-4 py-3 bg-red-900/10 text-red-400 border border-red-900/30 hover:bg-red-900/20 rounded-lg flex items-center transition-colors hover:text-red-300"
                                    title="Delete Article"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </form>
        </div>

      </div>
    </div>
  );
};

export default AdminEditor;
