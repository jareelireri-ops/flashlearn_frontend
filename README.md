# FlashLearn — Frontend

A web-based flashcard learning platform built with React and Vite. Users can create decks, study with spaced repetition, track progress, and discover community content.

**Live App:** https://flashlearn-frontend-ten.vercel.app  
**Backend API:** https://flashlearn-backend-ocnv.onrender.com

---

## Tech Stack

- React 18
- Vite
- React Router v6
- Context API (Auth + UI state)
- Tailwind CSS
- Axios
- Recharts (analytics charts)
- Lucide React (icons)

---

## Features

- User registration and login (JWT-based)
- Personal dashboard with study stats and analytics
- Create, edit, and manage flashcard decks
- Community library — browse and save public decks
- Interactive study sessions with card flip and confidence rating
- Spaced repetition review scheduling (Easy / Medium / Hard)
- In-app notifications
- Content reporting
- Admin portal for user and content management
- Fully responsive design

---

## Project Structure

```
src/
├── api/          # Axios client and all API calls
├── components/   # Reusable UI components
├── context/      # AuthContext and UIContext
├── pages/        # Route-level page components
└── main.jsx      # App entry point
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/jareelireri-ops/flashlearn_frontend.git
cd flashlearn_frontend

# Install dependencies
npm install

# Set up environment
echo "VITE_API_URL=http://127.0.0.1:5000/api" > .env

# Start development server
npm run dev
```

> Requires the [FlashLearn backend](https://github.com/jareelireri-ops/flashlearn_backend) running locally or pointed to the deployed API.

---

## Related

- [Backend Repository](https://github.com/jareelireri-ops/flashlearn_backend)
- [API Documentation](https://github.com/jareelireri-ops/flashlearn_backend/blob/main/API.md)
