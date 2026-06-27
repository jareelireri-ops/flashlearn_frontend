import { Brain, Clock, Zap } from 'lucide-react'

 function SpacedRepetition() {
  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why FlashLearn Works</h2>
        <p className="text-gray-500 mb-12 max-w-2xl mx-auto text-lg">
       We use Spaced Repetition—a science-backed method that reminds you to review information at the exact moment you're about to forget it.
        </p>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="p-8 bg-red-50 rounded-2xl transition hover:shadow-lg">
            <Brain className="text-red-500 mb-4" size={40} />
            <h3 className="font-bold text-xl text-gray-900 mb-2">Active Recall</h3>
            <p className="text-gray-600">Testing yourself forces your brain to recall information, strengthening your memory far better than just re-reading notes.</p>
          </div>
          <div className="p-8 bg-red-50 rounded-2xl transition hover:shadow-lg">
            <Clock className="text-red-500 mb-4" size={40} />
            <h3 className="font-bold text-xl text-gray-900 mb-2">Smart Intervals</h3>
            <p className="text-gray-600">Rate how hard a card was. Hard cards reappear sooner, while easy ones are pushed back to match your learning pace.</p>
          </div>
          <div className="p-8 bg-red-50 rounded-2xl transition hover:shadow-lg">
            <Zap className="text-red-500 mb-4" size={40} />
            <h3 className="font-bold text-xl text-gray-900 mb-2">Learn Faster</h3>
            <p className="text-gray-600">Make the most of your study time by zeroing in on your weak spots and scheming past what you already know.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SpacedRepetition