# FlashLearn — Frontend

FlashLearn is a web-based learning platform built to help users retain what they study through active recall and spaced repetition. Users can build their own study collections, create flashcards, and browse public decks shared by other learners.

* **Live Frontend:** https://flashlearn-frontend-ten.vercel.app
* **Backend API:** https://flashlearn-backend-ocnv.onrender.com

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (Vite) |
| Routing | React Router v6 |
| State Management | Context API |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Charts | Recharts |
| Icons | Lucide React |

---

## Architecture Notes

A few design decisions worth explaining, since they're not obvious from the file structure alone:

**Deck visibility vs. archiving**
Decks have two separate flags — `is_public` and `is_archived` — instead of one status field. This means archiving a deck (taking it out of active use) doesn't wipe out whether it was public or private. If you unarchive it later, it goes right back to how it was before.

**Shared decks across users**
When someone adds a public deck to their own library, we don't copy the deck — we just create a row in a join table (`user_collection`) linking their account to the original deck. That way if the original author edits it, everyone who has it sees the update. If the original creator deletes their account, the deck itself isn't deleted, so it doesn't break things for everyone else studying it.

**Flashcards vs. study progress**
The flashcard itself (question, answer, image) is stored separately from a user's progress on it. Progress — like when a card is due for review — lives in its own table (`ReviewHistory`). That's what lets 1,000 people study the same public deck at the same time without their review schedules colliding.

Spaced repetition works like this:
- Mark a card **Easy** → comes back in 7 days
- Mark it **Medium** → comes back in 3 days
- Mark it **Hard** → comes back tomorrow

**Access control**
Protected routes check both identity and ownership before allowing edits — components like `AccessDeniedGate` and `AccessDeniedBanner` handle blocking read-only users from modifying content that isn't theirs. Admin-only actions (suspending users, reviewing reports) are gated behind role checks.

---

## Key Features

- Account registration/login with profile pictures and unique email enforcement
- Dashboard showing study streaks, cards reviewed, and upcoming reviews
- Deck and flashcard builder (titles, tags, categories, images, difficulty)
- Public library with search and filtering
- Study sessions with a flip-card interface and pause/resume
- Content reporting for inappropriate decks
- Admin dashboard for moderation and user management

---

## Project Structure

```text
src/
├── api/
│   └── client.js                 # Axios instance
├── assets/
│   └── hero.png
├── components/
│   ├── Admin/                    # Reports, user management tables
│   ├── Builder/                  # Deck & flashcard creation forms
│   ├── Dashboard/                # Stats, activity, review schedule
│   ├── landing-page/             # Public marketing sections
│   ├── library/                  # Deck browsing/discovery
│   ├── ReusableComponents/       # Shared UI (nav, modals, auth, etc.)
│   └── study/                    # Study session flow
├── context/                      # Auth, notifications, UI state
├── pages/                        # Route-level pages
├── Routes/                       # Router setup and protected routes
├── App.jsx
└── main.jsx
```

## Getting Started

### Prerequisites
Requires the FlashLearn backend running locally or deployed.

### Install
```bash
git clone https://github.com/jareelireri-ops/flashlearn_frontend.git
cd flashlearn_frontend
npm install
```

### Environment
Create a `.env` file:
