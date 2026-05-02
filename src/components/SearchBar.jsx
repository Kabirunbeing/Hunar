export default function SearchBar({
  query,
  onChange,
  suggestions,
  onSuggestionSelect,
}) {
  return (
    <div className="relative rounded-[24px] sm:rounded-3xl border border-slate-200 bg-white/80 p-2.5 sm:p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="relative flex items-center">
        <svg className="absolute left-3.5 sm:left-4 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          placeholder="Search by worker or service..."
          value={query}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Search services"
          className="w-full rounded-[18px] sm:rounded-xl border border-slate-200 bg-white pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-[14px] sm:text-sm text-slate-700 outline-none transition focus:border-black focus:ring-4 focus:ring-slate-100"
        />
      </div>
      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-[60] mt-3 grid gap-1.5 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-2xl">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              className="rounded-xl px-3 py-2.5 text-left text-[13px] sm:text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-black flex items-center gap-3"
              onClick={() => onSuggestionSelect(item)}
            >
              <svg className="h-3.5 w-3.5 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
