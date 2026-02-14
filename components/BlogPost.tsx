
import React, { useEffect, useState } from 'react';
import { Article } from '../types';
import { getArticleById } from '../services/articleService';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Calendar, User, Clock, Share2, Linkedin, Twitter, Facebook, Link as LinkIcon, Check, Tag } from 'lucide-react';
import Button from './Button';
import AdSense from './AdSense';
import { AD_CONFIG } from '../constants';

interface BlogPostProps {
  id?: string;
  article?: Article;
  onBack: () => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ id, article: initialArticle, onBack }) => {
  const [article, setArticle] = useState<Article | null>(initialArticle || null);
  const [loading, setLoading] = useState(!initialArticle);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // If we have an initial article, use it and don't fetch
    if (initialArticle) {
        setArticle(initialArticle);
        setLoading(false);
        return;
    }

    const fetchArticle = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getArticleById(id);
      setArticle(data || null);
      setLoading(false);
    };
    fetchArticle();
    window.scrollTo(0,0);
  }, [id, initialArticle]);

  const handleShare = (platform: 'linkedin' | 'twitter' | 'facebook' | 'copy') => {
    if (!article) return;
    
    const url = encodeURIComponent(window.location.href); 
    const title = encodeURIComponent(article.title);

    let shareUrl = '';
    const width = 600;
    const height = 400;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const windowFeatures = `width=${width},height=${height},top=${top},left=${left},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`;

    switch (platform) {
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            window.open(shareUrl, 'linkedin_share', windowFeatures);
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
            window.open(shareUrl, 'twitter_share', windowFeatures);
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            window.open(shareUrl, 'facebook_share', windowFeatures);
            break;
        case 'copy':
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            break;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!article) return <div className="text-center py-20 text-slate-400">Article not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <Button variant="ghost" onClick={onBack} className="mb-6 pl-0 hover:bg-transparent hover:text-white group text-slate-400">
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
        {t('backToBlog')}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2">
          
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/20 mb-4 capitalize">
              {article.category}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                    </div>
                </div>

                {/* Social Share Buttons */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleShare('linkedin')}
                        className="p-2 bg-slate-800 hover:bg-[#0077b5] text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700 hover:border-[#0077b5]"
                        title="Share on LinkedIn"
                    >
                        <Linkedin className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => handleShare('twitter')}
                        className="p-2 bg-slate-800 hover:bg-black text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700 hover:border-slate-500"
                        title="Share on X (Twitter)"
                    >
                        <Twitter className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => handleShare('facebook')}
                        className="p-2 bg-slate-800 hover:bg-[#1877F2] text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700 hover:border-[#1877F2]"
                        title="Share on Facebook"
                    >
                        <Facebook className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => handleShare('copy')}
                        className="p-2 bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700 hover:border-indigo-500 relative group"
                        title="Copy Link"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <LinkIcon className="w-4 h-4" />}
                        {copied && (
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                                Copied!
                            </span>
                        )}
                    </button>
                </div>
            </div>
          </div>

          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-800 mb-8 border border-slate-700/50">
             <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>

          {/* Article Content */}
          <article className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-slate-300 prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-strong:text-white prose-li:text-slate-300">
             {/* We rely on the mock data being safe. In production with user input, sanitize this! */}
             <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </article>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
             <div className="mt-8 flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-slate-500 mr-2" />
                {article.tags.map(tag => (
                   <span key={tag} className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1 rounded-full border border-slate-700 transition-colors cursor-default">
                      #{tag}
                   </span>
                ))}
             </div>
          )}

          {/* In-Article Ad (Bottom) */}
          <div className="my-10 pt-8 border-t border-slate-800">
             <span className="text-[10px] uppercase tracking-widest text-slate-600 block mb-2 text-center">{t('advertisement')}</span>
             <AdSense slot={AD_CONFIG.SLOTS.BLOG_BOTTOM} />
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 space-y-8">
           
           {/* Sidebar Ad (Sticky) */}
           <div className="bg-slate-800/20 rounded-xl p-4 border border-slate-700/30 flex flex-col items-center sticky top-24">
              <span className="text-[10px] uppercase tracking-widest text-slate-600 mb-2 w-full text-center">{t('advertisement')}</span>
              <AdSense slot={AD_CONFIG.SLOTS.BLOG_SIDEBAR} format="rectangle" />
           </div>

        </div>

      </div>
    </div>
  );
};

export default BlogPost;
