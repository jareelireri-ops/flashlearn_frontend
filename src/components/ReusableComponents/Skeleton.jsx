import { Search } from 'lucide-react'

function Skeleton({ className = '', rounded = 'rounded' }) {
  return <div className={`bg-slate-200 animate-pulse ${rounded} ${className}`} />
}

export function ScanLens({ color = 'red' }) {
  return (
    <div className="scan-lens absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <span className={`absolute -inset-2 rounded-full bg-${color}-400/40 animate-ping`} />
      <span className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-${color}-500 shadow-lg`}>
        <Search className="h-5 w-5 text-white" />
      </span>
    </div>
  )
}

export function ScanningSkeletonGrid({ count = 6 }) {
  return (
    <div className="relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-100 bg-white p-4 space-y-3">
            <Skeleton className="h-24 w-full" rounded="rounded-lg" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
      <ScanLens />
    </div>
  )
}

export default Skeleton