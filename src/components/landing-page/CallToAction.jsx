import { UserPlus, FolderOpen, Layers, TrendingUp } from 'lucide-react'

const STEPS = [
  {
    num: '01',
    icon: UserPlus,
    title: 'Create your account',
    desc: 'Sign up for free and get instant access to every public deck on FlashLearn.',
  },
  {
    num: '02',
    icon: FolderOpen,
    title: 'Pick a category',
    desc: 'Choose from Software Engineering, Philosophy, Biblical Studies, Business, or other categories you are interested in.',
  },
  {
    num: '03',
    icon: Layers,
    title: 'Open a deck',
    desc: 'Each category holds different decks, and every deck has a set of Q/A flashcards ready to study.',
  },
  {
    num: '04',
    icon: TrendingUp,
    title: 'Study & track progress',
    desc: 'Flip cards, rate your experience with the card, and spaced repetition resurfaces cards based on how you rated it.',
  },
]

function CallToAction() {
  return (
    <section className="relative bg-slate-900 text-white px-6 py-20 overflow-hidden">
      {/* Styling */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">FL</span>
          <h2 className="text-3xl md:text-4xl font-bold italic mt-2">How To Begin Studying With FlashLearn</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {STEPS.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.num}>
                <span className="text-4xl font-bold text-red-400/70">{step.num}</span>
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mt-3 mb-3">
                  <Icon size={18} className="text-white" />
                </div>
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <p className="text-slate-400 text-sm mt-2">{step.desc}</p>
              </div>
            )
          })}
        </div>

        {/* Scroll-alert syling for next section*/}
        <div className="mt-16 flex flex-col items-center text-slate-500 text-xs gap-1 animate-bounce">
          <span>Why use Flash Learn ?</span>
          <span>↓</span>
        </div>
      </div>
    </section>
  )
}

export default CallToAction