import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { UIContext } from '../../context/UIContext'

function CallToAction2() {
  const { user } = useContext(AuthContext)
  const { openAuthModal } = useContext(UIContext)

  return (
    <section className="bg-slate-900 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold">Ready to start learning?</h3>
          <p className="text-slate-400 mt-1">Join FlashLearn today. It's free.</p>
        </div>
        {!user && (
          <button
            onClick={() => openAuthModal('register')}
            className="px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium transition shrink-0"
          >
            Start Now →
          </button>
        )}
      </div>
    </section>
  )
}

export default CallToAction2