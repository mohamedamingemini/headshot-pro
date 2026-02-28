
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  orderBy, 
  limit, 
  setDoc, 
  deleteDoc, 
  updateDoc,
  QuerySnapshot,
  DocumentSnapshot,
  DocumentData
} from "firebase/firestore";
import { db } from "./firebase";
import { Article } from "../types";

// Mock data to ensure the system works immediately without database population
const MOCK_ARTICLES: Article[] = [
  // --- LEGAL & LAW (High CPC) ---
  {
    id: 'legal-1',
    title: 'Why Attorneys Need High-End Headshots for Client Trust',
    excerpt: 'In the legal profession, credibility is everything. Learn how a professional portrait can influence a client\'s decision to hire your firm.',
    content: `
      <p>For attorneys, the first point of contact with a potential client is often a digital profile. Whether it's on your firm's website or a legal directory like Avvo, your headshot speaks volumes before you even say a word.</p>
      <h3>The Psychology of Trust in Law</h3>
      <p>Clients seeking legal counsel are often in high-stress situations. They are looking for authority, empathy, and reliability. A professional headshot that captures a confident yet approachable expression can significantly lower the barrier to that first consultation.</p>
      <h3>Key Elements for Legal Portraits</h3>
      <ul>
        <li><strong>Attire:</strong> Traditional business formal remains the gold standard for most practices.</li>
        <li><strong>Background:</strong> A blurred law library or a clean, neutral office setting conveys stability.</li>
        <li><strong>Lighting:</strong> Soft, even lighting avoids harsh shadows that can make one look unapproachable.</li>
      </ul>
    `,
    category: 'tip',
    author: 'Mark Sterling, JD',
    date: '2024-06-01',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    tags: ['legal', 'attorney', 'law-firm', 'branding']
  },
  {
    id: 'legal-2',
    title: 'Personal Branding for Trial Lawyers: Standing Out in a Crowded Market',
    excerpt: 'Trial lawyers need to project power and competence. Discover the visual strategies used by top-tier litigators.',
    content: `<p>Litigation is a high-stakes environment. Your visual brand should reflect your ability to command a courtroom.</p>`,
    category: 'tip',
    author: 'Elena Rossi',
    date: '2024-06-02',
    imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['litigation', 'lawyer', 'branding']
  },
  {
    id: 'legal-3',
    title: 'The Impact of Professional Headshots on Law Firm Conversion Rates',
    excerpt: 'Data shows that law firms with professional team photos see a 20% higher inquiry rate than those using stock or low-quality images.',
    content: `<p>Investing in your team's visual identity isn't just about aesthetics; it's a direct driver of ROI for your practice.</p>`,
    category: 'news',
    author: 'Legal Marketing Pro',
    date: '2024-06-03',
    imageUrl: 'https://images.unsplash.com/photo-1453723490680-8b95583b1c24?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min read',
    tags: ['marketing', 'roi', 'law-firm']
  },
  {
    id: 'legal-4',
    title: 'Hiring: Associate Attorney - Personal Injury (Remote)',
    excerpt: 'Join a leading personal injury firm. We value digital presence and client-focused advocacy.',
    content: `<p>We are seeking a motivated Associate Attorney to handle a diverse caseload of personal injury matters.</p>`,
    category: 'job',
    author: 'Justice Partners',
    date: '2024-06-04',
    imageUrl: 'https://images.unsplash.com/photo-1423592707957-3b212afa6733?auto=format&fit=crop&w=800&q=80',
    readTime: 'Job Opening',
    tags: ['hiring', 'legal', 'remote']
  },
  {
    id: 'legal-5',
    title: 'Corporate Counsel: Navigating the Shift to Virtual Presence',
    excerpt: 'As more legal work moves online, corporate counsel must master the art of the digital first impression.',
    content: `<p>In-house legal teams are no longer hidden in back offices. They are strategic partners who need a visible, professional brand.</p>`,
    category: 'tip',
    author: 'David Chen',
    date: '2024-06-05',
    imageUrl: 'https://images.unsplash.com/photo-1521791136364-798a7bc0d262?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['corporate-law', 'legal-tech']
  },
  {
    id: 'legal-6',
    title: 'How to Choose the Right Background for Your Legal Headshot',
    excerpt: 'From traditional libraries to modern glass offices, the right backdrop sets the tone for your legal practice.',
    content: `<p>The background of your photo is as important as your attire. It provides context and reinforces your specialty.</p>`,
    category: 'tip',
    author: 'Studio Expert',
    date: '2024-06-06',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min read',
    tags: ['photography', 'legal']
  },
  {
    id: 'legal-7',
    title: 'The Ethics of AI in Legal Marketing',
    excerpt: 'Can lawyers use AI-generated headshots? We explore the ethical considerations and best practices.',
    content: `<p>As AI becomes more prevalent, legal professionals must ensure their marketing remains truthful and not misleading.</p>`,
    category: 'news',
    author: 'Ethics Board',
    date: '2024-06-07',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    tags: ['ethics', 'ai', 'legal']
  },

  // --- INSURANCE & RISK (High CPC) ---
  {
    id: 'insurance-1',
    title: 'Building Credibility as an Independent Insurance Broker',
    excerpt: 'In the insurance world, you aren\'t just selling a policy; you\'re selling peace of mind. Your image is the first step.',
    content: `
      <p>Insurance is built on the promise of protection. If a client doesn't trust the messenger, they won't buy the message. As an independent broker, you are your own brand.</p>
      <h3>The Visual Language of Security</h3>
      <p>When clients look at your profile, they are subconsciously asking: "Is this person responsible? Will they be there when I have a claim?"</p>
      <ul>
        <li><strong>Professionalism:</strong> A high-quality headshot shows you take your business seriously.</li>
        <li><strong>Approachability:</strong> A warm smile can make complex insurance topics feel less intimidating.</li>
        <li><strong>Consistency:</strong> Using the same professional photo across LinkedIn, your website, and email signatures builds brand recognition.</li>
      </ul>
    `,
    category: 'tip',
    author: 'Sarah Miller',
    date: '2024-06-08',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['insurance', 'broker', 'trust']
  },
  {
    id: 'insurance-2',
    title: 'Personal Branding for Life Insurance Agents',
    excerpt: 'Life insurance is a personal and sensitive topic. Your headshot should reflect empathy and stability.',
    content: `<p>Agents who project warmth and reliability often see higher conversion rates on their lead generation pages.</p>`,
    category: 'tip',
    author: 'James Wilson',
    date: '2024-06-09',
    imageUrl: 'https://images.unsplash.com/photo-1556745753-b2904692b3cd?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min read',
    tags: ['life-insurance', 'sales']
  },
  {
    id: 'insurance-3',
    title: 'Hiring: Claims Adjuster - Commercial Property',
    excerpt: 'Join our national insurance carrier. We value professionals who represent our brand with integrity.',
    content: `<p>We are looking for an experienced Claims Adjuster to handle complex commercial property claims.</p>`,
    category: 'job',
    author: 'Global Insure',
    date: '2024-06-10',
    imageUrl: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&w=800&q=80',
    readTime: 'Job Opening',
    tags: ['hiring', 'claims', 'insurance']
  },
  {
    id: 'insurance-4',
    title: 'The Role of Visual Identity in Insurance Lead Generation',
    excerpt: 'Why high-quality portraits are essential for your insurance landing pages and social media ads.',
    content: `<p>A professional image can reduce bounce rates on your lead forms by up to 15%.</p>`,
    category: 'news',
    author: 'Marketing Insights',
    date: '2024-06-11',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    tags: ['lead-gen', 'insurance']
  },
  {
    id: 'insurance-5',
    title: 'Risk Management: Protecting Your Professional Reputation',
    excerpt: 'Your online presence is a liability if not managed correctly. Learn how to audit your visual brand.',
    content: `<p>In the risk management industry, your own reputation is your most valuable asset.</p>`,
    category: 'tip',
    author: 'Robert Vance',
    date: '2024-06-12',
    imageUrl: 'https://images.unsplash.com/photo-1507206130118-b5907f817163?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['risk-management', 'reputation']
  },
  {
    id: 'insurance-6',
    title: 'How to Dress for an Insurance Professional Headshot',
    excerpt: 'Strike the perfect balance between professional authority and approachable advisor.',
    content: `<p>Choosing the right attire is about matching the expectations of your target demographic.</p>`,
    category: 'tip',
    author: 'Style Consultant',
    date: '2024-06-13',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min read',
    tags: ['style', 'insurance']
  },
  {
    id: 'insurance-7',
    title: 'Digital Transformation in the Insurance Sector',
    excerpt: 'How AI and automation are changing the way insurance professionals interact with clients.',
    content: `<p>The future of insurance is digital, and that includes the way you present yourself to the market.</p>`,
    category: 'news',
    author: 'InsurTech Weekly',
    date: '2024-06-14',
    imageUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min read',
    tags: ['insurtech', 'digital-transformation']
  },

  // --- FINANCE & MORTGAGE (High CPC) ---
  {
    id: 'finance-1',
    title: 'The Importance of a Professional Image for Mortgage Loan Officers',
    excerpt: 'Buying a home is the biggest investment most people make. Your headshot should inspire confidence in your expertise.',
    content: `
      <p>Mortgage loan officers are more than just paper-pushers; they are financial guides through one of life's most significant milestones. In a digital-first world, your headshot is often your first handshake.</p>
      <h3>Why Visual Trust Matters in Lending</h3>
      <p>When a borrower chooses a loan officer, they are looking for someone who is organized, knowledgeable, and reliable. A professional portrait conveys these qualities instantly.</p>
      <h3>Tips for a Winning Loan Officer Headshot</h3>
      <ul>
        <li><strong>Look the Part:</strong> Business casual or formal attire depending on your market.</li>
        <li><strong>The "Advisor" Look:</strong> Aim for an expression that is helpful and confident.</li>
        <li><strong>Modern Settings:</strong> A clean, modern office background suggests you are up-to-date with the latest lending technologies.</li>
      </ul>
    `,
    category: 'tip',
    author: 'Linda Myers',
    date: '2024-06-15',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['mortgage', 'finance', 'loan-officer']
  },
  {
    id: 'finance-2',
    title: 'Personal Branding for Financial Advisors',
    excerpt: 'Wealth management is built on long-term relationships. Start that relationship with a strong visual presence.',
    content: `<p>Your headshot should convey wisdom, stability, and a focus on the client's future.</p>`,
    category: 'tip',
    author: 'Michael Gold',
    date: '2024-06-16',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    tags: ['wealth-management', 'finance']
  },
  {
    id: 'finance-3',
    title: 'Hiring: Senior Wealth Manager - Private Banking',
    excerpt: 'Join our elite financial services firm. We seek advisors with a proven track record and impeccable professional standing.',
    content: `<p>We are expanding our private banking team and looking for a Senior Wealth Manager.</p>`,
    category: 'job',
    author: 'Elite Wealth',
    date: '2024-06-17',
    imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=800&q=80',
    readTime: 'Job Opening',
    tags: ['hiring', 'banking', 'finance']
  },
  {
    id: 'finance-4',
    title: 'How to Use Your Headshot to Boost Your LinkedIn Social Selling Index (SSI)',
    excerpt: 'Financial professionals who optimize their profiles see higher engagement and more inbound leads.',
    content: `<p>A complete profile, starting with a professional photo, is the foundation of social selling in finance.</p>`,
    category: 'tip',
    author: 'SSI Expert',
    date: '2024-06-18',
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['linkedin', 'social-selling', 'finance']
  },
  {
    id: 'finance-5',
    title: 'The Psychology of Money and Visual Trust',
    excerpt: 'Why we trust people who look professional with our finances. The science behind the first impression.',
    content: `<p>Our brains make split-second judgments about trustworthiness based on visual cues.</p>`,
    category: 'news',
    author: 'Dr. Anna Klein',
    date: '2024-06-19',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e10?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min read',
    tags: ['psychology', 'finance']
  },
  {
    id: 'finance-6',
    title: 'Mortgage Marketing: Standing Out in a High-Rate Environment',
    excerpt: 'When the market is tough, your personal brand is your competitive advantage.',
    content: `<p>In a competitive market, clients choose the person, not just the rate.</p>`,
    category: 'tip',
    author: 'Marketing Guru',
    date: '2024-06-20',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['marketing', 'mortgage']
  },
  {
    id: 'finance-7',
    title: 'FinTech Trends: The Rise of the Digital Financial Advisor',
    excerpt: 'How technology is enabling a more personalized and visual approach to financial planning.',
    content: `<p>The digital advisor needs a digital brand that is as polished as their physical presence.</p>`,
    category: 'news',
    author: 'FinTech Daily',
    date: '2024-06-21',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    tags: ['fintech', 'trends']
  },

  // --- REAL ESTATE (High CPC) ---
  {
    id: 'realestate-1',
    title: 'Why Real Estate Agents Need a Fresh Headshot Every Year',
    excerpt: 'Your clients expect to meet the person they see on the yard sign. Keep your brand current and authentic.',
    content: `
      <p>In real estate, you are the face of the business. Your headshot appears on yard signs, business cards, Zillow profiles, and social media. If your photo is ten years old, you're starting every client relationship with a trust gap.</p>
      <h3>The Importance of Currency</h3>
      <p>When a client meets you at an open house, they should recognize you immediately from your marketing. A current photo shows you are active and successful in the current market.</p>
      <h3>Branding for Your Niche</h3>
      <p>If you specialize in urban condos, a city backdrop works well. If you sell luxury estates, a more formal studio or high-end interior setting is appropriate.</p>
    `,
    category: 'tip',
    author: 'Kelly Holmes',
    date: '2024-06-22',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min read',
    tags: ['real-estate', 'branding', 'authenticity']
  },
  {
    id: 'realestate-2',
    title: 'Luxury Real Estate Branding: The Power of the High-End Portrait',
    excerpt: 'Selling luxury homes requires a luxury personal brand. Learn how to elevate your visual identity.',
    content: `<p>High-net-worth clients expect a level of sophistication that should be reflected in your marketing materials.</p>`,
    category: 'tip',
    author: 'Julian Pierce',
    date: '2024-06-23',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    tags: ['luxury', 'real-estate']
  },
  {
    id: 'realestate-3',
    title: 'Hiring: Real Estate Sales Associate - Luxury Division',
    excerpt: 'Join our award-winning brokerage. We provide the tools and branding support to help you succeed.',
    content: `<p>We are looking for ambitious sales associates to join our luxury real estate team.</p>`,
    category: 'job',
    author: 'Prime Realty',
    date: '2024-06-24',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    readTime: 'Job Opening',
    tags: ['hiring', 'real-estate']
  },
  {
    id: 'realestate-4',
    title: 'How to Use Your Headshot in Your Real Estate Marketing Funnel',
    excerpt: 'From Facebook ads to closing gifts, your image should be a consistent thread in your client journey.',
    content: `<p>Consistency builds recognition, and recognition builds trust.</p>`,
    category: 'tip',
    author: 'Funnel Expert',
    date: '2024-06-25',
    imageUrl: 'https://images.unsplash.com/photo-1460472178825-e5240623abe5?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['marketing', 'funnel', 'real-estate']
  },
  {
    id: 'realestate-5',
    title: 'The Impact of Professional Photography on Home Sale Prices',
    excerpt: 'It\'s not just about your headshot; professional listing photos are essential for maximizing sale price.',
    content: `<p>Homes with professional photography sell faster and for more money. The same logic applies to your personal brand.</p>`,
    category: 'news',
    author: 'Real Estate Data',
    date: '2024-06-26',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    tags: ['photography', 'real-estate']
  },
  {
    id: 'realestate-6',
    title: 'Choosing the Best Outdoor Location for Your Agent Headshot',
    excerpt: 'Natural light and local landmarks can help you connect with your community.',
    content: `<p>An outdoor headshot can make you look more approachable and connected to the neighborhoods you serve.</p>`,
    category: 'tip',
    author: 'Local Agent',
    date: '2024-06-27',
    imageUrl: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min read',
    tags: ['location', 'real-estate']
  },
  {
    id: 'realestate-7',
    title: 'PropTech Trends: Virtual Tours and AI Staging',
    excerpt: 'How technology is revolutionizing the way we buy and sell homes.',
    content: `<p>AI is not just for headshots; it's transforming every aspect of the real estate industry.</p>`,
    category: 'news',
    author: 'PropTech Weekly',
    date: '2024-06-28',
    imageUrl: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min read',
    tags: ['proptech', 'trends']
  },

  // --- TECH & AI (High CPC / High Intent) ---
  {
    id: 'tech-1',
    title: 'The Developer\'s Guide to a Professional LinkedIn Profile',
    excerpt: 'You might live in code, but your career lives on LinkedIn. Learn how to balance tech-casual with professional.',
    content: `<p>Software engineers often overlook their personal brand. A polished profile can lead to better opportunities and higher salaries.</p>`,
    category: 'tip',
    author: 'Alex Rivera',
    date: '2024-06-29',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['tech', 'developer', 'linkedin']
  },
  {
    id: 'tech-2',
    title: 'AI in Recruitment: How to Beat the Bots',
    excerpt: 'Learn how Applicant Tracking Systems (ATS) work and how to optimize your resume and profile for AI screening.',
    content: `<p>Recruitment is increasingly automated. Understanding the algorithms is key to getting your foot in the door.</p>`,
    category: 'tip',
    author: 'HR Tech Expert',
    date: '2024-06-30',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    tags: ['ai', 'recruitment', 'ats']
  },
  {
    id: 'tech-3',
    title: 'Hiring: Senior AI Researcher - Generative Models',
    excerpt: 'Join our cutting-edge AI lab. We are pushing the boundaries of what\'s possible with image and text generation.',
    content: `<p>We are looking for a brilliant researcher to join our generative AI team.</p>`,
    category: 'job',
    author: 'Future AI',
    date: '2024-07-01',
    imageUrl: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80',
    readTime: 'Job Opening',
    tags: ['hiring', 'ai', 'research']
  },
  {
    id: 'tech-4',
    title: 'The Future of Remote Work: Building a Global Career',
    excerpt: 'How to network and land high-paying roles from anywhere in the world.',
    content: `<p>Remote work is here to stay. Your digital presence is your only presence in a global market.</p>`,
    category: 'tip',
    author: 'Digital Nomad',
    date: '2024-07-02',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['remote-work', 'career']
  },
  {
    id: 'tech-5',
    title: 'Cybersecurity for Professionals: Protecting Your Digital Identity',
    excerpt: 'As your online profile becomes more valuable, it also becomes a target. Learn how to stay secure.',
    content: `<p>Protecting your personal data and professional accounts is a critical career skill.</p>`,
    category: 'tip',
    author: 'Security Pro',
    date: '2024-07-03',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    tags: ['cybersecurity', 'privacy']
  },
  {
    id: 'tech-6',
    title: 'How to Showcase Your Tech Projects on LinkedIn',
    excerpt: 'Go beyond the bullet points. Use featured sections and media to bring your work to life.',
    content: `<p>Visual evidence of your skills is more powerful than a list of keywords.</p>`,
    category: 'tip',
    author: 'Portfolio Coach',
    date: '2024-07-04',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['portfolio', 'tech']
  },
  {
    id: 'tech-7',
    title: 'The Impact of AI on the Creative Industries',
    excerpt: 'Is AI a threat or a tool for designers and photographers? We explore the evolving landscape.',
    content: `<p>AI is a powerful collaborator that is redefining the creative process.</p>`,
    category: 'news',
    author: 'Creative Tech',
    date: '2024-07-05',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min read',
    tags: ['ai', 'creative', 'design']
  },

  // --- CAREER & HR (High Intent) ---
  {
    id: 'career-1',
    title: 'Mastering the Executive Interview: Beyond the Resume',
    excerpt: 'High-level roles require a different approach. Learn how to project leadership and strategic vision.',
    content: `<p>Executive interviews are about fit, vision, and leadership style. Your presence is as important as your past.</p>`,
    category: 'tip',
    author: 'Executive Coach',
    date: '2024-07-06',
    imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    tags: ['executive', 'interview', 'career']
  },
  {
    id: 'career-2',
    title: 'How to Negotiate Your Salary in 2024',
    excerpt: 'Don\'t leave money on the table. Use data and proven techniques to get the compensation you deserve.',
    content: `<p>Salary negotiation is a skill that can add hundreds of thousands to your lifetime earnings.</p>`,
    category: 'tip',
    author: 'Career Strategist',
    date: '2024-07-07',
    imageUrl: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min read',
    tags: ['salary', 'negotiation', 'career']
  },
  {
    id: 'career-3',
    title: 'Hiring: Director of Human Resources',
    excerpt: 'Lead our people strategy and culture. We are looking for a visionary leader to scale our organization.',
    content: `<p>We are seeking a seasoned HR professional to join our executive team.</p>`,
    category: 'job',
    author: 'Growth Corp',
    date: '2024-07-08',
    imageUrl: 'https://images.unsplash.com/photo-1522071823991-b9676c3e8f4d?auto=format&fit=crop&w=800&q=80',
    readTime: 'Job Opening',
    tags: ['hiring', 'hr', 'leadership']
  },
  {
    id: 'career-4',
    title: 'The Power of Networking in a Digital World',
    excerpt: 'How to build meaningful professional relationships without leaving your desk.',
    content: `<p>Networking is about giving value and building trust over time.</p>`,
    category: 'tip',
    author: 'Networking Pro',
    date: '2024-07-09',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['networking', 'career']
  },
  {
    id: 'career-5',
    title: 'Reskilling for the AI Era: Top Skills to Learn Now',
    excerpt: 'Stay relevant in a rapidly changing job market. Focus on the skills that AI can\'t easily replicate.',
    content: `<p>Adaptability and continuous learning are the most important career survival skills.</p>`,
    category: 'tip',
    author: 'Learning Expert',
    date: '2024-07-10',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    tags: ['reskilling', 'ai', 'career']
  },
  {
    id: 'career-6',
    title: 'How to Write a Resume That Gets Past the ATS',
    excerpt: 'Optimization tips to ensure your resume actually gets seen by a human recruiter.',
    content: `<p>Your resume needs to be readable by both machines and people.</p>`,
    category: 'tip',
    author: 'Resume Writer',
    date: '2024-07-11',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['resume', 'ats', 'career']
  },
  {
    id: 'career-7',
    title: 'The Rise of the Fractional Executive',
    excerpt: 'How experienced leaders are building diverse portfolios of high-impact roles.',
    content: `<p>Fractional leadership offers flexibility for executives and high-level expertise for startups.</p>`,
    category: 'news',
    author: 'Business Trends',
    date: '2024-07-12',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    tags: ['fractional', 'leadership', 'trends']
  },

  // --- BRANDING & MARKETING (High Intent) ---
  {
    id: 'branding-1',
    title: 'Personal Branding for Solopreneurs: You Are the Product',
    excerpt: 'When you are the face of your business, your personal brand is your most important marketing asset.',
    content: `<p>Solopreneurs need a brand that is authentic, consistent, and professional.</p>`,
    category: 'tip',
    author: 'Brand Strategist',
    date: '2024-07-13',
    imageUrl: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['branding', 'solopreneur']
  },
  {
    id: 'branding-2',
    title: 'How to Create a Consistent Visual Brand Across Social Media',
    excerpt: 'From LinkedIn to Instagram, your image should be instantly recognizable.',
    content: `<p>Consistency builds brand equity and makes you more memorable to your audience.</p>`,
    category: 'tip',
    author: 'Social Media Pro',
    date: '2024-07-14',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min read',
    tags: ['social-media', 'branding']
  },
  {
    id: 'branding-3',
    title: 'The Power of Video in Personal Branding',
    excerpt: 'Why you should add video content to your professional profile and how to get started.',
    content: `<p>Video allows your personality to shine through and builds a deeper connection with your audience.</p>`,
    category: 'tip',
    author: 'Video Expert',
    date: '2024-07-15',
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    tags: ['video', 'branding']
  },
  {
    id: 'branding-4',
    title: 'Content Strategy for Thought Leaders',
    excerpt: 'How to share your expertise and build authority in your niche.',
    content: `<p>Thought leadership is about providing unique insights and solving problems for your audience.</p>`,
    category: 'tip',
    author: 'Content Strategist',
    date: '2024-07-16',
    imageUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min read',
    tags: ['content-strategy', 'thought-leadership']
  },
  {
    id: 'branding-5',
    title: 'The ROI of Personal Branding: Measuring Your Impact',
    excerpt: 'How to track the success of your personal branding efforts and adjust your strategy.',
    content: `<p>Personal branding is an investment that should yield measurable results.</p>`,
    category: 'news',
    author: 'Data Analyst',
    date: '2024-07-17',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['roi', 'branding']
  },
  {
    id: 'branding-6',
    title: 'How to Handle Negative Feedback on Your Professional Profile',
    excerpt: 'Turn challenges into opportunities by responding with professionalism and grace.',
    content: `<p>How you handle criticism is a powerful indicator of your character and professional maturity.</p>`,
    category: 'tip',
    author: 'PR Specialist',
    date: '2024-07-18',
    imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['pr', 'branding']
  },
  {
    id: 'branding-7',
    title: 'The Future of Personal Branding: AI and Personalization',
    excerpt: 'How technology is enabling more sophisticated and targeted personal marketing.',
    content: `<p>The next wave of personal branding will be driven by data and AI-powered insights.</p>`,
    category: 'news',
    author: 'Future Trends',
    date: '2024-07-19',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    tags: ['ai', 'branding', 'future']
  },
  {
    id: 'branding-8',
    title: 'Building a Brand as a Freelance Consultant',
    excerpt: 'How to stand out in the gig economy and attract high-value clients.',
    content: `<p>Consultants need a brand that highlights their specific expertise and successful track record.</p>`,
    category: 'tip',
    author: 'Consulting Pro',
    date: '2024-07-20',
    imageUrl: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['freelance', 'consulting', 'branding']
  }
];


