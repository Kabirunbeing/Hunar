import Badge from './Badge'
import Stars from './Stars'

const toneMap = {
  sunset: 'bg-gradient-to-br from-orange-500 to-rose-500',
  sky: 'bg-gradient-to-br from-sky-500 to-cyan-400',
  mint: 'bg-gradient-to-br from-emerald-500 to-lime-400',
  sand: 'bg-gradient-to-br from-amber-400 to-orange-400',
  rose: 'bg-gradient-to-br from-rose-500 to-pink-400',
  graphite: 'bg-gradient-to-br from-slate-800 to-slate-500',
  ocean: 'bg-gradient-to-br from-teal-600 to-emerald-400',
  copper: 'bg-gradient-to-br from-orange-600 to-amber-500',
}

export default function ProfilePanel({
  worker,
  reviews,
  onClose,
  onToggleFavorite,
  isFavorite,
  reviewForm,
  onReviewChange,
  onReviewSubmit,
}) {
  if (!worker) return null

  const initials = worker.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  const toneClass = toneMap[worker.avatarTone] || toneMap.sunset

  return (
    <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
      <button
        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300"
        onClick={onClose}
      >
        Back to listings
      </button>
      <div className="mt-6 grid gap-6">
        <div className="grid gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-semibold text-white ${toneClass}`}
              >
                {initials}
              </div>
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-emerald-600">
                  {worker.category}
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {worker.name}
                </h2>
                <p className="text-sm text-slate-500">
                  {worker.area}, Haroonabad
                </p>
              </div>
            </div>
            <Stars rating={worker.rating} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge label={worker.availability} variant="availability" />
            {worker.verified && <Badge label="Verified" variant="verified" />}
          </div>

          <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-4">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Experience
              </p>
              <span>{worker.years} years</span>
            </div>
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Response time
              </p>
              <span>{worker.responseTime}</span>
            </div>
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Completed jobs
              </p>
              <span>{worker.completedJobs}</span>
            </div>
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Contact
              </p>
              <span>{worker.phone}</span>
            </div>
          </div>

          <p className="text-sm text-slate-600">{worker.bio}</p>

          <div className="flex flex-wrap gap-2">
            {worker.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
              >
                {skill}
              </span>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Service areas
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {worker.serviceAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <a
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
              href={`https://wa.me/${worker.whatsapp.replace('+', '')}`}
              target="_blank"
              rel="noreferrer"
            >
              WA
              WhatsApp
            </a>
            <a
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
              href={`tel:${worker.phone}`}
            >
              TEL
              Call now
            </a>
            <button
              className="rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-400"
              type="button"
            >
              Request service
            </button>
            <button
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                isFavorite
                  ? 'bg-emerald-600 text-white'
                  : 'border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
              type="button"
              onClick={() => onToggleFavorite(worker.id)}
            >
              {isFavorite ? 'Saved' : 'Save worker'}
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          <h3 className="text-lg font-semibold text-slate-900">Portfolio</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {worker.portfolio.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <span className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
                  Portfolio
                </span>
                <strong className="mt-2 block text-sm text-slate-900">
                  {item}
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <h3 className="text-lg font-semibold text-slate-900">Reviews</h3>
          {reviews.length === 0 ? (
            <p className="text-sm text-slate-500">No reviews yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                    <span>{review.name}</span>
                    <span>{review.rating}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
                  <span className="mt-3 block text-xs text-slate-400">
                    {review.date}
                  </span>
                </div>
              ))}
            </div>
          )}
          <form className="grid gap-3" onSubmit={onReviewSubmit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Your name"
                value={reviewForm.name}
                onChange={(event) => onReviewChange('name', event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <select
                value={reviewForm.rating}
                onChange={(event) => onReviewChange('rating', event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="5">5.0</option>
                <option value="4.5">4.5</option>
                <option value="4">4.0</option>
              </select>
            </div>
            <textarea
              placeholder="Share your experience"
              rows="3"
              value={reviewForm.comment}
              onChange={(event) => onReviewChange('comment', event.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <button
              className="w-fit rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400"
              type="submit"
            >
              Submit review
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
