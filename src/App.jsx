import { useEffect, useMemo, useState } from 'react'
import AdminPanel from './components/AdminPanel'
import FiltersBar from './components/FiltersBar'
import Hero from './components/Hero'
import ProfilePanel from './components/ProfilePanel'
import QuickContacts from './components/QuickContacts'
import Section from './components/Section'
import SkeletonCard from './components/SkeletonCard'
import WorkerCard from './components/WorkerCard'
import {
  AREAS,
  AVAILABILITY_OPTIONS,
  CATEGORIES,
  EXPERIENCE_OPTIONS,
  REVIEWS,
  SORT_OPTIONS,
  STATS,
  WORKERS,
} from './data/mockData'

const USER_AREA = 'College Road'

const experienceRanges = {
  '0-2 years': [0, 2],
  '3-5 years': [3, 5],
  '6-9 years': [6, 9],
  '10+ years': [10, 99],
}

function sortWorkers(list, sortBy) {
  const sorted = [...list]
  if (sortBy === 'Top rated') {
    sorted.sort((a, b) => b.rating - a.rating)
  } else if (sortBy === 'Most experienced') {
    sorted.sort((a, b) => b.years - a.years)
  } else if (sortBy === 'Recently added') {
    sorted.sort((a, b) => a.joinedDaysAgo - b.joinedDaysAgo)
  } else if (sortBy === 'Most contacted') {
    sorted.sort((a, b) => b.contacts - a.contacts)
  }
  return sorted
}

