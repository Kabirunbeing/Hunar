import Badge from './Badge'
import Stars from './Stars'

export default function WorkerCard({
  worker,
  onOpen,
  onToggleFavorite,
  isFavorite,
}) {
  const initials = worker.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  return (
    <article className="group overflow-hidden rounded-[24px] bg-[#f5f5f5] transition-transform duration-300 hover:scale-[1.02] cursor-pointer" onClick={() => onOpen(worker)}>
      {/* Top Image Handle/Color Block (Mobbin card style) */}
      <div className="flex aspect-[4/3] w-full flex-col justify-between p-6">
        <div className="flex items-start justify-between">
           <div className="flex items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 font-semibold text-[13px] text-black shadow-sm">
                {worker.category}
              </span>
           </div>
           <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite(worker.id)
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-white transition hover:scale-105 shadow-sm ${
                isFavorite ? 'text-black' : 'text-[#999]'
              }`}
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
           </button>
        </div>

        {/* Center Mock "Device" screen representing the worker profile visual */}
        <div className="mx-auto mt-auto flex h-[140px] w-32 items-center justify-center rounded-t-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden">
           <div className="absolute top-3 w-10 h-1.5 rounded-full bg-[#f0f0f0]" />
           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-lg font-bold text-white">
             {initials}
           </div>
           <div className="absolute bottom-0 h-4 w-full bg-gradient-to-t from-black/5 to-transparent" />
        </div>
      </div>

      {/* Info Part */}
      <div className="bg-white p-5 px-6 pt-5 pb-6 min-h-[140px] flex flex-col justify-between border-t border-[#f5f5f5]">
        <div>
          <div className="flex items-start justify-between gap-2">
             <h3 className="text-[17px] font-bold text-black group-hover:underline decoration-2 underline-offset-4 leading-tight">
               {worker.name}
             </h3>
             <div className="shrink-0 flex items-center gap-1">
               <Stars rating={worker.rating} />
             </div>
          </div>
          <p className="mt-1.5 text-[14px] font-medium text-[#666]">
            {worker.area}
          </p>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
           <Badge label={worker.availability} variant="availability" />
           <span className="rounded-full bg-[#f5f5f5] px-3 py-1 text-[13px] font-medium text-[#666]">
              {worker.years} yrs exp
           </span>
        </div>
      </div>
    </article>
  )
}
