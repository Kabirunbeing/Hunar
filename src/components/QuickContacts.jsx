export default function QuickContacts({ workers }) {
  if (workers.length === 0) return null

  return (
    <div className="mb-8 grid gap-3">
      {workers.map((worker) => (
        <div
          key={worker.id}
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
        >
          <div>
            <strong className="text-sm text-slate-900">{worker.name}</strong>
            <span className="block text-xs text-slate-500">
              {worker.category}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold text-emerald-600">
            <a
              href={`https://wa.me/${worker.whatsapp.replace('+', '')}`}
              target="_blank"
              rel="noreferrer"
            >
              WA
            </a>
            <a href={`tel:${worker.phone}`}>Call</a>
          </div>
        </div>
      ))}
    </div>
  )
}
