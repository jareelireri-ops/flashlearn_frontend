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
    desc: 'Each category holds different decks, and every deck has a set of Q/A flashcards ready to use for your deeper study.',
  },
  {
    num: '04',
    icon: TrendingUp,
    title: 'Study & track progress',
    desc: 'Flip cards, rate your experience with the card, and spaced repetition resurfaces cards based on how you rated it.',
  },
]

// Scattered pencils design, tuned for a dark background (white ink, very low opacity)
//  use the link to a data URI so there is no need to have to ship an extra image file, and it can be repeated infinitely.
const PENCIL_FIELD = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='380' height='380' viewBox='0 0 380 380'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.045'%3E%3Cg transform='translate(30,40) rotate(24)'%3E%3Crect x='0' y='-6' width='96' height='12' rx='2'/%3E%3Crect x='96' y='-6' width='10' height='12'/%3E%3Cpolygon points='0,-6 0,6 -18,0'/%3E%3C/g%3E%3Cg transform='translate(240,70) rotate(-18)'%3E%3Crect x='0' y='-6' width='80' height='12' rx='2'/%3E%3Crect x='80' y='-6' width='9' height='12'/%3E%3Cpolygon points='0,-6 0,6 -16,0'/%3E%3C/g%3E%3Cg transform='translate(70,200) rotate(68)'%3E%3Crect x='0' y='-6' width='88' height='12' rx='2'/%3E%3Crect x='88' y='-6' width='9' height='12'/%3E%3Cpolygon points='0,-6 0,6 -16,0'/%3E%3C/g%3E%3Cg transform='translate(270,240) rotate(-52)'%3E%3Crect x='0' y='-6' width='92' height='12' rx='2'/%3E%3Crect x='92' y='-6' width='10' height='12'/%3E%3Cpolygon points='0,-6 0,6 -17,0'/%3E%3C/g%3E%3Cg transform='translate(150,310) rotate(10)'%3E%3Crect x='0' y='-6' width='76' height='12' rx='2'/%3E%3Crect x='76' y='-6' width='9' height='12'/%3E%3Cpolygon points='0,-6 0,6 -15,0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`

function CallToAction() {
  return (
    <section className="relative bg-slate-900 text-white px-6 py-20 overflow-hidden border-t-4 border-red-500">
      {/* Pencil texture.  */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: PENCIL_FIELD, backgroundRepeat: 'repeat', backgroundSize: '380px 380px' }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-red-500 uppercase tracking-[0.2em]">FL</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-3 leading-none">
            How To Begin <span className="text-red-500">Studying</span>
          </h2>
        
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.num} className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-4xl font-black text-red-500/80">{step.num}</span>
                  <span className="text-red-500/40 text-xs">✦</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-white" />
                </div>
                <h3 className="font-bold text-lg uppercase tracking-tight">{step.title}</h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">{step.desc}</p>

                {/* Connects steps like the ticker bar, hidden on the last card */}
                {i < STEPS.length - 1 && (
                  <span className="hidden md:block absolute top-[52px] -right-5 w-4 h-[2px] bg-red-500/30" />
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-16 flex flex-col items-center text-slate-500 text-xs gap-1 animate-bounce">
          <span>Why use Flash Learn ?</span>
          <span>↓</span>
        </div>
      </div>
    </section>
  )
}

export default CallToAction