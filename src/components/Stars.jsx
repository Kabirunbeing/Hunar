export default function Stars({ rating }) {
  const rounded = Math.round(rating * 10) / 10
  return (
    <div
      className="flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
      aria-label={`Rated ${rounded} out of 5`}
    >
      <svg
        className="h-4 w-4 fill-amber-500"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" />
      </svg>
      <span>{rounded}</span>
    </div>
  )
}
