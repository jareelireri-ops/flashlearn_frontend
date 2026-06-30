function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="h-3 w-16 bg-slate-200 rounded" />
            <div className="h-7 w-12 bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 bg-slate-200 rounded" />
                  <div className="h-2 w-1/2 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="h-32 w-full bg-slate-100 rounded-xl" />
          </div>
        </div>

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-3 w-full bg-slate-100 rounded" />
              <div className="h-3 w-2/3 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardSkeleton