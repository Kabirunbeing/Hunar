import SearchBar from "./SearchBar"

export default function Hero({
  stats,
  categories,
  activeCategory,
  onCategoryChange,
  query,
  onQueryChange,
  suggestions,
  onSuggestionSelect,
}) {
  return (
    <header className="bg-white text-slate-900 pb-16 font-['Inter',sans-serif]">
      {/* Top Navbar */}
      <div className="flex justify-center pt-8">
        <nav className="flex items-center gap-12 rounded-full bg-[#f8f8f8] px-8 py-3">
          <div className="flex items-center gap-2 font-extrabold tracking-tight text-[22px]">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <g transform="skewX(-12) translate(4, 0)">
                <rect x="2" y="6" width="7" height="20" rx="1.5" />
                <rect x="19" y="6" width="7" height="20" rx="1.5" />
                <rect x="5" y="12.5" width="20" height="7" rx="1.5" />
              </g>
            </svg>
            Hunar Connect
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-700">
            <a href="#" className="hover:text-black transition">Workers</a>
            <a href="#" className="hover:text-black transition">Services</a>
            <a href="#" className="hover:text-black transition">Log in</a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 pt-24 text-center">
        <h1 className="text-[64px] font-bold leading-[1.05] tracking-tight text-black sm:text-[76px]">
          Premium workers, ready in <br className="hidden sm:block" /> minutes.
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-[20px] text-slate-500">
          Search by service, skill, or area. Trusted professionals with instant contact — Haroonabad local services.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button className="rounded-full bg-[#111] px-6 py-3.5 text-[15px] font-medium text-white transition hover:bg-black">
            Find a worker
          </button>
          <button className="rounded-full border border-slate-200 bg-white px-6 py-3.5 text-[15px] font-medium text-slate-900 transition hover:bg-slate-50">
            Become a partner →
          </button>
        </div>

        <div className="mx-auto mt-16 max-w-2xl">
          <SearchBar
            query={query}
            onChange={onQueryChange}
            suggestions={suggestions}
            onSuggestionSelect={onSuggestionSelect}
          />
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
          {categories.map((item) => (
            <button
              key={item}
              className={`rounded-full px-5 py-2 text-[15px] font-medium transition ${
                activeCategory === item
                  ? "bg-[#111] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              onClick={() => onCategoryChange(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
