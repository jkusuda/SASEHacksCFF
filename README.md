<p align="center">
  <img src="transparentsubscriptos.png" alt="Subscriptos Logo" width="300">
</p>

# Subscriptos | AI-Powered Subscription Protection

### Built With

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-orange)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-darkgreen)
![Stripe](https://img.shields.io/badge/Stripe-Issuing-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS_4-cyan)
![Chrome](https://img.shields.io/badge/Chrome-Extension_v3-yellow)

---

## Description

Subscriptos protects consumers from predatory subscription services. Paste in any Terms of Service and our AI analyzes it for red flags, scores it on privacy, integrity, and fairness, and translates the legalese into casual, easy-to-understand language. Users can also generate virtual cards with spending limits through Stripe to control subscription costs. Available as both a web dashboard and a Chrome extension.

---

## Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- Supabase project
- Google AI API Key (Gemini)
- Stripe API Key (Issuing)

### Steps

**1. Clone the Repository**
```bash
git clone https://github.com/your-org/SASEHacksCFF
cd SASEHacksCFF
```

**2. Install Frontend Dependencies**
```bash
cd frontend
npm install
```

**3. Install Backend Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

**4. Configure Environment Variables**
```bash
cp backend/.env.example backend/.env
```

Required variables:
```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# Google AI
GEMINI_API_KEY=your-gemini-api-key

# Stripe
STRIPE_API_KEY=your-stripe-api-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```

Also configure the frontend Supabase client in `frontend/src/supabase.js` with your project URL and anon key.

**5. Run the Backend**
```bash
cd backend
uvicorn main:app --reload
```

**6. Run the Frontend**
```bash
cd frontend
npm run dev
```

**7. Access the Application**
Open `http://localhost:5173` in your browser.

---

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, Framer Motion, React Router v7 |
| **Chrome Extension** | Manifest v3, @crxjs/vite-plugin |
| **Backend** | FastAPI, Uvicorn, Python 3.11+ |
| **AI** | Google Gemini 2.5 Flash |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (JWT) |
| **Payments** | Stripe Issuing API |
| **PDF Processing** | PyMuPDF |

---

## Architecture

Subscriptos follows a client-server architecture with a React frontend, FastAPI backend, Gemini-powered AI analysis layer, and Supabase for auth and data persistence.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          SUBSCRIPTOS SYSTEM                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   CLIENT LAYER                        AI LAYER (Gemini 2.5 Flash)            │
│   ────────────                        ───────────────────────────             │
│                                                                              │
│   ┌──────────────────┐                ┌─────────────────────────┐            │
│   │  Web Dashboard   │───────────────►│     ToS Report          │            │
│   │  (React 19)      │                │  ┌───────────────────┐  │            │
│   │                  │                │  │ Data Privacy Score │  │            │
│   │  - ToS Input     │                │  │ Integrity Score    │  │            │
│   │  - Score Display │                │  │ Fairness Score     │  │            │
│   │  - Chat UI       │                │  │ Company Name       │  │            │
│   │  - Virtual Cards │                │  └───────────────────┘  │            │
│   └──────────────────┘                └─────────────────────────┘            │
│                                                                              │
│   ┌──────────────────┐                ┌─────────────────────────┐            │
│   │ Chrome Extension │───────────────►│     ToS Translate       │            │
│   │  (Manifest v3)   │                │  ┌───────────────────┐  │            │
│   │                  │                │  │ Casual red flag    │  │            │
│   │  - Popup UI      │                │  │ summary with       │  │            │
│   │  - Quick Scan    │                │  │ brainrot humor     │  │            │
│   │  - Card Creation │                │  └───────────────────┘  │            │
│   └──────────────────┘                └─────────────────────────┘            │
│                                                                              │
│                                       ┌─────────────────────────┐            │
│                                       │     ToS Chat            │            │
│                                       │  ┌───────────────────┐  │            │
│                                       │  │ Interactive Q&A    │  │            │
│                                       │  │ about the ToS      │  │            │
│                                       │  │ with context       │  │            │
│                                       │  └───────────────────┘  │            │
│                                       └─────────────────────────┘            │
│                                                                              │
│   API LAYER (FastAPI)                 DATA LAYER                             │
│   ───────────────────                 ──────────                             │
│                                                                              │
│   ┌──────────────────┐                ┌─────────────────────────┐            │
│   │  /ai/tos         │───────────────►│   Supabase (PostgreSQL) │            │
│   │  /ai/report      │                │  ┌───────────────────┐  │            │
│   │  /ai/translate   │                │  │ scans table       │  │            │
│   │  /ai/chat        │                │  │ profiles table    │  │            │
│   ├──────────────────┤                │  └───────────────────┘  │            │
│   │  /cards/list     │                │                         │            │
│   │  /cards/create   │────────┐       │  ┌───────────────────┐  │            │
│   │  /cards/{id}     │        │       │  │ Supabase Auth     │  │            │
│   └──────────────────┘        │       │  │ (JWT tokens)      │  │            │
│                               │       │  └───────────────────┘  │            │
│                               │       └─────────────────────────┘            │
│                               │                                              │
│                               │       ┌─────────────────────────┐            │
│                               └──────►│   Stripe Issuing API    │            │
│                                       │  ┌───────────────────┐  │            │
│                                       │  │ Virtual cards     │  │            │
│                                       │  │ Spending limits   │  │            │
│                                       │  └───────────────────┘  │            │
│                                       └─────────────────────────┘            │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### AI Layer

The AI layer uses Google Gemini 2.5 Flash to analyze Terms of Service documents through three specialized modules.

**AI Modules:**

| Module | File | Purpose |
|--------|------|---------|
| **ToS Report** | `tosreport.py` | Scores the ToS on data privacy, integrity, and consumer fairness (0-100) with justifications |
| **ToS Translate** | `tostranslate.py` | Summarizes red flags in casual Gen-Z language for accessibility |
| **ToS Chat** | `toschat.py` | Interactive Q&A chatbot that answers user questions about specific clauses |
| **PDF Parser** | `pdfparser.py` | Extracts text from uploaded PDF contracts for analysis |

**Scoring Scale:**

| Range | Meaning |
|-------|---------|
| 80-100 | Gold standard — nothing blatantly predatory |
| 50-79 | At least one clause is a point of contention |
| 30-49 | At least one clause is blatantly wrong or predatory |
| 0-29 | Multiple clauses are blatantly wrong or predatory |

**Analysis Flow:**
1. User submits ToS text via dashboard or Chrome extension
2. Backend checks if the company has already been scanned (cached by company name)
3. If new, Gemini extracts the company name, generates scores with justifications
4. Translation module produces a casual red flag summary
5. All results are saved to the `scans` table in Supabase
6. User can ask follow-up questions via the chat module

---

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/ai/tos` | Save raw ToS text to database |
| `POST` | `/ai/report` | Analyze ToS and return scores (cached by company) |
| `POST` | `/ai/translate` | Get casual brainrot red flag summary |
| `POST` | `/ai/chat` | Ask questions about the ToS |
| `POST` | `/ai/chat/reset` | Reset chat session |
| `GET` | `/cards/` | List user's virtual cards |
| `POST` | `/cards/create/` | Create a new virtual card with spending limit |
| `DELETE` | `/cards/{card_id}` | Cancel a virtual card |

---

### Database Schema

**`scans` table:**

| Column | Type | Description |
|--------|------|-------------|
| `id` | int (PK) | Auto-incrementing primary key |
| `tos` | text | Full Terms of Service text |
| `source_name` | text | Company name (extracted by AI) |
| `translation` | text | Casual red flag summary |
| `data_privacy_score` | int | 0-100 privacy score |
| `data_privacy_just` | text | Score justification |
| `integrity_score` | int | 0-100 integrity score |
| `integrity_just` | text | Score justification |
| `consumer_fairness_score` | int | 0-100 fairness score |
| `consumer_fairness_just` | text | Score justification |

**`profiles` table:**

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | User ID from Supabase Auth |
| `stripe_id` | text | Stripe cardholder ID |

---

### Project Structure

```
SASEHacksCFF/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Marketing landing page
│   │   │   ├── Login.jsx            # Auth page
│   │   │   ├── Dashboard.jsx        # ToS analysis interface
│   │   │   ├── VirtualCards.jsx     # Card management
│   │   │   └── Popup.jsx           # Chrome extension popup
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── Sidebar.jsx          # Dashboard sidebar
│   │   │   ├── CardWindow.jsx       # Card display
│   │   │   └── VirtualCardForm.jsx  # Card creation form
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx      # Supabase auth (web + extension)
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx  # Dashboard wrapper
│   │   ├── App.jsx                  # Router
│   │   ├── supabase.js              # Supabase client
│   │   └── contentWorker.jsx        # Extension content script
│   ├── manifest.json                # Chrome Extension v3 manifest
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── main.py                      # FastAPI entry point
│   ├── auth.py                      # JWT token verification
│   ├── db.py                        # Supabase client
│   ├── routes/
│   │   ├── ai.py                    # ToS analysis endpoints
│   │   ├── cards.py                 # Stripe virtual card endpoints
│   │   └── scans.py                 # Scan history endpoints
│   ├── LLMs/
│   │   ├── tosreport.py             # Gemini scoring analysis
│   │   ├── tostranslate.py          # Gemini casual summary
│   │   ├── toschat.py               # Gemini interactive chat
│   │   └── pdfparser.py             # PDF text extraction
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

---

*Subscriptos - Protecting consumers from predatory subscriptions with AI*
