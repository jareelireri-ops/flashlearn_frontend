# FlashLearn — Frontend

FlashLearn is a web-based learning platform designed to help users improve knowledge retention through active recall and spaced repetition. Users can create personalized study collections, design custom flashcards, and discover public decks created by other learners in the community library.

* **Live Frontend:** https://flashlearn-frontend-ten.vercel.app
* **Backend API:** https://flashlearn-backend-ocnv.onrender.com

---

## Architecture & System Design

This application is intentionally engineered to move beyond basic CRUD operations, satisfying the advanced architectural requirements outlined in the Product Requirements Document (PRD):

### 1. State Visibility Logic
To separate "presentation access" from "lifecycle activity", the system manages deck states using a multi-flag system rather than destructive overwriting:
* `is_public`: Dictates community visibility boundaries.
* `is_archived`: Dictates active operational context.

Archiving a public resource shifts its status without destroying its base configuration. When unarchived, the resource resumes its previous public standing instantly, preserving structural memory in the user interface.

### 2. Multi-User Shared Collections
To prevent database duplication and asset bloat, saved public resources utilize a discrete mapping layer (`user_collection` join table).
* Multiple consumers point securely to a single source record.
* Central author updates or corrections propagate instantly to all active learners downstream.
* **Data Integrity Shield:** Refuses to silently delete a shared deck if its original creator deletes their account, protecting shared data for existing learners.

### 3. Separating the Flashcards from User Scores
* **No Data Overlaps:** The flashcard itself only holds the question, answer, and optional image. It does not track when a user needs to review it.
* **Personal Review Timers:** All user scores and study countdowns are saved in a completely separate table (`ReviewHistory`). This means 1,000 different students can study the exact same public JavaScript deck at the same time, and they will all have their own personal study schedules without messing up anyone else's data.
* **The Spaced Repetition Rules:** Based on how easy or hard a card is, the app calculates when the user needs to see it again:
  * Click **Easy** ➔ See it again in 7 days.
  * Click **Medium** ➔ See it again in 3 days.
  * Click **Hard** ➔ See it again tomorrow.

### 4. User Identity Validation & Security Guards
* **Ownership Validation & UX Gates:** Protected routes use explicit middleware wrappers. Components like `AccessDeniedGate` and `AccessDeniedBanner` cross-check user identities and view contexts before giving read-only consumers modification access to structural content.
* **Hierarchical Role Control:** System uses Role-Based Access Control (RBAC) to restrict sensitive administrative operations (user suspension, flag reviews) exclusively to authorized admin accounts via designated administration data layouts.

---

## Tech Stack
* **Core Framework:** React 18 (built with Vite)
* **Routing:** React Router v6 (supporting authenticated protected routes)
* **State Management:** Context API (decoupled Auth session state, Notification syncing, and global UI state)
* **Styling:** Tailwind CSS (fully responsive layout)
* **Data Fetching:** Axios (centralized client management)
* **Data Visualization:** Recharts (dynamic, auto-updating analytics graphs)
* **Icons:** Lucide React

---

## Key Features
* **User Accounts & Authentication:** Secure registration, login, and profile updates with profile picture uploads and unique email enforcement.
* **Personal Dashboard:** Dynamic home screen providing real-time personalized stats: study streaks, total cards reviewed, sessions completed, and up-to-date review queues.
* **Deck & Flashcard Management:** Rich composition tools allowing titles, descriptions, categories, tags, images, and base difficulty levels.
* **Community Library:** Public discovery hub allowing users to search, filter by category/difficulty, and add community decks directly to their library.
* **Interactive Study Sessions:** Fluid interface tracking active progress with a card-flipping engine, forward/backward navigation, and pause/resume session state memory.
* **Content Reporting System:** Mechanism allowing users to flag inappropriate materials directly to the moderation queue.
* **Admin Portal:** Moderation dashboard built for managing user access rights and resolving outstanding content reports.

---

