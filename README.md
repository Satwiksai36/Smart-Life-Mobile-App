<div align="center">

<img src="public/logo-icon.png" alt="SmartLife Logo" width="100" height="100" />

# SmartLife
### AI-Powered Productivity & Personal Management Ecosystem

[![Built with React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-Ready-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)

> **SmartLife** is a premium mobile-first productivity application that combines task management, habit tracking, expense monitoring, smart reminders, AI coaching, and journal notes — all in one beautifully designed ecosystem.

</div>

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🏠 **Home Dashboard** | Unified view — AI Coach banner, velocity gauge, quick actions, live summaries |
| ⏰ **Smart Reminders** | Category-based alarms with recurrence, priority levels & push notifications |
| ✅ **Task Manager** | Kanban board (To Do → In Progress → Review → Completed) with subtasks |
| 💰 **Expense Tracker** | Log costs manually or via AI OCR receipt scanner with INR budget limits |
| 🔥 **Habit Tracker** | Daily/weekly habits with streak counters, heatmap calendar & analytics |
| 📓 **Journal & Notes** | Color-coded notes with voice note simulation and image attachments |
| 📅 **Calendar View** | Full month calendar with agenda view and event overlays |
| 🤖 **Aura AI Coach** | In-app AI chat with smart suggestions, budget tips & schedule planning |
| 📊 **Analytics** | Aggregate lifecycle score, performance bar charts & weekly summaries |
| 👤 **Profile** | Real photo upload, editable bio, account stats & settings |
| 🔔 **Notifications** | Centralized notification center with read/unread states |

---

## 🏗️ Architecture

```
stitch_smartlife_productivity_ecosystem/
├── public/
│   ├── logo-icon.png              # App icon (favicon + splash)
│   └── logo-wordmark.png          # Horizontal brand wordmark
├── src/
│   ├── context/
│   │   ├── AppContext.tsx          # Global state (localStorage persistence)
│   │   └── NavigationContext.tsx   # Stack-based custom router
│   ├── screens/
│   │   ├── Auth/                  # Login · SignUp · ForgotPassword
│   │   ├── Dashboard/             # HomeDashboard
│   │   ├── Reminders/             # Dashboard · Create · Details · Categories
│   │   ├── Tasks/                 # TaskManager · CreateTask · TaskDetails
│   │   ├── Expenses/              # Dashboard · Scanner · OCR · Manual · Budget · Analytics
│   │   ├── Habits/                # Dashboard · Create · Details · Analytics
│   │   ├── Notes/                 # NotesDashboard · NoteEditor
│   │   ├── Calendar/              # CalendarView
│   │   ├── AI/                    # AIAssistantChat (Aura)
│   │   ├── Analytics/             # AnalyticsDashboard
│   │   ├── Profile/               # UserProfile · Settings
│   │   └── OCR/                   # DocumentScanner
│   ├── services/
│   │   └── aiService.ts           # AI response engine (swap for OpenAI/Gemini)
│   ├── App.tsx                    # Phone frame shell + bottom nav
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Glassmorphism design system tokens
├── index.html                     # SEO meta + favicon
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Satwiksai36/stitch_smartlife_productivity_ecosystem.git

# 2. Navigate into the project folder
cd stitch_smartlife_productivity_ecosystem

# 3. Install all dependencies
npm install

# 4. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Production Build

```bash
npm run build       # Compile & bundle
npm run preview     # Preview the production build locally
```

---

## 🔌 Backend Integration Guide

The SmartLife frontend is **fully structured** and ready to connect to real backends. Every feature has clear swap-out points.

### Firebase Setup

```typescript
// src/config/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

export const app      = initializeApp(firebaseConfig);
export const auth     = getAuth(app);
export const storage  = getStorage(app);
export const messaging = getMessaging(app);
```

### Supabase / PostgreSQL Setup

```env
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Integration Status

| Service | Status | Swap Point |
|---------|--------|------------|
| 🔥 **Firebase Auth** | 🟡 Ready to connect | `login()` / `signUp()` in `AppContext.tsx` |
| 🗄️ **Supabase / PostgreSQL** | 🟡 Ready to connect | Replace `localStorage` calls with Supabase SDK |
| 📷 **Firebase Storage** | 🟡 Ready to connect | `updateUser({ photo })` in `UserProfile.tsx` |
| 🔔 **Firebase Cloud Messaging** | 🟡 Ready to connect | `addNotification()` wired throughout app |
| 🤖 **OpenAI / Google Gemini** | 🟡 Ready to connect | `aiService.ts` — swap mock responses with API |
| 🔍 **Google ML Kit OCR** | 🟡 Ready to connect | `simulatedOcrScan()` in `AppContext.tsx` |
| 📱 **Flutter Mobile App** | 🟡 Ready to connect | Flutter consumes same Supabase/Firebase backend |

---

## 🎨 Design System

SmartLife uses a custom **Glassmorphism** visual language built on top of Tailwind CSS.

```css
/* Core Design Tokens (index.css) */
--color-primary:     #3525cd;   /* Indigo */
--color-accent:      #06b6d4;   /* Cyan */
--color-background:  #f8f9ff;   /* Soft White */
--color-dark-bg:     #0b1220;   /* Deep Navy */

/* Glass surface */
background: rgba(255, 255, 255, 0.55);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

**Key utility classes:**

| Class | Effect |
|-------|--------|
| `.glass-card` | Frosted glass card with glow border |
| `.aura-glow-border` | Neon pulsing AI indicator |
| `.bg-mesh` | Radial gradient ambient mesh background |
| `.scrollbar-hide` | Hidden scrollbars across all platforms |
| `.glass-input` | Translucent form input fields |

**Fonts:** [Inter](https://fonts.google.com/specimen/Inter) — Google Fonts  
**Icons:** [Material Symbols Outlined](https://fonts.google.com/icons) — Variable font

---

## 📦 Data Persistence Keys

All data is versioned in `localStorage`. Bump `DATA_VERSION` in `AppContext.tsx` to auto-flush stale data on next load.

| localStorage Key | Content |
|-----------------|---------|
| `sm_user` | User profile (name, email, photo as base64 dataURL) |
| `sm_reminders` | `Reminder[]` — title, category, date, recurrence |
| `sm_tasks` | `Task[]` — kanban status, subtasks, attachments |
| `sm_expenses` | `Expense[]` — merchant, amount, items, category |
| `sm_budgets` | `BudgetLimits` — per-category limits in INR |
| `sm_habits` | `Habit[]` — frequency, history heatmap, streaks |
| `sm_notes` | `Note[]` — content, color theme, pin state |
| `sm_chatHistory` | `Message[]` — Aura AI conversation log |
| `sm_notifications` | `AppNotification[]` — in-app alert feed |
| `sm_settings` | Theme, language, notification prefs |
| `sm_data_version` | Version guard — current: `sm_v4_clean` |

---

## 🛠️ Full Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **UI Framework** | React | 18 |
| **Language** | TypeScript | 5 |
| **Build Tool** | Vite | 5 |
| **Styling** | Tailwind CSS + Custom CSS | 3 |
| **State Management** | React Context API | — |
| **Persistence** | Browser localStorage | — |
| **Icons** | Google Material Symbols | Variable |
| **Fonts** | Google Fonts — Inter | — |
| **Routing** | Custom NavigationContext (stack) | — |
| **Photo Upload** | FileReader API → base64 | Native |
| **AI Engine** | Simulated → OpenAI/Gemini ready | — |
| **OCR** | Simulated → Google ML Kit ready | — |

---

## 🗺️ Roadmap

- [ ] 🔥 Connect Firebase Authentication (email/password + Google OAuth)
- [ ] 🗄️ Migrate localStorage → Supabase PostgreSQL  
- [ ] 📷 Swap OCR simulation with Google ML Kit Vision
- [ ] 🤖 Connect Aura AI to OpenAI GPT-4o or Google Gemini 1.5
- [ ] 📱 Build Flutter mobile app consuming same Supabase backend
- [ ] 🔔 Enable Firebase Cloud Messaging for push notifications
- [ ] ☁️ Profile photos → Firebase Storage URLs (remove base64)
- [ ] 📊 Weekly email digest reports via SendGrid/Resend
- [ ] 🌐 PWA support with offline-first caching
- [ ] 🔒 Biometric authentication (Face ID / Fingerprint via Flutter)

---

## 🤝 Contributing

```bash
# 1. Fork and clone the repo
git clone https://github.com/Satwiksai36/stitch_smartlife_productivity_ecosystem.git

# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git add .
git commit -m "feat: describe your change clearly"

# 4. Push and open a Pull Request
git push origin feature/your-feature-name
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Made with ❤️ by **Satwik Sai**

**SmartLife — Intelligent Living, Simplified.**

*React · TypeScript · Tailwind · Firebase · Supabase*

</div>