export default function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [area, setArea] = useState('All areas')
  const [availability, setAvailability] = useState('Any')
  const [minRating, setMinRating] = useState('Any')
  const [experience, setExperience] = useState('Any')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('Recommended')
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [reviewsData, setReviewsData] = useState(REVIEWS)
  const [reviewForm, setReviewForm] = useState({
    name: '',
    rating: '5',
    comment: '',
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  const suggestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (trimmed.length < 2) return []
    const pool = new Set()
    CATEGORIES.forEach((item) => pool.add(item))
    AREAS.forEach((item) => pool.add(item))
    WORKERS.forEach((worker) => {
      pool.add(worker.name)
      worker.skills.forEach((skill) => pool.add(skill))
    })
    return Array.from(pool)
      .filter((item) => item.toLowerCase().includes(trimmed))
      .slice(0, 6)
  }, [query])

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase()
    return sortWorkers(
      WORKERS.filter((worker) => {
        const matchesCategory = category === 'All' || worker.category === category
        const matchesArea = area === 'All areas' || worker.area === area
        const matchesAvailability =
          availability === 'Any' || worker.availability === availability
        const matchesRating =
          minRating === 'Any' || worker.rating >= Number(minRating)
        const matchesVerified = !verifiedOnly || worker.verified
        const matchesExperience =
          experience === 'Any' ||
          (experienceRanges[experience] &&
            worker.years >= experienceRanges[experience][0] &&
            worker.years <= experienceRanges[experience][1])
        const matchesQuery =
          !lowered ||
          worker.name.toLowerCase().includes(lowered) ||
          worker.category.toLowerCase().includes(lowered) ||
          worker.area.toLowerCase().includes(lowered) ||
          worker.skills.some((skill) => skill.toLowerCase().includes(lowered))
        return (
          matchesCategory &&
          matchesArea &&
          matchesAvailability &&
          matchesRating &&
          matchesVerified &&
          matchesExperience &&
          matchesQuery
        )
      }),
      sortBy,
    )
  }, [
    query,
    category,
    area,
    availability,
    minRating,
    verifiedOnly,
    experience,
    sortBy,
  ])

  const featured = WORKERS.filter((worker) => worker.featured)
  const topRated = sortWorkers(
    WORKERS.filter((worker) => worker.topRated),
    'Top rated',
  )
  const recentlyJoined = sortWorkers(
    WORKERS.filter((worker) => worker.recentlyJoined),
    'Recently added',
  )
  const mostContacted = sortWorkers(
    WORKERS.filter((worker) => worker.mostContacted),
    'Most contacted',
  )
  const nearYou = sortWorkers(
    WORKERS.filter((worker) => worker.area === USER_AREA),
    'Top rated',
  )

  const favoriteWorkers = WORKERS.filter((worker) =>
    favorites.includes(worker.id),
  )
  const recentWorkers = recentlyViewed
    .map((id) => WORKERS.find((worker) => worker.id === id))
    .filter(Boolean)

  const handleOpenProfile = (worker) => {
    setSelectedWorker(worker)
    setRecentlyViewed((prev) => {
      const next = [worker.id, ...prev.filter((id) => id !== worker.id)]
      return next.slice(0, 6)
    })
  }

  const handleToggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const handleReviewChange = (field, value) => {
    setReviewForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleReviewSubmit = (event) => {
    event.preventDefault()
    if (!selectedWorker || !reviewForm.comment.trim()) return
    const nextReview = {
      id: Date.now(),
      name: reviewForm.name || 'Guest',
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment,
      date: 'Just now',
    }
    setReviewsData((prev) => ({
      ...prev,
      [selectedWorker.id]: [nextReview, ...(prev[selectedWorker.id] || [])],
    }))
    setReviewForm({ name: '', rating: '5', comment: '' })
  }

  const profileReviews = selectedWorker
    ? reviewsData[selectedWorker.id] || []
    : []

  const handleSuggestionSelect = (item) => {
    setQuery(item)
    if (CATEGORIES.includes(item)) {
      setCategory(item)
    }
    if (AREAS.includes(item)) {
      setArea(item)
    }
  }

  const renderCards = (list) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))
        : list.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onOpen={handleOpenProfile}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.includes(worker.id)}
            />
          ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] text-slate-900">
      <Hero
        stats={STATS}
        categories={CATEGORIES}
        activeCategory={category}
        onCategoryChange={setCategory}
        query={query}
        onQueryChange={setQuery}
        suggestions={suggestions}
        onSuggestionSelect={handleSuggestionSelect}
      />

      <main className="mx-auto max-w-6xl px-6 pb-16">
        <FiltersBar
          category={category}
          onCategoryChange={setCategory}
          area={area}
          onAreaChange={setArea}
          availability={availability}
          onAvailabilityChange={setAvailability}
          minRating={minRating}
          onMinRatingChange={setMinRating}
          experience={experience}
          onExperienceChange={setExperience}
          verifiedOnly={verifiedOnly}
          onVerifiedChange={setVerifiedOnly}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categories={CATEGORIES}
          areas={AREAS}
          availabilityOptions={AVAILABILITY_OPTIONS}
          experienceOptions={EXPERIENCE_OPTIONS}
          sortOptions={SORT_OPTIONS}
        />

        <QuickContacts workers={recentWorkers} />

        {favoriteWorkers.length > 0 && (
          <Section
            title="Saved workers"
            subtitle="Quick access to your trusted professionals"
          >
            {renderCards(favoriteWorkers)}
          </Section>
        )}

        {recentWorkers.length > 0 && (
          <Section
            title="Recently viewed"
            subtitle="Pick up where you left off"
          >
            {renderCards(recentWorkers)}
          </Section>
        )}

        <Section
          title={`Near you in ${USER_AREA}`}
          subtitle="Fast discovery around your area"
        >
          {renderCards(nearYou)}
        </Section>

        <Section
          title="Featured workers"
          subtitle="Verified and hand-picked for quick response"
        >
          {renderCards(featured)}
        </Section>

        <Section
          title="Top rated professionals"
          subtitle="Highest trust and consistent quality"
        >
          {renderCards(topRated)}
        </Section>

        <Section
          title="Recently joined"
          subtitle="Fresh professionals ready to take new jobs"
        >
          {renderCards(recentlyJoined)}
        </Section>

        <Section
          title="Most contacted"
          subtitle="Popular picks based on recent demand"
        >
          {renderCards(mostContacted)}
        </Section>

        <Section
          title="All workers"
          subtitle={`${filtered.length} professionals match your filters`}
        >
          {renderCards(filtered)}
        </Section>

        <ProfilePanel
          worker={selectedWorker}
          reviews={profileReviews}
          onClose={() => setSelectedWorker(null)}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={selectedWorker ? favorites.includes(selectedWorker.id) : false}
          reviewForm={reviewForm}
          onReviewChange={handleReviewChange}
          onReviewSubmit={handleReviewSubmit}
        />

        <AdminPanel />
      </main>

      <footer className="mx-auto mb-10 mt-8 flex max-w-6xl flex-wrap items-center justify-between gap-4 rounded-3xl bg-slate-900 px-6 py-7 text-slate-200 shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
        <div>
          <h4 className="text-lg font-semibold">Hunar Connect</h4>
          <p className="text-sm text-slate-300">
            Built for Haroonabad to connect you with trusted local workers.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-full border border-slate-400/40 px-5 py-2 text-sm font-semibold text-slate-100 hover:border-slate-300">
            How it works
          </button>
          <button className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(249,115,22,0.35)] hover:-translate-y-0.5 transition">
            Post a job
          </button>
        </div>
      </footer>
    </div>
  )
}