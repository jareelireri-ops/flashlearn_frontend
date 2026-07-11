import { useEffect, useState, useContext, useMemo } from 'react'
import { Search, Filter, BookOpen, Plus, Pencil } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { UIContext } from '../context/UIContext'
import {
  getPublicCategories,
  getPublicDecks,
  getMyCollection,
  getCompletionStats,
  addToCollection,
  removeFromCollection,
  getReviewQueue,
} from '../api/client'
import Navbar from '../components/ReusableComponents/Navbar'
import Breadcrumbs from '../components/ReusableComponents/Breadcrumbs'
import DeckCard from '../components/library/DeckCard'
import DeckDrawer from '../components/library/DeckDrawer'
import DeckCardSkeleton from '../components/library/DeckCardSkeleton'
import { ScanLens } from '../components/ReusableComponents/Skeleton'

const PAGE_SIZE = 6

// Dark ink pencils, tuned for visibility on light backgrounds (same as FeaturedDecks/Categories)
const PENCILS = [
  { top: '8%', left: '4%', rotate: -18, size: 90, opacity: 0.16 },
  { top: '70%', left: '95%', rotate: 26, size: 110, opacity: 0.16 },
]

// A deck is said to have new cards only if the user has already studied it before
// and it was updated after their last review on the deck
function hasNewCardsSinceLastReview(deck, completion) {
  if (!completion || !completion.cards_reviewed || !completion.last_reviewed_at) return false
  if (!deck.updated_at) return false
  return new Date(deck.updated_at) > new Date(completion.last_reviewed_at)
}

