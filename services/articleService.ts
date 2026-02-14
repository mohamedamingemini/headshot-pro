
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
  {
    id: 'tip-1',
    title: '5 Tips for the Perfect LinkedIn Headshot',
    excerpt: 'Your profile picture is your first digital impression. Learn how to optimize lighting, attire, and expression.',
    content: `
      <p>Your LinkedIn profile picture is often the first thing recruiters and networking connections see. A professional headshot builds trust and credibility instantly.</p>
      <h3>1. Dress for Your Industry</h3>
      <p>Wear what you would wear to a job interview in your field. For corporate roles, a suit or blazer is appropriate. For creative industries, you can be a bit more casual.</p>
      <h3>2. Smile Naturally</h3>
      <p>A genuine smile makes you look approachable and friendly. Avoid forced expressions.</p>
      <h3>3. Simple Backgrounds Work Best</h3>
      <p>Don't let the background distract from your face. A blurred office or a solid color is ideal.</p>
    `,
    category: 'tip',
    author: 'Sarah Jenkins',
    date: '2024-05-15',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min read',
    tags: ['linkedin', 'career', 'photography', 'professional']
  },
  {
    id: 'job-1',
    title: 'Hiring: Senior Frontend Engineer (Remote)',
    excerpt: 'We are looking for a React expert to join our fast-growing AI startup. Competitive salary and equity.',
    content: `
      <p><strong>Role:</strong> Senior Frontend Engineer</p>
      <p><strong>Location:</strong> Remote (Global)</p>
      <p><strong>Salary:</strong> $120k - $160k + Equity</p>
      <br/>
      <p>We are building the next generation of AI tools for professionals. We are looking for an engineer with deep experience in React, TypeScript, and Canvas manipulation.</p>
      <h3>Responsibilities</h3>
      <ul>
        <li>Build performant UI components</li>
        <li>Integrate with Generative AI APIs</li>
        <li>Optimize client-side image processing</li>
      </ul>
      <br/>
      <p>Apply by sending your resume to jobs@example.com</p>
    `,
    category: 'job',
    author: 'Recruiting Team',
    date: '2024-05-18',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
    readTime: 'Job Opening',
    tags: ['hiring', 'remote', 'react', 'engineering']
  },
  {
    id: 'tip-2',
    title: 'Why AI Headshots are the Future',
    excerpt: 'Save time and money without sacrificing quality. See how AI is democratizing professional photography.',
    content: `
      <p>Traditional photography studios can cost hundreds of dollars and take hours of your time. AI technology has reached a point where it can generate photorealistic results from your casual selfies.</p>
      <p>With tools like ProHeadshot AI, you can generate hundreds of variations in different styles (Corporate, Outdoor, Studio) in minutes.</p>
    `,
    category: 'news',
    author: 'Tech Daily',
    date: '2024-05-10',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    readTime: '2 min read',
    tags: ['ai', 'technology', 'future', 'cost-saving']
  },
  {
    id: 'job-2',
    title: 'Hiring: Marketing Manager',
    excerpt: 'Lead our growth strategy and brand narrative. Experience in SaaS required.',
    content: `
      <p><strong>Role:</strong> Marketing Manager</p>
      <p>We need a visionary marketer to help us tell our story. You will handle social media, content strategy, and paid acquisition.</p>
    `,
    category: 'job',
    author: 'HR Dept',
    date: '2024-05-19',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    readTime: 'Job Opening',
    tags: ['hiring', 'marketing', 'growth', 'saas']
  },
  {
    id: 'tip-3',
    title: 'Color Psychology in Headshots',
    excerpt: 'What does your shirt color say about you? Blue implies trust, red implies power.',
    content: `
      <p>The colors you wear in your headshot communicate subconscious messages.</p>
      <ul>
        <li><strong>Blue:</strong> Trust, stability, calm. Great for finance and tech.</li>
        <li><strong>Red:</strong> Energy, passion, power. Good for leadership roles.</li>
        <li><strong>Black:</strong> Sophistication, authority. Classic for executives.</li>
      </ul>
    `,
    category: 'tip',
    author: 'Design Team',
    date: '2024-05-12',
    imageUrl: 'https://images.unsplash.com/photo-1507537297725-24a1c434c175?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    tags: ['psychology', 'style', 'tips', 'branding']
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
