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
  const [deckForm, setDeckForm] = useState(null) // null = not editing
  const [deckSaving, setDeckSaving] = useState(false)
  const [deckErrors, setDeckErrors] = useState({})

  // New card form
  const [showNewCardForm, setShowNewCardForm] = useState(false)

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState(null) // { type: 'deck'|'card', id }

  // Toast
  const [toast, setToast] = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Load decks on mount
  useEffect(() => {
    fetchDecks()
  }, [])

  // If navigated here with a deckId (from DeckDrawer "Edit Deck"), auto-select it
  useEffect(() => {
    if (location.state?.deckId && decks.length > 0) {
      const target = decks.find((d) => d.id === location.state.deckId)
      if (target) handleSelectDeck(target)
    }
  }, [decks, location.state?.deckId])

  async function fetchDecks() {
    setLoadingDecks(true)
    try {
      // Request page size of 100 to list all decks in builder
      const data = await getUserDecks({ per_page: 100 })
      setDecks(data.decks || [])
    } catch {
      showToast('Failed to load decks', 'error')
    } finally {
      setLoadingDecks(false)
    }
  }

  async function handleSelectDeck(deck) {
    setSelectedDeck(deck)
    setDeckForm(null)
    setShowNewCardForm(false)
    setLoadingCards(true)
    try {
      // Request page size of 100 to list all cards in panel
      const cards = await getDeckFlashcards(deck.id, { per_page: 100 })
      setFlashcards(cards.flashcards || [])
    } catch {
      setFlashcards([])
    } finally {
      setLoadingCards(false)
    }
  }

  // this handles starting a new deck creation, by resetting the selected deck, flashcards,
  //  and initializing the deck form with empty values. I
  // it also clears any previous deck errors.

  function startNewDeck() {
    setSelectedDeck(null)
    setFlashcards([])
    setDeckForm({
      title: '',
      description: '',
      category: '',
      tags: '',
      difficulty_level: '',
      is_public: false,
    })
    setDeckErrors({})
  }

  function startEditDeck() {
    setDeckForm({
      title: selectedDeck.title,
      description: selectedDeck.description || '',
      category: selectedDeck.category || '',
      tags: selectedDeck.tags || '',
      difficulty_level: selectedDeck.difficulty_level || '',
      is_public: selectedDeck.is_public,
    })
    setDeckErrors({})
  }

  async function handleSaveDeck() {
    const errors = {}
    if (!deckForm.title.trim()) errors.title = 'Title is required'
    if (Object.keys(errors).length) { setDeckErrors(errors); return }

    setDeckSaving(true)
    try {
      const payload = {
        ...deckForm,
        title: deckForm.title.trim(),
        description: deckForm.description.trim(),
        category: deckForm.category.trim(),
        tags: deckForm.tags.trim(),
        difficulty_level: deckForm.difficulty_level || null,
      }

      if (!selectedDeck) {
        // Creating new
        const res = await createDeck(payload)
        showToast('Deck created!')
        await fetchDecks()
        // Select newly created deck from updated list
        const fresh = await getUserDecks({ per_page: 100 })
        setDecks(fresh.decks || [])
        const created = (fresh.decks || []).find((d) => d.id === res.deck.id)
        if (created) handleSelectDeck(created)
      } else {
        // Editing existing
        await updateDeck(selectedDeck.id, payload)
        showToast('Deck updated!')
        const updated = { ...selectedDeck, ...payload }
        setSelectedDeck(updated)
        setDecks((prev) => prev.map((d) => (d.id === selectedDeck.id ? updated : d)))
      }
      setDeckForm(null)
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save deck', 'error')
    } finally {
      setDeckSaving(false)
    }
  }

  async function handleArchiveDeck() {
    if (!selectedDeck) return
    try {
      await updateDeck(selectedDeck.id, { is_archived: !selectedDeck.is_archived })
      const updated = { ...selectedDeck, is_archived: !selectedDeck.is_archived }
      setSelectedDeck(updated)
      setDecks((prev) => prev.map((d) => (d.id === selectedDeck.id ? updated : d)))
      showToast(updated.is_archived ? 'Deck archived' : 'Deck restored')
    } catch {
      showToast('Failed to update deck', 'error')
    }
  }

  async function handleDeleteDeck() {
    try {
      await deleteDeck(selectedDeck.id)
      setDecks((prev) => prev.filter((d) => d.id !== selectedDeck.id))
      setSelectedDeck(null)
      setFlashcards([])
      showToast('Deck deleted')
    } catch {
      showToast('Failed to delete deck', 'error')
    } finally {
      setConfirmDelete(null)
    }
  }


  // this handles adding a new flashcard to the selected deck, 
  // and then refreshes the list of flashcards to include the newly added one. 
  // It also shows a toast notification for success or failure.

  async function handleAddCard(form) {
    try {
      await addFlashcard(selectedDeck.id, form)
      // Fetch updated list with page size of 100
      const updated = await getDeckFlashcards(selectedDeck.id, { per_page: 100 })
      setFlashcards(updated.flashcards || [])
      setShowNewCardForm(false)
      showToast('Card added!')
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to add card', 'error')
    }
  }

  async function handleSaveCard(cardId, form) {
    try {
      await updateFlashcard(cardId, form)
      setFlashcards((prev) => prev.map((c) => (c.id === cardId ? { ...c, ...form } : c)))
      showToast('Card updated!')
    } catch {
      showToast('Failed to update card', 'error')
    }
  }

  async function handleDeleteCard(cardId) {
    try {
      await deleteFlashcard(cardId)
      setFlashcards((prev) => prev.filter((c) => c.id !== cardId))
      showToast('Card deleted')
    } catch {
      showToast('Failed to delete card', 'error')
    } finally {
      setConfirmDelete(null)
    }
  }

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Decks' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Confirm dialog */}
      {confirmDelete && (
        <ConfirmDialog
          message={
            confirmDelete.type === 'deck'
              ? `Delete "${selectedDeck?.title}"? This will permanently remove all its flashcards.`
              : 'Delete this flashcard? This cannot be undone.'
          }
          onConfirm={() =>
            confirmDelete.type === 'deck'
              ? handleDeleteDeck()
              : handleDeleteCard(confirmDelete.id)
          }
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">My Decks</h1>
          <button
            onClick={startNewDeck}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition shadow-sm"
          >
            <Plus size={16} /> New Deck
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* ── Left panel..the deck list  */}
          <DeckListPanel
            decks={decks}
            loadingDecks={loadingDecks}
            selectedDeck={selectedDeck}
            onSelectDeck={handleSelectDeck}
          />

          {/* The Right panel for deck editor or new deck form */}
          <div className="flex-1 min-w-0">

            {/* No selection and not creating new */}
            {!selectedDeck && !deckForm && (
              <div className="flex flex-col items-center justify-center h-80 bg-white rounded-2xl border border-dashed border-slate-200">
                <ChevronRight size={28} className="text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium text-sm">Select a deck to edit</p>
                <p className="text-slate-400 text-xs mt-1">or click "New Deck" to create one</p>
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