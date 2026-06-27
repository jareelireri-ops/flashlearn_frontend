// a reusable reusable confirmation function
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
        <p className="text-slate-800 font-medium mb-5">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-xl transition"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-xl transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog