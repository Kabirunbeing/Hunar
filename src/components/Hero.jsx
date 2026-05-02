import { useNavigate } from "react-router-dom"
import SearchBar from "./SearchBar"

export default function Hero({
  query,
  onQueryChange,
  suggestions,
  onSuggestionSelect,
}) {
  const navigate = useNavigate();

  return (
    <header className="bg-white text-slate-900 pb-16 font-['Inter',sans-serif]">
      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 pt-16 sm:pt-24 text-center">
        <h1 className="text-[40px] font-bold leading-[1.1] tracking-tight text-black sm:text-[76px]">
          Premium workers, ready in <br className="hidden sm:block" /> minutes.
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-[16px] sm:text-[20px] text-slate-500 px-4 sm:px-0">
          Search by service, skill, or area. Trusted professionals with instant contact — Haroonabad local services.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-8 sm:px-0">
          <button className="w-full sm:w-auto rounded-full bg-[#111] px-8 py-3.5 text-[15px] font-bold text-white transition hover:bg-black">
            Find a worker
          </button>
          <button 
            onClick={() => navigate('/apply')}
            className="w-full sm:w-auto rounded-full border border-slate-200 bg-white px-8 py-3.5 text-[15px] font-bold text-slate-900 transition hover:bg-slate-50"
          >
            Become a worker →
          </button>
        </div>

        <div className="mx-auto mt-12 sm:mt-16 max-w-2xl px-2 sm:px-0">
          <SearchBar
            query={query}
            onChange={onQueryChange}
            suggestions={suggestions}
            onSuggestionSelect={onSuggestionSelect}
          />
        </div>
      </div>
    </header>
  )
}
