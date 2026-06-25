import { useEffect, useState, useContext, useMemo } from 'react'
import { Search, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import {
  getPublicCategories,
  getPublicDecks,
  getMyCollection,
  getCompletionStats,
} from '../api/client'
import Navbar from '../components/common/Navbar'
import DeckCard from '../components/library/DeckCard'
import DeckDrawer from '../components/library/DeckDrawer'

function Library() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [tab, setTab] = useState('collection') // 'collection' | 'discover'
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
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
    if (search) params.search = search

    getPublicDecks(params)
      .then(setDiscoverDecks)
      .finally(() => setLoading(false))
  }, [activeCategory, search])

  useEffect(() => {
    if (!user) return
    getMyCollection().then(setCollectionDecks).catch(() => {})
    getCompletionStats()
      .then((stats) => {
        const map = {}
        stats.forEach((s) => { map[s.deck_id] = s })
        setCompletionMap(map)
      })
      .catch(() => {})
  }, [user])

  const filteredCollection = useMemo(() => {
    return collectionDecks.filter((deck) => {
      const matchesCategory = activeCategory === 'All' || deck.category === activeCategory
      const matchesSearch = !search || deck.title.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [collectionDecks, activeCategory, search])

  function handleDeckClick(deck, isOwner) {
    setSelectedDeck(deck)
    setSelectedIsOwner(isOwner)
  }

  const activeList = tab === 'collection' ? filteredCollection : discoverDecks

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-slate-400 hover:text-slate-600">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Library</h1>
            <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
              {tab === 'collection' ? filteredCollection.length : discoverDecks.length} decks
            </span>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search decks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 w-48 md:w-64"
            />
          </div>
        </div>

        {/* Tabs + category filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex bg-slate-100 rounded-full p-1">
            <button
              onClick={() => setTab('collection')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                tab === 'collection' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
              }`}
            >
              My Collection
            </button>
            <button
              onClick={() => setTab('discover')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                tab === 'discover' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
              }`}
            >
              Discover
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeCategory === 'All' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeCategory === cat.category ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state for My Collection */}
        {tab === 'collection' && !user && (
          <div className="text-center py-20 text-slate-400">
            Sign in to start building your collection.
          </div>
        )}
        {tab === 'collection' && user && filteredCollection.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            Your collection is empty. Save a deck from Discover or create your own.
          </div>
        )}

        {/* Deck grid */}
        {loading && tab === 'discover' ? (
          <div className="text-center py-20 text-slate-400">Loading decks...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {activeList.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                completion={tab === 'collection' ? completionMap[deck.id] : null}
                onClick={() => handleDeckClick(deck, tab === 'collection' ? deck.is_owner : false)}
              />
            ))}
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