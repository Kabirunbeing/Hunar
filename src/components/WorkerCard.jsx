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
    <article className="group overflow-hidden rounded-[24px] bg-[#f5f5f5] transition-transform duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] cursor-pointer" onClick={() => onOpen(worker)}>
      {/* Top Image Handle/Color Block (Mobbin card style) */}
      <div className="flex aspect-[4/3] w-full flex-col justify-between p-4 sm:p-6">
        <div className="flex items-start justify-between">
           <div className="flex items-center gap-2">
              <span className="rounded-full bg-white px-2.5 sm:px-3 py-1 font-semibold text-[11px] sm:text-[13px] text-black shadow-sm">
                {worker.category}
              </span>
           </div>
           <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite(worker.id)
              }}
              className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white transition hover:scale-105 shadow-sm ${
                isFavorite ? 'text-black' : 'text-[#999]'
              }`}
              type="button"
            >
              <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
           </button>
        </div>

        {/* Center Mock "Device" screen representing the worker profile visual */}
        <div className="mx-auto mt-auto flex h-[100px] sm:h-[140px] w-24 sm:w-32 items-center justify-center rounded-t-[20px] sm:rounded-t-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden">
           <div className="absolute top-2.5 sm:top-3 w-8 sm:w-10 h-1 sm:h-1.5 rounded-full bg-[#f0f0f0]" />
           <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black text-base sm:text-lg font-bold text-white uppercase">
             {initials}
           </div>
           <div className="absolute bottom-0 h-4 w-full bg-gradient-to-t from-black/5 to-transparent" />
        </div>
      </div>

      {/* Info Part */}
      <div className="bg-white p-4 sm:p-5 sm:px-6 pt-4 sm:pt-5 pb-5 sm:pb-6 min-h-[120px] sm:min-h-[140px] flex flex-col justify-between border-t border-[#f5f5f5]">
        <div>
          <div className="flex items-start justify-between gap-2">
             <h3 className="text-[15px] sm:text-[17px] font-bold text-black group-hover:underline decoration-2 underline-offset-4 leading-tight truncate">
               {worker.name}
             </h3>
             <div className="shrink-0 scale-90 sm:scale-100 flex items-center">
               <Stars rating={worker.rating} />
             </div>
          </div>
          <p className="mt-1 text-[13px] sm:text-[14px] font-medium text-[#666]">
            {worker.area}
          </p>
        </div>
        
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
           <Badge label={worker.availability} variant="availability" />
           <span className="rounded-full bg-[#f5f5f5] px-2.5 sm:px-3 py-1 text-[11px] sm:text-[13px] font-medium text-[#666]">
              {worker.years} yrs exp
           </span>
        </div>
      </div>
    </article>
  )
}
