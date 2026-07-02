import { useEffect, useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Plus, ChevronRight } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/ReusableComponents/Navbar'
import Breadcrumbs from '../components/ReusableComponents/Breadcrumbs'
import {
  getUserDecks,
  createDeck,
  updateDeck,
  deleteDeck,
  getDeckFlashcards,
  addFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from '../api/client'

import ConfirmDialog from '../components/Builder/ConfirmDialog'
import DeckListPanel from '../components/Builder/DeckListPanel'
import DeckForm from '../components/Builder/DeckForm'
import DeckHeaderCard from '../components/Builder/DeckHeaderCard'
import FlashcardsPanel from '../components/Builder/FlashcardsPanel'

// The deck managing page(builder)
function Builder() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const [decks, setDecks] = useState([])
  const [selectedDeck, setSelectedDeck] = useState(null)
  const [flashcards, setFlashcards] = useState([])
  const [loadingDecks, setLoadingDecks] = useState(true)
  const [loadingCards, setLoadingCards] = useState(false)

  // Deck form state
  const [deckForm, setDeckForm] = useState(null) // null | { title, description, is_public, category_id }
  const [deckErrors, setDeckErrors] = useState({})
  const [deckSaving, setDeckSaving] = useState(false)

  // Flashcard form state
  const [showNewCardForm, setShowNewCardForm] = useState(false)

  // Delete confirmation
  const [confirmDelete, setConfirmDelete] = useState(null) // { type: 'deck'|'card', id?: number }

  useEffect(() => {
    if (!user) return
    loadDecks()
  }, [user])

  // Handle URL parameters for selecting a deck on load
  useEffect(() => {
    if (!loadingDecks && decks.length > 0) {
      const params = new URLSearchParams(location.search)
      const deckIdFromUrl = params.get('deck')
      
      if (deckIdFromUrl) {
        const deckToSelect = decks.find(d => d.id === parseInt(deckIdFromUrl))
        if (deckToSelect && (!selectedDeck || selectedDeck.id !== deckToSelect.id)) {
          handleSelectDeck(deckToSelect)
        }
      }
    }
  }, [loadingDecks, location.search])

  async function loadDecks() {
    setLoadingDecks(true)
    try {
      const data = await getUserDecks({ role: 'creator' })
      setDecks(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingDecks(false)
    }
  }

  async function handleSelectDeck(deck) {
    if (selectedDeck?.id === deck.id) return
    setSelectedDeck(deck)
    setDeckForm(null)
    setShowNewCardForm(false)
    setLoadingCards(true)
    setFlashcards([])
    
    // Update URL without reloading page
    navigate(`/builder?deck=${deck.id}`, { replace: true })
    
    try {
      const data = await getDeckFlashcards(deck.id)
      setFlashcards(data.flashcards || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingCards(false)
    }
  }

  function startCreateDeck() {
    setSelectedDeck(null)
    setFlashcards([])
    setDeckErrors({})
    setDeckForm({ title: '', description: '', is_public: false, category_id: '' })
    navigate('/builder', { replace: true })
  }

  function startEditDeck() {
    if (!selectedDeck) return
    setDeckErrors({})
    setDeckForm({
      title: selectedDeck.title,
      description: selectedDeck.description || '',
      is_public: selectedDeck.is_public,
      category_id: selectedDeck.category_id || '',
    })
  }

  async function handleSaveDeck() {
    setDeckErrors({})
    if (!deckForm.title.trim()) {
      setDeckErrors({ title: 'Title is required.' })
      return
    }

    setDeckSaving(true)
    try {
      if (selectedDeck) {
        // Update existing deck
        const res = await updateDeck(selectedDeck.id, deckForm)
        setDecks(decks.map((d) => (d.id === res.deck.id ? res.deck : d)))
        setSelectedDeck(res.deck)
      } else {
        // Create new deck
        const res = await createDeck(deckForm)
        setDecks([res.deck, ...decks])
        setSelectedDeck(res.deck)
        navigate(`/builder?deck=${res.deck.id}`, { replace: true })
      }
      setDeckForm(null)
    } catch (err) {
      console.error(err)
      setDeckErrors({ submit: 'Failed to save deck.' })
    } finally {
      setDeckSaving(false)
    }
  }

  async function handleArchiveDeck() {
    if (!selectedDeck) return
    try {
      const updated = { ...selectedDeck, is_archived: true }
      await updateDeck(selectedDeck.id, { is_archived: true })
      setDecks(decks.map(d => d.id === selectedDeck.id ? updated : d))
      setSelectedDeck(updated)
    } catch (err) {
      console.error('Failed to archive deck', err)
    }
  }

  async function handleDeleteDeck() {
    if (!selectedDeck) return
    try {
      await deleteDeck(selectedDeck.id)
      setDecks(decks.filter((d) => d.id !== selectedDeck.id))
      setSelectedDeck(null)
      setFlashcards([])
      navigate('/builder', { replace: true })
    } catch (err) {
      console.error(err)
    } finally {
      setConfirmDelete(null)
    }
  }

  async function handleAddCard(formData) {
    try {
      const res = await addFlashcard(selectedDeck.id, formData)
      setFlashcards([...flashcards, res.flashcard])
      setShowNewCardForm(false)
    } catch (err) {
      throw err
    }
  }

  async function handleSaveCard(id, formData) {
    try {
      const res = await updateFlashcard(id, formData)
      setFlashcards(flashcards.map((fc) => (fc.id === id ? res.flashcard : fc)))
    } catch (err) {
      throw err
    }
  }

  async function handleDeleteCard(id) {
    try {
      await deleteFlashcard(id)
      setFlashcards(flashcards.filter((fc) => fc.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setConfirmDelete(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <ConfirmDialog
          type={confirmDelete.type}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={
            confirmDelete.type === 'deck'
              ? handleDeleteDeck
              : () => handleDeleteCard(confirmDelete.id)
          }
        />
      )}

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ label: 'Deck Builder' }]} />
        
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 gap-6 mt-6">
          
          {/* Left Sidebar: Deck List */}
          <div className="w-full lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-[calc(100vh-140px)] sticky top-24">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-800">Your Decks</h2>
                <button
                  onClick={startCreateDeck}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition"
                  title="New Deck"
                >
                  <Plus size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                <DeckListPanel
                  decks={decks}
                  selectedDeck={selectedDeck}
                  loading={loadingDecks}
                  onSelect={handleSelectDeck}
                />
              </div>
            </div>
          </div>

          {/* Right Main Area */}
          <div className="w-full lg:col-span-9">
            
            {/* Empty state */}
            {!selectedDeck && !deckForm && (
              <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center text-center p-8 bg-white border border-slate-200 rounded-xl border-dashed">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Plus size={24} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">No deck selected</h3>
                <p className="text-slate-500 max-w-sm mb-6">
                  Select a deck from the sidebar to view and edit its flashcards, or create a new one to get started.
                </p>
                <button
                  onClick={startCreateDeck}
                  className="px-6 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
                >
                  Create New Deck
                </button>
              </div>
            )}

            {/* Deck form */}
            {deckForm && (
              <DeckForm
                deckForm={deckForm}
                setDeckForm={setDeckForm}
                deckErrors={deckErrors}
                setDeckErrors={setDeckErrors}
                deckSaving={deckSaving}
                isEditing={!!selectedDeck}
                onSave={handleSaveDeck}
                onCancel={() => setDeckForm(null)}
              />
            )}

            {/* Selected deck view not in editting mode */}
            {selectedDeck && !deckForm && (
              <div className="space-y-4">
                <DeckHeaderCard
                  deck={selectedDeck}
                  onEdit={startEditDeck}
                  onArchive={handleArchiveDeck}
                  onDeleteRequest={() => setConfirmDelete({ type: 'deck' })}
                />

                <FlashcardsPanel
                  flashcards={flashcards}
                  loadingCards={loadingCards}
                  showNewCardForm={showNewCardForm}
                  setShowNewCardForm={setShowNewCardForm}
                  onAddCard={handleAddCard}
                  onSaveCard={handleSaveCard}
                  onDeleteCardRequest={(id) => setConfirmDelete({ type: 'card', id })}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Builder