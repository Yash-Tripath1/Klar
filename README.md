# Klar

> **German, made clear.**
>
> A focused learning space for A1 and A2 German.

`A1 + A2` · `50 lessons` · `Pronunciation` · `Review` · `Conversation practice`

---

## The idea

Klar is built for the first stage of learning German: short lessons, useful phrases, calm progress, and room to make mistakes.

No streak pressure. No crowded dashboard. One clear next step.

---

## Inside Klar

| Space | Purpose |
| --- | --- |
| **A1** | 30 lessons for first conversations, daily life, and core grammar |
| **A2** | 20 lessons for routines, stories, practical situations, and opinions |
| **Alphabet** | German letters, special characters, examples, and pronunciation support |
| **Pronounce** | Type any German word or phrase and hear it spoken aloud |
| **Review** | A personal vocabulary deck built from opened lessons |
| **Klar Coach** | Short, level-aware German conversation practice through Groq |

---

## Design language

Warm paper. Quiet structure. Small colour signals.

`der` · cobalt  
`die` · coral  
`das` · green

---

## Project structure

```text
klar/
├── api/
│   └── chat.js          # Secure Groq serverless function
├── index.html           # Application shell
├── style.css            # Responsive interface and motion
├── app.js               # Onboarding, routes, lessons, review, TTS, coach UI
├── data.js              # A1 course content
├── a2-data.js           # A2 course content
├── favicon.ico          # Browser favicon
├── site.webmanifest     # Installable app metadata
└── vercel.json          # Vercel configuration
```

---

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Use the repository root as the Vercel **Root Directory**.
4. Add these environment variables in **Project Settings → Environment Variables**:

```env
GROQ_API_KEY=gsk_your_key
GROQ_MODEL=llama-3.1-8b-instant
```

5. Redeploy.

The browser calls `/api/chat`. The Groq key is read only by `api/chat.js` on the server.

---

## Local preview

The learning interface is static and can be opened with any static server.

```bash
python -m http.server 8000
```

For Klar Coach, deploy to Vercel or run an equivalent server-side `/api/chat` route. Never expose `GROQ_API_KEY` in frontend code.

---

## Next

- Native-speaker audio for course phrases
- Supabase authentication and synced progress
- Spaced repetition for vocabulary review
- Learner feedback from real German beginners

---

Built with curiosity, structure, and a growing collection of German words.