## Project Structure
```text
src/
├── api/
│   └── client.js                 # Centralized Axios client instantiation
├── assets/
│   └── hero.png                  # Application graphical assets
├── components/                   # Modular UI Domain Subsystems
│   ├── Admin/                    # Administrative Control Panels
│   │   ├── ReportsTable.jsx
│   │   └── UserManagementTable.jsx
│   ├── Builder/                  # Deck & Flashcard Creation Suite
│   │   ├── ConfirmDialog.jsx
│   │   ├── DeckForm.jsx
│   │   ├── DeckHeaderCard.jsx
│   │   ├── DeckListPanel.jsx
│   │   ├── FlashcardRow.jsx
│   │   ├── FlashcardsPanel.jsx
│   │   ├── ImageUploadField.jsx
│   │   └── NewCardForm.jsx
│   ├── Dashboard/                # Analytics & Metrics Components
│   │   ├── CategoryBreakdown.jsx
│   │   ├── ContinueStudying.jsx
│   │   ├── DashboardBanner.jsx
│   │   ├── DashboardSkeleton.jsx
│   │   ├── MarqueeStrip.jsx
│   │   ├── ReviewSchedule.jsx
│   │   ├── StatGrid.jsx
│   │   ├── TopDecks.jsx
│   │   └── WeeklyActivity.jsx
│   ├── landing-page/             # Public Marketing Views
│   │   ├── CallToAction.jsx
│   │   ├── CallToAction2.jsx
│   │   ├── Features.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── SpacedRepetition.jsx
│   │   └── Testimonials.jsx
│   ├── library/                  # Open Discovery Ecosystem
│   │   ├── DeckCard.jsx
│   │   ├── DeckCardSkeleton.jsx
│   │   └── DeckDrawer.jsx
│   ├── ReusableComponents/       # Shared Atomic Layout Controls
│   │   ├── 3DTiltWrapper.jsx
│   │   ├── AccessDeniedBanner.jsx
│   │   ├── AccessDeniedGate.jsx
│   │   ├── AdminModal.jsx
│   │   ├── AuthModal.jsx
│   │   ├── Avatar.jsx
│   │   ├── Breadcrumbs.jsx
│   │   ├── constants.js
│   │   ├── MarqueeStrip.jsx
│   │   ├── Navbar.jsx
│   │   ├── NotificationBadge.jsx
│   │   └── Skeleton.jsx
│   └── study/                    # Dynamic Interactive Learning Environment
│       ├── SessionComplete.jsx
│       ├── SessionHeader.jsx
│       └── StudySession.jsx
├── context/                      # Global State Providers
│   ├── AuthContext.jsx
│   ├── NotificationContext.jsx
│   └── UIContext.jsx
├── pages/                        # Master Route-Level Entrypoints
│   ├── Dashboard.jsx
│   ├── Landing.jsx
│   ├── Library.jsx
│   ├── Notifications.jsx
│   ├── Profile.jsx
│   ├── ResetPassword.jsx
│   └── StudyArea.jsx
├── Routes/                       # Application Router Layout Hooks
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
├── App.jsx                       # Master Component Shell
└── main.jsx                      # Client Hydration Initialization
```

---

## Getting Started

### 1. Prerequisites
Requires the FlashLearn Backend running locally or pointed to the deployed production API.

### 2. Installation Steps

**Clone the repository**
```bash
git clone https://github.com/jareelireri-ops/flashlearn_frontend.git
cd flashlearn_frontend
```

**Install dependencies**
```bash
npm install
```

### 3. Set up your environment variables
Create a `.env` file in the root directory and specify your API URL:

```
VITE_API_URL=https://flashlearn-backend-ocnv.onrender.com/api
```
(For local testing, change this to `http://127.0.0.1:5000/api`)

### 4. Start the development server
```bash
npm run dev
```

---

## Related Repositories
* [Backend API Repository](https://flashlearn-backend-ocnv.onrender.com)