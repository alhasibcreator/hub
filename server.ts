import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("cse_hub.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT NOT NULL,
    category TEXT DEFAULT 'General'
  );

  CREATE TABLE IF NOT EXISTS routines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day TEXT NOT NULL,
    subject TEXT NOT NULL,
    time TEXT NOT NULL,
    room TEXT NOT NULL,
    teacher TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    course_code TEXT NOT NULL,
    link TEXT NOT NULL,
    description TEXT
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/notices", (req, res) => {
    const notices = db.prepare("SELECT * FROM notices ORDER BY date DESC").all();
    res.json(notices);
  });

  app.post("/api/notices", (req, res) => {
    const { title, content, date, category } = req.body;
    const info = db.prepare("INSERT INTO notices (title, content, date, category) VALUES (?, ?, ?, ?)").run(title, content, date, category);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/notices/:id", (req, res) => {
    db.prepare("DELETE FROM notices WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/routines", (req, res) => {
    const routines = db.prepare("SELECT * FROM routines").all();
    res.json(routines);
  });

  app.post("/api/routines", (req, res) => {
    const { day, subject, time, room, teacher } = req.body;
    const info = db.prepare("INSERT INTO routines (day, subject, time, room, teacher) VALUES (?, ?, ?, ?, ?)").run(day, subject, time, room, teacher);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/routines/:id", (req, res) => {
    db.prepare("DELETE FROM routines WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/notes", (req, res) => {
    const notes = db.prepare("SELECT * FROM notes").all();
    res.json(notes);
  });

  app.post("/api/notes", (req, res) => {
    const { title, course_code, link, description } = req.body;
    const info = db.prepare("INSERT INTO notes (title, course_code, link, description) VALUES (?, ?, ?, ?)").run(title, course_code, link, description);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/notes/:id", (req, res) => {
    db.prepare("DELETE FROM notes WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // AI Assistant Endpoint
  app.post("/api/ai/chat", async (req, res) => {
    const { message } = req.body;
    
    // Fetch context from DB
    const notices = db.prepare("SELECT * FROM notices").all();
    const routines = db.prepare("SELECT * FROM routines").all();
    const notes = db.prepare("SELECT * FROM notes").all();

    const context = `
      You are the CSE Department AI Assistant for our University.
      Here is the current information available in the department:
      
      NOTICES:
      ${JSON.stringify(notices)}
      
      CLASS ROUTINES:
      ${JSON.stringify(routines)}
      
      STUDY NOTES:
      ${JSON.stringify(notes)}
      
      Answer the student's question based on this data. If the information is not available, say you don't know but offer to help with general CSE topics.
    `;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: message,
        config: {
          systemInstruction: context
        }
      });
      res.json({ text: response.text });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
