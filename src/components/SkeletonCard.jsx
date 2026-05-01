export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-12 w-12 rounded-2xl bg-slate-200" />
      <div className="mt-4 h-3 w-24 rounded-full bg-slate-200" />
      <div className="mt-3 h-3 w-40 rounded-full bg-slate-200" />
      <div className="mt-3 flex gap-2">
        <div className="h-6 flex-1 rounded-full bg-slate-200" />
        <div className="h-6 flex-1 rounded-full bg-slate-200" />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="h-9 rounded-xl bg-slate-200" />
        <div className="h-9 rounded-xl bg-slate-200" />
      </div>
    </div>
  )
}
