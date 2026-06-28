import { ShieldAlert, X } from 'lucide-react'

function AccessDeniedBanner({ message, onClose }) {
  if (!message) return null

  return (
    <div className="fixed top-6 right-6 z-[60] bg-zinc-900 border border-orange-500/30 text-zinc-100 rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3 max-w-sm">
      <ShieldAlert size={18} className="text-orange-400 shrink-0" />
      <p className="text-sm flex-1">{message}</p>
      <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition shrink-0">
        <X size={16} />
      </button>
    </div>
  )
}

export default AccessDeniedBanner