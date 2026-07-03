import { Brain, Clock, Zap, Pencil } from 'lucide-react'
// Dark ink pencils, tuned for a white background — kept very light so bg-white still reads as white
const PENCILS = [
  { top: '8%', left: '4%', rotate: -18, size: 70, opacity: 0.06 },
  { top: '75%', left: '90%', rotate: 22, size: 90, opacity: 0.06 },
  { top: '40%', left: '96%', rotate: -35, size: 60, opacity: 0.05 },
]
function SpacedRepetition() {
  return (
    <section className="relative py-20 bg-white border-b border-gray-100 overflow-hidden">
      {PENCILS.map((p, i) => (
        <Pencil
          key={i}
          className="absolute text-gray-900 pointer-events-none"
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
      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why FlashLearn Works</h2>
        <p className="text-gray-500 mb-12 max-w-2xl mx-auto text-lg">
          We use Spaced Repetition—a science-backed method that reminds you to review information at the exact moment you're about to forget it.
        </p>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div role="button" tabIndex={0} className="p-8 bg-red-50 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
            <Brain className="text-red-500 mb-4" size={40} />
            <h3 className="font-bold text-xl text-gray-900 mb-2">Active Recall</h3>
            <p className="text-gray-600">Testing yourself forces your brain to recall information, strengthening your memory far better than just re-reading notes.</p>
          </div>
          <div role="button" tabIndex={0} className="p-8 bg-red-50 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
            <Clock className="text-red-500 mb-4" size={40} />
            <h3 className="font-bold text-xl text-gray-900 mb-2">Smart Intervals</h3>
            <p className="text-gray-600">Rate how hard a card was. Hard cards reappear sooner, while easy ones are pushed back to match your learning pace.</p>
          </div>
          <div role="button" tabIndex={0} className="p-8 bg-red-50 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
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