// Helper to prevent hanging promises
const withTimeout = <T>(promise: Promise<T>, ms: number = 2000): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
    ]);
};

// Circuit breaker state: if Firebase fails once, we stop trying for the session
let isBackendAvailable = true;

export const getArticles = async (): Promise<Article[]> => {
  if (!db || !isBackendAvailable) return MOCK_ARTICLES;

  try {
    const q = query(collection(db, "articles"), orderBy("date", "desc"), limit(20));
    // Use timeout to prevent infinite loading if Firebase connection hangs
    const querySnapshot = await withTimeout<QuerySnapshot<DocumentData>>(getDocs(q));
    
    if (querySnapshot.empty) {
      return MOCK_ARTICLES;
    }

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Article));
  } catch (error) {
    console.warn("Using mock articles due to Firestore error/timeout:", error);
    isBackendAvailable = false; // Disable backend for this session
    return MOCK_ARTICLES;
  }
};

export const getArticleById = async (id: string): Promise<Article | undefined> => {
  // First check mock data for speed/fallback
  const mock = MOCK_ARTICLES.find(a => a.id === id);
  if (mock) return mock;

  if (!db || !isBackendAvailable) return undefined;

  try {
    const docRef = doc(db, "articles", id);
    const docSnap = await withTimeout<DocumentSnapshot<DocumentData>>(getDoc(docRef));

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Article;
    }
  } catch (error) {
    console.error("Error fetching article", error);
    isBackendAvailable = false;
  }
  
  return undefined;
};

export const saveArticle = async (article: Article): Promise<void> => {
  if (!db) throw new Error("Database not initialized");
  if (!isBackendAvailable) throw new Error("Backend unavailable");

  try {
    const docRef = doc(db, "articles", article.id);
    // This will overwrite if exists, or create if new
    await withTimeout(setDoc(docRef, {
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      author: article.author,
      date: article.date,
      imageUrl: article.imageUrl,
      readTime: article.readTime,
      tags: article.tags || []
    }, { merge: true }));
  } catch (error) {
    isBackendAvailable = false;
    throw new Error("Failed to save: Backend unavailable");
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  if (!db) throw new Error("Database not initialized");
  if (!isBackendAvailable) throw new Error("Backend unavailable");

  try {
    await withTimeout(deleteDoc(doc(db, "articles", id)));
  } catch (error) {
    isBackendAvailable = false;
    throw new Error("Failed to delete: Backend unavailable");
  }
};
