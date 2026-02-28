
import React, { useState } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import StyleSelector from './components/StyleSelector';
import ResultDisplay from './components/ResultDisplay';
import Button from './components/Button';
import AdSense from './components/AdSense';
import ImageCropper from './components/ImageCropper';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import ContactUs from './components/ContactUs';
import About from './components/About';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import AdminEditor from './components/AdminEditor';
import RewardedAdModal from './components/RewardedAdModal';
import EarnCreditsModal from './components/EarnCreditsModal';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import FAQ from './components/FAQ';
import Testimonials from './components/Testimonials';
import ProfessionalTips from './components/ProfessionalTips';
import PortfolioView from './components/PortfolioView';
import SEO from './components/SEO';
import { generateHeadshot, editHeadshot } from './services/geminiService';
import { checkDailyLimit, incrementDailyUsage, addCredits, recordLinkedInClaim } from './services/usageService';
import { AppState, ChatMessage, Article, PortfolioData } from './types';
import { HEADSHOT_STYLES, AD_CONFIG } from './constants';
import { Wand2, AlertCircle, PlayCircle } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

const MOHAMED_PORTFOLIO: PortfolioData = {
  name: "Mohamed Farid Amin",
  title: "Operations Senior Supervisor",
  summary: "Results-driven Contact Centre Supervisor with over 10 years of experience in telecommunications, loyalty programs, and shopping mall operations. Proven expertise in optimizing processes, leading high-performing teams, and implementing data-driven solutions to enhance customer experience and operational efficiency. Expertise in SLA-driven environments and CRM automation tools like Zendesk, Genesys Cloud and Infobip.",
  photo: "https://i.postimg.cc/QxyTqQPm/Personal-photo2.png", 
  skills: [
    { name: "Team Leadership", level: 98 },
    { name: "Operations Management", level: 96 },
    { name: "Process Optimization", level: 94 },
    { name: "Power BI & Analytics", level: 90 },
    { name: "CRM Automation", level: 95 },
    { name: "SLA Management", level: 97 }
  ],
  experience: [
    {
      company: "Hexaware Egypt",
      role: "Operations Senior Supervisor",
      period: "April 2025 - Present",
      description: "VFS Global Operations. Leading a team of 20 agents across multi-channel operations. Responsible for ensuring QMS documentation is up to date, resource planning, and analyzing attrition. Ensuring production through optimal work allocation and monitoring."
    },
    {
      company: "Teleperformance Dubai",
      role: "Operations Supervisor",
      period: "Oct 2021 - Oct 2024",
      description: "Majid Al Futtaim Shopping Malls and Loyalty Program. Led a team of 18 agents, improving productivity by 20%. Streamlined processes for seamless customer experience. Handled VIP client support across four countries."
    },
    {
      company: "RAYA Contact Center",
      role: "Technical Support Team Manager",
      period: "May 2015 - Sep 2021",
      description: "Delivered bilingual technical assistance to UAE-based customers. Diagnosed 60+ daily technical issues with 94% first-contact resolution. Reduced escalations to backend teams by 25% and cut AHT by 15% through a centralized knowledge base."
    }
  ],
  education: [
    {
      school: "Cairo University – Egypt",
      degree: "Bachelor’s in Business Administration, Investment, and Financing",
      year: "2006 – 2010"
    },
    {
      school: "Cambridge Training College Britain",
      degree: "General English Advanced Level",
      year: "2011"
    }
  ],
  projects: [
    {
      name: "BrainBox Implementation Leader",
      description: "Recognized by Hexaware for designing and implementing the VFS knowledgebase, significantly improving operational efficiency.",
      tech: ["Knowledge Management", "Process Design"]
    },
    {
      name: "Lean 6sigma Yellow Project",
      description: "Top contributor for AHT reduction project which had a direct positive impact on VFS operations and cost saving.",
      tech: ["Lean Six Sigma", "Operational Excellence"]
    },
    {
      name: "Automated Escalation Platform",
      description: "Achieved $29,000 annual cost savings by implementing an automated escalation platform for improved process management.",
      tech: ["Automation", "CRM"]
    }
  ],
  certifications: [
    { 
      name: "Lean Six Sigma Yellow Belt", 
      issuer: "Hexaware technology (Jan 2026)",
      image: "https://i.postimg.cc/tTNr1SBv/LSSYB.png"
    },
    { 
      name: "SHARE Certificate", 
      issuer: "Majid Al Futtaim",
      image: "https://i.postimg.cc/7CX8mxDj/SHARE-Certificate.png"
    },
    { 
      name: "Most Engaged Leaders 2022-2023", 
      issuer: "Majid Al Futtaim / Teleperformance",
      image: "https://i.postimg.cc/SXmb6X0T/TP-top-achiever.png"
    },
    { 
      name: "BrainBox Implementation Leader", 
      issuer: "Hexaware (Dec 2025)",
      image: "https://i.postimg.cc/L4vfJK3N/Brain-Box.jpg"
    },
    { 
      name: "General English Advanced Level", 
      issuer: "Cambridge Training College Britain",
      image: "https://i.postimg.cc/zVPN1DgV/Cambridge.jpg"
    },
    { 
      name: "Letter of Recognition", 
      issuer: "Allianz (Sep 2012)",
      image: "https://i.postimg.cc/vcSyd8Vx/Allianz.jpg"
    }
  ]
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  const [tempImage, setTempImage] = useState<string | null>(null);
  
  // Handle direct links and back button
  React.useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === '/portfolio') {
        setAppState('portfolio-view');
      } else if (path === '/privacy') {
        setAppState('privacy');
      } else if (path === '/terms') {
        setAppState('terms');
      } else if (path === '/contact') {
        setAppState('contact');
      } else if (path === '/about') {
        setAppState('about');
      } else if (path === '/blog') {
        setAppState('blog-list');
      } else if (path.startsWith('/blog/')) {
        setAppState('blog-list'); // Simplified for now
      } else {
        setAppState('upload');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (state: AppState, path: string) => {
    setAppState(state);
    window.history.pushState({ state }, '', path);
    window.scrollTo(0, 0);
  };

  const handleLegalNavigation = (state: AppState) => {
    const pathMap: Record<string, string> = {
      'privacy': '/privacy',
      'terms': '/terms',
      'contact': '/contact',
      'about': '/about',
      'blog-list': '/blog',
      'portfolio-view': '/portfolio',
      'upload': '/'
    };
    navigate(state, pathMap[state] || '/');
  };

  const handleLegalBack = () => {
    window.history.back();
  };

  const handleViewPortfolio = () => {
    handleLegalNavigation('portfolio-view');
  };
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [portfolioData] = useState<PortfolioData | null>(MOHAMED_PORTFOLIO);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usageUpdateKey, setUsageUpdateKey] = useState(0);

  const [showRewardedAd, setShowRewardedAd] = useState(false);
  const [showEarnCredits, setShowEarnCredits] = useState(false);
  // const [showAuthModal, setShowAuthModal] = useState(false); // Disabled

  const { t, language } = useLanguage();
  
  const [imageHistory, setImageHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const getSEOProps = () => {
    switch (appState) {
      case 'portfolio-view':
        return {
          title: 'Mohamed Farid Amin - Portfolio',
          description: 'Operations Senior Supervisor with over 10 years of experience in telecommunications, loyalty programs, and shopping mall operations.',
          canonicalUrl: 'https://proheadshot.ai/portfolio',
          image: portfolioData?.photo || 'https://i.postimg.cc/ppKrWFP5/Personal-photo2.png'
        };
      case 'upload':
        return {
          title: 'AI Professional Headshot Generator',
          description: 'Generate professional headshots with AI. Upload your photo and get a high-quality professional portrait instantly.',
          canonicalUrl: 'https://proheadshot.ai/'
        };
      case 'privacy':
        return { 
          title: t('privacyPolicy'), 
          description: 'Privacy Policy for ProHeadshot AI. Learn how we handle your data and images.',
          canonicalUrl: 'https://proheadshot.ai/privacy'
        };
      case 'terms':
        return { 
          title: t('termsConditions'), 
          description: 'Terms and conditions for using ProHeadshot AI services.',
          canonicalUrl: 'https://proheadshot.ai/terms'
        };
      case 'contact':
        return { 
          title: t('contactUs'), 
          description: 'Contact ProHeadshot AI support and feedback.',
          canonicalUrl: 'https://proheadshot.ai/contact'
        };
      case 'about':
        return { 
          title: t('aboutUs'), 
          description: 'Learn about ProHeadshot AI and our mission to democratize professional photography.',
          canonicalUrl: 'https://proheadshot.ai/about'
        };
      case 'blog-list':
        return {
          title: t('blogTitle'),
          description: t('blogSubtitle'),
          canonicalUrl: 'https://proheadshot.ai/blog'
        };
      case 'blog-post':
        if (selectedArticle) {
          return {
            title: selectedArticle.title,
            description: selectedArticle.excerpt,
            image: selectedArticle.imageUrl,
            type: 'article' as const,
            canonicalUrl: `https://proheadshot.ai/blog/${selectedArticle.id}`
          };
        }
        return {
          title: 'Article | ProHeadshot AI',
          description: 'Read the latest tips and career advice.',
          canonicalUrl: `https://proheadshot.ai/blog`
        };
      case 'admin':
        return {
          title: 'Admin Dashboard | ProHeadshot AI',
          description: 'Manage content.'
        };
      case 'style-selection':
        const activeStyle = selectedStyleId ? HEADSHOT_STYLES.find(s => s.id === selectedStyleId) : null;
        return { 
          title: t('chooseStyle'), 
          description: activeStyle 
            ? `Create a ${activeStyle.name} headshot with AI. ${activeStyle.description}`
            : 'Select from various professional headshot styles including Corporate, Tech, and Outdoor.',
          image: activeStyle?.thumbnail
        };
      case 'result':
        return { 
          title: 'Your Professional Headshots', 
          description: 'View, edit, and download your AI-generated professional headshots.' 
        };
      default:
        return {};
    }
  };

  const seoProps = getSEOProps();

  const handleImageSelected = (base64: string) => {
    setTempImage(base64);
    setAppState('cropping');
    setError(null);
  };

  const handleCropComplete = (croppedBase64: string) => {
    setOriginalImage(croppedBase64);
    setAppState('style-selection');
  };

  const handleCropCancel = () => {
    setTempImage(null);
    setAppState('upload');
  };

  const handleStyleSelected = (id: string) => {
    setSelectedStyleId(id);
    setError(null);
  };



  const handleGenerate = async () => {
    if (!originalImage || !selectedStyleId) return;

    // Check Daily Limit
    const limitCheck = await checkDailyLimit();
    if (!limitCheck.allowed) {
      if (limitCheck.reason === 'ip_limit') {
        setError('Too many requests from this IP address. Please try again tomorrow.');
      } else {
        setError(t('dailyLimitReached').replace('{time}', limitCheck.timeRemainingStr || '24h'));
        setShowEarnCredits(true); // Auto-open earn credits modal if limit reached
      }
      return;
    }

    const style = HEADSHOT_STYLES.find(s => s.id === selectedStyleId);
    if (!style) return;

    setIsGenerating(true);
    setError(null);

    try {
      const generatedImage = await generateHeadshot(originalImage, style.promptModifier);
      
      await incrementDailyUsage();
      setUsageUpdateKey(prev => prev + 1);

      setCurrentImage(generatedImage);
      setImageHistory([generatedImage]);
      setHistoryIndex(0);
      setAppState('result');
      
      const styleName = language === 'ar' ? style.name_ar : style.name;
      setChatMessages([
        {
          id: 'init',
          role: 'assistant',
          text: language === 'ar' 
            ? `ها هي صورتك بنمط ${styleName}! أخبرني إذا كنت تريد إجراء أي تعديلات.`
            : `Here is your ${styleName} headshot! Let me know if you want to make any edits.`,
          timestamp: Date.now()
        }
      ]);

    } catch (err: any) {
      setError(err.message || t('errorGeneric'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditMessage = async (text: string, customSuccessMessage?: string) => {
    if (!currentImage) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);
    
    try {
      const newImage = await editHeadshot(currentImage, text);
      
      const newHistory = imageHistory.slice(0, historyIndex + 1);
      newHistory.push(newImage);
      
      setImageHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCurrentImage(newImage);
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: customSuccessMessage || t('successEdit'),
        timestamp: Date.now()
      };
      
      setChatMessages(prev => [...prev, assistantMsg]);

    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `${t('errorEdit')} ${err.message}`,
        timestamp: Date.now()
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentImage(imageHistory[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < imageHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentImage(imageHistory[newIndex]);
    }
  };

  const handleReset = () => {
    setAppState('upload');
    setOriginalImage(null);
    setTempImage(null);
    setCurrentImage(null);
    setSelectedStyleId(null);
    setChatMessages([]);
    setImageHistory([]);
    setHistoryIndex(-1);
    setError(null);
  };



  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setAppState('blog-post');
    window.history.pushState({ state: 'blog-post' }, '', `/blog/${article.id}`);
  };

  const handleAdRewardGranted = () => {
    addCredits(1);
    setUsageUpdateKey(prev => prev + 1);
    setError(null);
  };

  const handleLinkedInShare = async () => {
    // Check limit on UI side is handled by Modal, but we record here
    recordLinkedInClaim();
    
    // Reward credits
    addCredits(3);
    setUsageUpdateKey(prev => prev + 1);
    setError(null);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
        <SEO {...seoProps} />
        
        <RewardedAdModal 
          isOpen={showRewardedAd}
          onClose={() => setShowRewardedAd(false)}
          onRewardGranted={handleAdRewardGranted}
        />

        <EarnCreditsModal
          isOpen={showEarnCredits}
          onClose={() => setShowEarnCredits(false)}
          onWatchAd={() => setShowRewardedAd(true)}
          onShareLinkedIn={handleLinkedInShare}
          generatedImage={currentImage} // Pass the generated image here
        />

        {/* 
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        /> 
        */}

        <Header 
          onReset={handleReset} 
          canReset={['style-selection', 'result'].includes(appState)} 
          refreshKey={usageUpdateKey}
          onOpenCredits={() => setShowEarnCredits(true)}
          onNavigateBlog={() => handleLegalNavigation('blog-list')}
          onNavigatePortfolio={() => handleLegalNavigation('portfolio-view')}
          // onOpenAuth={() => setShowAuthModal(true)} // Disabled
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 w-full flex-grow pb-12">
          
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-red-200 animate-fadeIn">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
              
              {error.includes('limit') && (
                <div className="flex gap-2 w-full sm:w-auto">
                   <button 
                     onClick={() => setShowEarnCredits(true)}
                     className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-slate-600 whitespace-nowrap"
                   >
                     <PlayCircle className="w-4 h-4 text-indigo-400" />
                     {t('getMoreCredits')}
                   </button>
                </div>
              )}
            </div>
          )}

          {appState === 'privacy' && <PrivacyPolicy onBack={handleLegalBack} />}
          {appState === 'terms' && <TermsConditions onBack={handleLegalBack} />}
          {appState === 'contact' && <ContactUs onBack={handleLegalBack} />}
          {appState === 'about' && <About onBack={handleLegalBack} />}
          
          {appState === 'blog-list' && <BlogList onSelectArticle={handleSelectArticle} />}
          {appState === 'blog-post' && selectedArticle && <BlogPost article={selectedArticle} onBack={handleLegalBack} />}
          {appState === 'admin' && <AdminEditor onBack={handleLegalBack} />}
          {appState === 'portfolio-view' && portfolioData && (
            <PortfolioView 
              data={portfolioData} 
              onBack={handleLegalBack} 
            />
          )}

          {appState === 'upload' && (
             <div className="flex flex-col items-center animate-fadeIn mt-6 sm:mt-12">
               <div className="text-center mb-8 sm:mb-10 px-4">
                 <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                   {t('heroTitle')} <br className="hidden sm:block" />
                   <span className="text-indigo-500 block sm:inline">{t('heroSubtitle')}</span>
                 </h2>
                 <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                   {t('heroDesc')}
                 </p>
               </div>
               <UploadZone onImageSelected={handleImageSelected} />
               
               <div className="mt-12 w-full max-w-4xl mx-auto bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
                 <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">View My Interactive Portfolio</h3>
                 <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                   Explore my professional journey, technical skills, and key achievements through this AI-powered interactive showcase.
                 </p>
                 <Button 
                   onClick={handleViewPortfolio}
                   className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/20"
                 >
                   Explore Portfolio
                 </Button>
               </div>
               
               <AdSense slot={AD_CONFIG.SLOTS.HOME_HERO} className="mt-8 sm:mt-12" />

               <Features />
               <HowItWorks />
               <ProfessionalTips />
               <Testimonials />
               
               <div className="w-full py-16 border-t border-slate-800">
                 <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
                   <h2 className="text-3xl font-bold text-white">{t('blogTitle')}</h2>
                   <button 
                     onClick={() => handleLegalNavigation('blog-list')}
                     className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-2"
                   >
                     {t('readMore')} &rarr;
                   </button>
                 </div>
                 <BlogList onSelectArticle={handleSelectArticle} limit={3} hideHero />
               </div>

               <FAQ />
             </div>
          )}

          {appState === 'cropping' && tempImage && (
            <ImageCropper 
              imageSrc={tempImage}
              onCropComplete={handleCropComplete}
              onCancel={handleCropCancel}
            />
          )}

          {appState === 'style-selection' && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn relative">
              <div className="sticky top-16 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/80 py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 shadow-lg transition-all flex flex-col sm:flex-row justify-between items-center gap-4">
                 <div className="flex items-center gap-4 w-full sm:w-auto">
                   <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-slate-600 shrink-0 relative group">
                      <img src={originalImage || ''} className="w-full h-full object-cover" alt="Source" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <div>
                     <h3 className="text-base sm:text-lg font-medium text-white">{t('sourceImage')}</h3>
                     <button onClick={() => setAppState('upload')} className="text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-2">{t('changePhoto')}</button>
                   </div>
                 </div>
                 
                 <Button 
                   onClick={handleGenerate} 
                   disabled={!selectedStyleId} 
                   isLoading={isGenerating}
                   className="w-full sm:w-auto min-w-[160px] shadow-indigo-500/20 shadow-lg"
                 >
                   <Wand2 className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                   {t('generateHeadshot')}
                 </Button>
              </div>
              
              <div className="pt-2">
                  <AdSense slot={AD_CONFIG.SLOTS.STYLE_SELECTION_TOP} />
              </div>

              <StyleSelector 
                selectedStyleId={selectedStyleId} 
                onSelectStyle={handleStyleSelected} 
                originalImage={originalImage || ''}
              />
            </div>
          )}

          {appState === 'result' && originalImage && currentImage && (
            <div className="animate-fadeIn space-y-8 sm:space-y-12">
              
              <ResultDisplay 
                originalImage={originalImage}
                generatedImage={currentImage}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < imageHistory.length - 1}
                chatMessages={chatMessages}
                onSendMessage={handleEditMessage}
                isProcessing={isGenerating}
                onSelectArticle={handleSelectArticle}
              />

              <AdSense slot={AD_CONFIG.SLOTS.RESULT_BOTTOM} />

            </div>
          )}
        </main>

        <Footer onNavigate={handleLegalNavigation} />
      </div>
    </AuthProvider>
  );
};

export default App;
