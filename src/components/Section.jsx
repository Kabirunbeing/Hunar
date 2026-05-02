import WorkerCard from './WorkerCard'

export default function Section({
  title,
  subtitle,
  children,
  action,
  workers = [],
  onOpen,
  onToggleFavorite,
  favorites = [],
}) {
  return (
    <section className="mt-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children ?? (
        <div className="grid gap-6 sm:grid-cols-2">
          {workers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onOpen={onOpen}
              onToggleFavorite={onToggleFavorite}
              isFavorite={favorites.includes(worker.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
