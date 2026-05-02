import SearchBar from "../components/SearchBar"
import FiltersBar from "../components/FiltersBar"
import Section from "../components/Section"
import QuickContacts from "../components/QuickContacts"
import ProfilePanel from "../components/ProfilePanel"
import AdminPanel from "../components/AdminPanel"
import { useEffect, useMemo, useState } from 'react'
import {
  AREAS,
  AVAILABILITY_OPTIONS,
  CATEGORIES,
  EXPERIENCE_OPTIONS,
  REVIEWS,
  SORT_OPTIONS,
  STATS,
  WORKERS,
} from '../data/mockData'

const USER_AREA = 'College Road'

const experienceRanges = {
  '0-2 years': [0, 2],
  '3-5 years': [3, 5],
  '6-9 years': [6, 9],
  '10+ years': [10, 99],
}

function sortWorkers(list, sortBy) {
  const sorted = [...list]
  if (sortBy === 'Top rated') sorted.sort((a, b) => b.rating - a.rating)
  else if (sortBy === 'Most contacted') sorted.sort((a, b) => b.completedJobs - a.completedJobs)
  else if (sortBy === 'Recently added') sorted.sort((a, b) => a.id - b.id)
  return sorted
}

export default function HomePage({
  query,
  onQueryChange,
  suggestions,
  onSuggestionSelect,
  selectedWorker,
  setSelectedWorker,
  reviewsData,
  setReviewsData,
  reviewForm,
  setReviewForm,
  favorites,
  setFavorites,
  recentlyViewed,
  setRecentlyViewed,
  isLoading,
}) {
  const [category, setCategory] = useState('')
  const [area, setArea] = useState(USER_AREA)
  const [availability, setAvailability] = useState('')
  const [minRating, setMinRating] = useState('')
  const [experience, setExperience] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('Top rated')

  const filteredWorkers = useMemo(() => {
    return sortWorkers(
      WORKERS.filter((worker) => {
        const matchesCategory = !category || worker.category === category
        const matchesArea = !area || worker.area === area
        const matchesAvailability =
          !availability || worker.availability === availability
        const matchesRating = !minRating || worker.rating >= Number(minRating)
        const matchesVerified = !verifiedOnly || worker.verified
        const matchesExperience =
          !experience ||
          (experienceRanges[experience] &&
            worker.years >= experienceRanges[experience][0] &&
            worker.years <= experienceRanges[experience][1])
        const lowered = query.toLowerCase()
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
    onQueryChange(item)
    if (CATEGORIES.includes(item)) {
      setCategory(item)
    }
    if (AREAS.includes(item)) {
      setArea(item)
    }
  }

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div className="mb-8 sm:mb-12 rounded-2xl sm:rounded-3xl bg-[#f5f5f5] p-6 sm:p-8">
          <p className="text-[12px] sm:text-[14px] font-semibold uppercase tracking-widest text-slate-600 mb-2 sm:mb-4">
            Haroonabad local services
          </p>
          <h2 className="text-[32px] sm:text-[42px] font-bold leading-tight text-black mb-4 sm:mb-6">
            Find premium workers in your area
          </h2>
          <SearchBar
            query={query}
            onChange={onQueryChange}
            suggestions={suggestions}
            onSuggestionSelect={handleSuggestionSelect}
          />
        </div>

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

        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          <div className="space-y-8 sm:space-y-12">
            {filteredWorkers.length > 0 ? (
              <>
                <Section
                  title="Search results"
                  workers={filteredWorkers}
                  onOpen={handleOpenProfile}
                  onToggleFavorite={handleToggleFavorite}
                  favorites={favorites}
                  isLoading={isLoading}
                />
                {favoriteWorkers.length > 0 && (
                  <Section
                    title="Your favorites"
                    workers={favoriteWorkers}
                    onOpen={handleOpenProfile}
                    onToggleFavorite={handleToggleFavorite}
                    favorites={favorites}
                  />
                )}
                {recentWorkers.length > 0 && (
                  <Section
                    title="Recently viewed"
                    workers={recentWorkers}
                    onOpen={handleOpenProfile}
                    onToggleFavorite={handleToggleFavorite}
                    favorites={favorites}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg font-semibold text-slate-600">
                  No workers found. Try adjusting your filters.
                </p>
              </div>
            )}

            {featured.length > 0 && (
              <Section
                title="Featured"
                workers={featured}
                onOpen={handleOpenProfile}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            )}
            {topRated.length > 0 && (
              <Section
                title="Top rated"
                workers={topRated}
                onOpen={handleOpenProfile}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            )}
            {recentlyJoined.length > 0 && (
              <Section
                title="Recently joined"
                workers={recentlyJoined}
                onOpen={handleOpenProfile}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            )}
            {mostContacted.length > 0 && (
              <Section
                title="Most contacted"
                workers={mostContacted}
                onOpen={handleOpenProfile}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            )}
            {nearYou.length > 0 && (
              <Section
                title={`Near you (${USER_AREA})`}
                workers={nearYou}
                onOpen={handleOpenProfile}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:h-fit">
            {selectedWorker && (
              <ProfilePanel
                worker={selectedWorker}
                onClose={() => setSelectedWorker(null)}
                reviews={profileReviews}
                onReviewChange={handleReviewChange}
                onReviewSubmit={handleReviewSubmit}
                reviewForm={reviewForm}
              />
            )}
            <QuickContacts workers={recentWorkers} />
            <AdminPanel />
          </aside>
        </div>
      </main>
    </div>
  );
}
