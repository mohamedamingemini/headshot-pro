
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import ContactUs from './components/ContactUs';
import About from './components/About';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import AdminEditor from './components/AdminEditor';
import Favorites from './components/Favorites';
import PortfolioView from './components/PortfolioView';
import SEO from './components/SEO';
import { AppState, Article, PortfolioData } from './types';
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
  const [appState, setAppState] = useState<AppState>('portfolio-view');
  
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
        setAppState('portfolio-view');
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
      'upload': '/portfolio' // Redirect upload to portfolio
    };
    navigate(state, pathMap[state] || '/portfolio');
  };

  const handleLegalBack = () => {
    window.history.back();
  };

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [portfolioData] = useState<PortfolioData | null>(MOHAMED_PORTFOLIO);
  
  const { t } = useLanguage();
  
  const getSEOProps = () => {
    switch (appState) {
      case 'portfolio-view':
        return {
          title: 'Mohamed Farid Amin - Portfolio',
          description: 'Operations Senior Supervisor with over 10 years of experience in telecommunications, loyalty programs, and shopping mall operations.',
          canonicalUrl: 'https://proheadshot.ai/portfolio',
          image: portfolioData?.photo || 'https://i.postimg.cc/ppKrWFP5/Personal-photo2.png'
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
      default:
        return {};
    }
  };

  const seoProps = getSEOProps();

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setAppState('blog-post');
    window.history.pushState({ state: 'blog-post' }, '', `/blog/${article.id}`);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
        <SEO {...seoProps} />
        
        <Header 
          onNavigateBlog={() => handleLegalNavigation('blog-list')}
          onNavigatePortfolio={() => handleLegalNavigation('portfolio-view')}
          onNavigateFavorites={() => handleLegalNavigation('favorites')}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 w-full flex-grow pb-12">
          
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
            />
          )}
          {appState === 'favorites' && (
            <Favorites onBack={handleLegalBack} />
          )}
        </main>

        <Footer onNavigate={handleLegalNavigation} />
      </div>
    </AuthProvider>
  );
};

export default App;
