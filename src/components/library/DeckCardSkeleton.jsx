function DeckCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-3 w-16 bg-slate-200 rounded" />
        <div className="h-4 w-12 bg-slate-200 rounded-full" />
      </div>
      <div className="h-4 w-3/4 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-full bg-slate-100 rounded mb-1" />
      <div className="h-3 w-2/3 bg-slate-100 rounded mb-4" />
      <div className="flex items-center justify-between">
        <div className="h-3 w-14 bg-slate-200 rounded" />
        <div className="h-3 w-10 bg-slate-200 rounded" />
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2" />
    </div>
  )
}

export default DeckCardSkeleton