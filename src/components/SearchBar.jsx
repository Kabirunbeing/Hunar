export default function SearchBar({
  query,
  onChange,
  suggestions,
  onSuggestionSelect,
}) {
  return (
    <div className="relative rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur">
      <input
        type="search"
        placeholder="Search by service, skill, or area"
        value={query}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Search services"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-10 mt-3 grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-600 transition hover:-translate-y-0.5 hover:border-emerald-400/60"
              onClick={() => onSuggestionSelect(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
