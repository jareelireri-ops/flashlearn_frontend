import { useEffect, useState, useContext, useMemo } from 'react'
import { Search, Filter, BookOpen, Plus } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { UIContext } from '../context/UIContext'
import {
  getPublicCategories,
  getPublicDecks,
  getMyCollection,
  getCompletionStats,
  addToCollection,
} from '../api/client'
import Navbar from '../components/ReusableComponents/Navbar'
import Breadcrumbs from '../components/ReusableComponents/Breadcrumbs'
import DeckCard from '../components/library/DeckCard'
import DeckDrawer from '../components/library/DeckDrawer'

function Library() {
  const { user } = useContext(AuthContext)
  const { openAuthModal } = useContext(UIContext)
  const navigate = useNavigate()
  const location = useLocation()

  const [tab, setTab] = useState(location.state?.tab || 'discover')
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(location.state?.category || 'All')
  const [activeDifficulty, setActiveDifficulty] = useState('All')
  const [search, setSearch] = useState('')

  const [discoverDecks, setDiscoverDecks] = useState([])
  const [collectionDecks, setCollectionDecks] = useState([])
  const [completionMap, setCompletionMap] = useState({})
  const [loading, setLoading] = useState(true)

  const [selectedDeck, setSelectedDeck] = useState(null)
  const [selectedIsOwner, setSelectedIsOwner] = useState(false)

  useEffect(() => {
    getPublicCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (activeCategory !== 'All') params.category = activeCategory
    if (activeDifficulty !== 'All') params.difficulty = activeDifficulty
    if (search) params.search = search

    getPublicDecks(params)
      .then(setDiscoverDecks)
      .finally(() => setLoading(false))
  }, [activeCategory, activeDifficulty, search])

  useEffect(() => {
    if (location.state?.category) {
      setActiveCategory(location.state.category)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    if (location.state?.tab) {
      setTab(location.state.tab)
    }
  }, [location.state?.category, location.state?.tab])

  const fetchMyCollection = () => {
    if (!user) return
    getMyCollection().then(setCollectionDecks).catch(() => {})
    getCompletionStats()
      .then((stats) => {
        const map = {}
        stats.forEach((s) => { map[s.deck_id] = s })
        setCompletionMap(map)
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetchMyCollection()
  }, [user])

  const filteredCollection = useMemo(() => {
    return collectionDecks.filter((deck) => {
      const matchesCategory = activeCategory === 'All' || deck.category === activeCategory
      const matchesDifficulty = activeDifficulty === 'All' || deck.difficulty_level === activeDifficulty
      const matchesSearch = !search || deck.title.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesDifficulty && matchesSearch
    })
  }, [collectionDecks, activeCategory, activeDifficulty, search])

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

  const activeList = tab === 'collection' ? filteredCollection : discoverDecks

  const breadcrumbItems = [
    { label: 'Library', path: '/library' },
    { label: tab === 'collection' ? 'My Collection' : 'Discover' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Library</h1>
            <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
              {tab === 'collection' ? filteredCollection.length : discoverDecks.length} decks
            </span>
          </div>

          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search decks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
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
            <button
              onClick={() => setTab('collection')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition ${tab === 'collection' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              My Collection
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-48">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <BookOpen size={14} className="text-slate-400" />
              </div>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-300 appearance-none cursor-pointer hover:bg-slate-100 transition"
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
                className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-300 appearance-none cursor-pointer hover:bg-slate-100 transition"
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
          <div className="text-center py-20 text-slate-400">Loading decks...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tab === 'collection' && user && (
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
              const isSaved = collectionDecks.some((c) => c.id === deck.id)
              return (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  completion={tab === 'collection' ? completionMap[deck.id] : null}
                  onClick={() => handleDeckClick(deck, tab === 'collection' ? deck.is_owner : false)}
                  onSave={tab === 'discover' && !isSaved ? () => handleSaveDeck(deck) : null}
                />
              )
            })}
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
  )
}

export default Library