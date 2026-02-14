
import React, { useEffect, useState } from 'react';
import { getArticles } from '../services/articleService';
import { Article } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Briefcase, Lightbulb, Newspaper, Clock, ArrowRight, LayoutGrid, Search, Star } from 'lucide-react';
import AdSense from './AdSense';
import { AD_CONFIG } from '../constants';

interface BlogListProps {
  onSelectArticle: (article: Article) => void;
}

const BlogList: React.FC<BlogListProps> = ({ onSelectArticle }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'tip' | 'job' | 'news'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getArticles();
        setArticles(data);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'job': return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case 'tip': return <Lightbulb className="w-4 h-4 text-yellow-400" />;
      default: return <Newspaper className="w-4 h-4 text-blue-400" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'job': return t('categoryJob');
      case 'tip': return t('categoryTip');
      default: return t('categoryNews');
    }
  };

  const FilterButton = ({ id, label, icon: Icon }: { id: typeof activeFilter, label: string, icon: any }) => (
    <button
      onClick={() => setActiveFilter(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
          activeFilter === id 
          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20' 
          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-600'
      }`}
    >
        <Icon className={`w-4 h-4 ${activeFilter === id ? 'text-white' : ''}`} />
        {label}
    </button>
  );

  const filteredArticles = articles.filter(article => {
    // 1. Category Filter
    const matchesCategory = activeFilter === 'all' ? true : article.category === activeFilter;
    
    // 2. Search Filter
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesCategory;

    const matchesSearch = 
      article.title.toLowerCase().includes(term) || 
      article.excerpt.toLowerCase().includes(term) ||
      (article.tags && article.tags.some(tag => tag.toLowerCase().includes(term)));

    return matchesCategory && matchesSearch;
  });

  // Determine Featured Article behavior
  // We show a large featured card only when viewing "All" and not searching
  const showFeatured = activeFilter === 'all' && !searchTerm && filteredArticles.length > 0;
  const featuredArticle = showFeatured ? filteredArticles[0] : null;
  const gridArticles = showFeatured ? filteredArticles.slice(1) : filteredArticles;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-slate-800/50 rounded-2xl h-80 animate-pulse border border-slate-700" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn pb-12">
      {/* Blog Hero */}
      <div className="text-center py-12 px-4 bg-gradient-to-b from-indigo-900/20 to-transparent mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{t('blogTitle')}</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t('blogSubtitle')}</p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mt-6 relative animate-fadeIn">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500" />
           </div>
           <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 border border-slate-700/50 rounded-full leading-5 bg-slate-800/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all shadow-sm hover:border-slate-600"
              placeholder={t('searchArticles')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-3 mt-6 animate-fadeIn">
            <FilterButton id="all" label="All Posts" icon={LayoutGrid} />
            <FilterButton id="tip" label={t('categoryTip')} icon={Lightbulb} />
            <FilterButton id="job" label={t('categoryJob')} icon={Briefcase} />
            <FilterButton id="news" label={t('categoryNews')} icon={Newspaper} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Featured Article Card */}
        {featuredArticle && (
           <div 
             onClick={() => onSelectArticle(featuredArticle)}
             className="mb-12 cursor-pointer group relative rounded-3xl overflow-hidden border border-indigo-500/30 bg-slate-800/40 hover:bg-slate-800/60 hover:border-indigo-500/50 transition-all duration-300 shadow-2xl shadow-indigo-900/10 animate-fadeIn"
           >
              <div className="grid md:grid-cols-2 gap-0 h-full">
                 <div className="relative aspect-video md:aspect-auto md:h-full overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <span className="bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 ring-1 ring-white/20">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>Featured</span>
                        </span>
                        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-white flex items-center gap-1.5 border border-white/10">
                            {getCategoryIcon(featuredArticle.category)}
                            <span>{getCategoryLabel(featuredArticle.category)}</span>
                        </div>
                    </div>
                    <img 
                        src={featuredArticle.imageUrl} 
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-none opacity-90 md:opacity-100" />
                 </div>
                 <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center relative bg-gradient-to-b from-slate-800/0 to-slate-900/50 md:bg-none">
                    <div className="flex items-center gap-3 text-sm text-indigo-400 mb-4 font-medium">
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {featuredArticle.readTime}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">{featuredArticle.date}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-indigo-300 transition-colors">
                        {featuredArticle.title}
                    </h2>
                    <p className="text-slate-300 text-base md:text-lg mb-6 line-clamp-3 md:line-clamp-4 leading-relaxed">
                        {featuredArticle.excerpt}
                    </p>
                    
                    {/* Tags */}
                    {featuredArticle.tags && featuredArticle.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                        {featuredArticle.tags.slice(0, 4).map(tag => (
                            <span key={tag} className="text-xs bg-slate-700/50 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                            #{tag}
                            </span>
                        ))}
                        </div>
                    )}

                    <div className="flex items-center text-indigo-400 font-bold mt-auto group-hover:translate-x-2 transition-transform">
                        {t('readMore')} <ArrowRight className="w-5 h-5 ml-2 rtl:rotate-180 rtl:ml-0 rtl:mr-2" />
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Regular Grid */}
        {gridArticles.length === 0 && !featuredArticle ? (
            <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-800 border-dashed">
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-2">No articles found matching "{searchTerm}"</p>
                <p className="text-slate-500 text-sm">Try adjusting your search or filters.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setActiveFilter('all'); }} 
                  className="mt-6 text-indigo-400 hover:text-indigo-300 text-sm font-medium hover:underline"
                >
                  Clear all filters
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridArticles.map((article, index) => {
                // Logic to insert Ad card every 3 items
                const card = (
                <div 
                    key={article.id}
                    onClick={() => onSelectArticle(article)}
                    className="group bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all cursor-pointer flex flex-col h-full"
                >
                    <div className="aspect-video w-full overflow-hidden bg-slate-900 relative">
                    <img 
                        src={article.imageUrl} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1.5 border border-white/10">
                        {getCategoryIcon(article.category)}
                        <span>{getCategoryLabel(article.category)}</span>
                    </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <span>{article.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                        </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-indigo-300 transition-colors">
                        {article.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-grow">
                        {article.excerpt}
                    </p>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                        {article.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                            #{tag}
                            </span>
                        ))}
                        {article.tags.length > 3 && (
                            <span className="text-[10px] text-slate-500 self-center">+{article.tags.length - 3}</span>
                        )}
                        </div>
                    )}
                    
                    <div className="flex items-center text-indigo-400 text-sm font-medium mt-auto group-hover:translate-x-1 transition-transform">
                        {t('readMore')} <ArrowRight className="w-4 h-4 ml-1 rtl:rotate-180 rtl:ml-0 rtl:mr-1" />
                    </div>
                    </div>
                </div>
                );

                // Inject AdSense Ad after every 3rd post (index 3, 7, 11...)
                if ((index + 1) % 4 === 0) {
                return (
                    <React.Fragment key={`${article.id}-ad`}>
                    {card}
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4 min-h-[300px]">
                        <span className="text-[10px] uppercase tracking-widest text-slate-600 mb-2">{t('advertisement')}</span>
                        <AdSense 
                            slot={AD_CONFIG.SLOTS.BLOG_GRID} 
                            format="rectangle" 
                            variant="card"
                        />
                    </div>
                    </React.Fragment>
                );
                }

                return card;
            })}
            </div>
        )}
        
        {/* Bottom Banner Ad */}
        <div className="mt-12">
            <AdSense slot={AD_CONFIG.SLOTS.BLOG_BOTTOM} />
        </div>
      </div>
    </div>
  );
};

export default BlogList;