function Library() {
  const { user } = useContext(AuthContext)
  const { openAuthModal } = useContext(UIContext)
  const navigate = useNavigate()
  const location = useLocation()

  // Admins are guest-equivalent : no personal collection, no saving,
  // no deck creation. They only ever see Discover.
  const isLearner = user && user.role === 'learner'

  const [tab, setTab] = useState(isLearner ? (location.state?.tab || 'discover') : 'discover')
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(location.state?.category || 'All')
  const [activeDifficulty, setActiveDifficulty] = useState('All')
  const [search, setSearch] = useState('')

  const [discoverDecks, setDiscoverDecks] = useState([])
  const [collectionDecks, setCollectionDecks] = useState([])
  const [completionMap, setCompletionMap] = useState({})
  const [dueMap, setDueMap] = useState({})
  const [dueDifficultyMap, setDueDifficultyMap] = useState({})
  const [loading, setLoading] = useState(true)

  const [discoverPage, setDiscoverPage] = useState(1)
  const [discoverMeta, setDiscoverMeta] = useState({ pages: 1, total: 0, has_next: false, has_prev: false })
  const [collectionPage, setCollectionPage] = useState(1)

  const [selectedDeck, setSelectedDeck] = useState(null)
  const [selectedIsOwner, setSelectedIsOwner] = useState(false)

  useEffect(() => {
    getPublicCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    setDiscoverPage(1)
  }, [activeCategory, activeDifficulty, search])

  useEffect(() => {
    setCollectionPage(1)
  }, [activeCategory, activeDifficulty, search, tab])

  useEffect(() => {
    setLoading(true)
    const params = { page: discoverPage, per_page: PAGE_SIZE }
    if (activeCategory !== 'All') params.category = activeCategory
    if (activeDifficulty !== 'All') params.difficulty = activeDifficulty
    if (search) params.search = search

    getPublicDecks(params)
      // Extract decks array from paginated response
      .then((res) => {
        setDiscoverDecks(res.decks || [])
        setDiscoverMeta({
          pages: res.pages || 1,
          total: res.total || 0,
          has_next: res.has_next,
          has_prev: res.has_prev,
        })
      })
      .finally(() => setLoading(false))
  }, [activeCategory, activeDifficulty, search, discoverPage])

  useEffect(() => {
    
    if (location.state?.category) {
      setActiveCategory(location.state.category)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    if (location.state?.tab && isLearner) {
      setTab(location.state.tab)
    }
    if (location.state?.filter === 'due') {
      // Optional: automatically switch to due tab or handle scrolling if needed
    }
  }, [location.state?.category, location.state?.tab, location.state?.filter, isLearner])

  const fetchMyCollection = () => {
    // Only learners have my collection, admins should never trigger
    // these calls just by landing on the Library page.
    if (!isLearner) return
    getMyCollection({ per_page: 100 })
      // to avoid pagination issues, fetch all decks in one go (max 100)
      .then((res) => setCollectionDecks(res.collection || []))
      .catch(() => {})
    getCompletionStats()
      .then((stats) => {
        const map = {}
        stats.forEach((s) => { map[s.deck_id] = s })
        setCompletionMap(map)
      })
      .catch(() => {})
      
    getReviewQueue()
      .then((queue) => {
        const counts = {}
        const difficulties = {}
        const levelScore = { hard: 3, medium: 2, easy: 1 }

        queue.forEach((card) => {
          const deckId = card.deck_id
          counts[deckId] = (counts[deckId] || 0) + 1
          
          const rating = card.last_rating || 'easy'
          if (!difficulties[deckId] || levelScore[rating] > levelScore[difficulties[deckId]]) {
            difficulties[deckId] = rating
          }
        })
        setDueMap(counts)
        setDueDifficultyMap(difficulties)
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetchMyCollection()
  }, [user])

  const filteredCollection = useMemo(() => {
    const filtered = collectionDecks.filter((deck) => {
      const matchesCategory = activeCategory === 'All' || deck.category === activeCategory
      const matchesDifficulty = activeDifficulty === 'All' || deck.difficulty_level === activeDifficulty
      const matchesSearch = !search || deck.title.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesDifficulty && matchesSearch
    })

    // Sort by due difficulty first (hard > medium > easy > none), then due count
    filtered.sort((a, b) => {
      const dueA = dueMap[a.id] || 0
      const dueB = dueMap[b.id] || 0
      
      const diffA = dueDifficultyMap[a.id] || 'none'
      const diffB = dueDifficultyMap[b.id] || 'none'
      
      const score = { hard: 4, medium: 3, easy: 2, none: 1 }
      
      if (score[diffA] !== score[diffB]) {
        return score[diffB] - score[diffA]
      }
      return dueB - dueA
    })

    return filtered
  }, [collectionDecks, activeCategory, activeDifficulty, search, dueMap, dueDifficultyMap])

  const collectionTotalPages = Math.max(1, Math.ceil(filteredCollection.length / PAGE_SIZE))
  const paginatedCollection = filteredCollection.slice(
    (collectionPage - 1) * PAGE_SIZE,
    collectionPage * PAGE_SIZE
  )

  function handleDeckClick(deck, isOwner) {
    setSelectedDeck(deck)
    setSelectedIsOwner(isOwner)
  }

  async function handleSaveDeck(deck) {
    if (!user) {
      openAuthModal('login')
      return
    }
    try {
      await addToCollection(deck.id)
      fetchMyCollection()
      alert(`"${deck.title}" saved to your collection!`)
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save deck')
    }
  }

  async function handleRemoveDeck(deck) {
    if (!window.confirm(`Remove "${deck.title}" from your collection?`)) return
    try {
      await removeFromCollection(deck.id)
      fetchMyCollection()
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to remove deck')
    }
  }

  const activeList = tab === 'collection' ? paginatedCollection : discoverDecks

  const currentPage = tab === 'collection' ? collectionPage : discoverPage
  const totalPages = tab === 'collection' ? collectionTotalPages : discoverMeta.pages
  const hasPrev = tab === 'collection' ? collectionPage > 1 : discoverMeta.has_prev
  const hasNext = tab === 'collection' ? collectionPage < collectionTotalPages : discoverMeta.has_next
  const setPage = tab === 'collection' ? setCollectionPage : setDiscoverPage

  const breadcrumbItems = [
    { label: 'Library', path: '/library' },
    { label: tab === 'collection' ? 'My Collection' : 'Discover' },
  ]

  return (
    <div className="relative min-h-screen bg-slate-200">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PENCILS.map((p, i) => (
          <Pencil
            key={i}
            className="absolute text-gray-900"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              transform: `rotate(${p.rotate}deg)`,
            }}
            strokeWidth={1.5}
          />
        ))}
      </div>

      <div className="relative">
        <Navbar />

        <div className="max-w-6xl mx-auto px-6 py-8">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">Library</h1>
              <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                {tab === 'collection' ? filteredCollection.length : discoverMeta.total} decks
              </span>
            </div>

            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search decks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-400 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex bg-slate-100 rounded-lg p-1 self-start lg:self-auto">
              <button
                onClick={() => setTab('discover')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition ${tab === 'discover' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Discover
              </button>
              {isLearner && (
                <button
                  onClick={() => setTab('collection')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition ${tab === 'collection' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  My Collection
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-48">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <BookOpen size={14} className="text-slate-400" />
                </div>
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none appearance-none cursor-pointer hover:bg-slate-100 transition"
                >
                  <option value="All">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.category} value={cat.category}>{cat.category}</option>
                  ))}
                </select>
              </div>

              <div className="relative w-full sm:w-40">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Filter size={14} className="text-slate-400" />
                </div>
                <select
                  value={activeDifficulty}
                  onChange={(e) => setActiveDifficulty(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none appearance-none cursor-pointer hover:bg-slate-100 transition"
                >
                  <option value="All">Any Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {tab === 'collection' && !user && (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Sign in to save decks</h3>
              <p className="text-slate-500 mb-4">You need an account to build a personal collection.</p>
            </div>
          )}

          {loading && tab === 'discover' ? (
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => <DeckCardSkeleton key={i} />)}
              </div>
              <ScanLens />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tab === 'collection' && isLearner && (
                <div
                  onClick={() => navigate('/decks/manage')}
                  className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-100 transition-all cursor-pointer min-h-[180px]"
                >
                  <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                    <Plus size={24} className="text-slate-700" />
                  </div>
                  <span className="font-bold">Create New Deck</span>
                  <span className="text-xs text-slate-400 mt-1">Make your own flashcards</span>
                </div>
              )}

              {activeList.map((deck) => {
                const isInCollection = collectionDecks.some((c) => c.id === deck.id)
                const completion = tab === 'collection' ? completionMap[deck.id] : null
                const isOwner = tab === 'collection' ? deck.is_owner : false
                const isStudying = tab === 'collection' ? (!deck.is_owner && completion && completion.cards_reviewed > 0) : false
                const isSaved = tab === 'collection' ? (!deck.is_owner && (!completion || !completion.cards_reviewed)) : false
                const dueCount = tab === 'collection' ? (dueMap[deck.id] || 0) : 0

                return (
                  <DeckCard
                    key={deck.id}
                    deck={deck}
                    completion={completion}
                    hasNewCards={tab === 'collection' && hasNewCardsSinceLastReview(deck, completion)}
                    isOwner={isOwner}
                    isSaved={isSaved}
                    isStudying={isStudying}
                    dueCount={dueCount}
                    onClick={() => handleDeckClick(deck, tab === 'collection' ? deck.is_owner : false)}
                    onSave={tab === 'discover' && isLearner && !isInCollection ? () => handleSaveDeck(deck) : null}
                    onRemove={tab === 'collection' && !deck.is_owner ? () => handleRemoveDeck(deck) : null}
                  />
                )
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!hasPrev}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${currentPage === num ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={!hasNext}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <DeckDrawer
          deck={selectedDeck}
          completion={selectedDeck ? completionMap[selectedDeck.id] : null}
          isOwner={selectedIsOwner}
          onClose={() => setSelectedDeck(null)}
        />
      </div>
    </div>
  )
}

export default Library