import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";

const RECEIVED_POSTS_FILE = path.resolve(process.cwd(), "received_posts.json");

// Helper to read received posts
const readReceivedPosts = () => {
  try {
    if (fs.existsSync(RECEIVED_POSTS_FILE)) {
      const data = fs.readFileSync(RECEIVED_POSTS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading received posts:", error);
  }
  return [];
};

// Helper to save received posts
const saveReceivedPosts = (posts: any[]) => {
  try {
    fs.writeFileSync(RECEIVED_POSTS_FILE, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error("Error saving received posts:", error);
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/config", (_req, res) => {
    const key = process.env.API_KEY || process.env.GEMINI_API_KEY;
    console.log("Config request received. Key present:", !!key);
    res.json({
      geminiApiKey: key,
    });
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // API to receive blog posts from another app
  app.post("/api/blog/receive", (req, res) => {
    const { title, content, excerpt, category, author, imageUrl, tags, secret } = req.body;
    
    // Simple security check
    const BLOG_SECRET = process.env.BLOG_POST_SECRET || "AminAdmin";
    if (secret !== BLOG_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const newPost = {
      id: `received-${Date.now()}`,
      title,
      content,
      excerpt: excerpt || content.substring(0, 150) + "...",
      category: category || "news",
      author: author || "External App",
      date: new Date().toISOString().split("T")[0],
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
      readTime: "3 min read",
      tags: tags || []
    };

    const posts = readReceivedPosts();
    posts.unshift(newPost);
    saveReceivedPosts(posts);

    console.log("Received new blog post:", title);
    res.status(201).json({ message: "Post received successfully", post: newPost });
  });

  // API to get received blog posts
  app.get("/api/blog/received", (_req, res) => {
    const posts = readReceivedPosts();
    res.json(posts);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
