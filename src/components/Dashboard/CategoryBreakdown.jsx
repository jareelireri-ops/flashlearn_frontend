function CategoryBreakdown({ collection }) {
  const colors = ['bg-blue-400', 'bg-emerald-400', 'bg-purple-400', 'bg-orange-400']

  const categoryCounts = {}
  collection.forEach((deck) => {
    const cat = deck.category || 'Uncategorized'
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  })

  const breakdown = collection.length === 0
    ? []
    : Object.keys(categoryCounts)
        .map((cat) => ({
          name: cat,
          pct: Math.round((categoryCounts[cat] / collection.length) * 100),
        }))
        .sort((a, b) => b.pct - a.pct)

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <h2 className="text-lg font-bold mb-6 relative z-10">Category Breakdown</h2>

      {breakdown.length > 0 ? (
        <div className="space-y-5 relative z-10">
          {breakdown.map((cat, idx) => (
            <div key={cat.name}>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">{cat.name}</span>
                <span>{cat.pct}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colors[idx % colors.length]} rounded-full`}
                  style={{ width: `${cat.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-400 text-center relative z-10">
          Add decks to your collection to see your breakdown.
        </div>
      )}
    </div>
  )
}

export default CategoryBreakdown