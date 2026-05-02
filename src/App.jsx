import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import BecomeWorkerPage from './pages/BecomeWorkerPage'
import AdminPage from './pages/AdminPage'
import { REVIEWS, CATEGORIES, AREAS } from './data/mockData'

export default function App() {
  const [query, setQuery] = useState('')
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
    return Array.from(pool)
      .filter((item) => item.toLowerCase().includes(trimmed))
      .slice(0, 6)
  }, [query])

  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-slate-900">
        <Navbar />
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/apply" element={<BecomeWorkerPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="/"
            element={
              <>
                <Hero
                  query={query}
                  onQueryChange={setQuery}
                  suggestions={suggestions}
                  onSuggestionSelect={(item) => {
                    setQuery(item)
                  }}
                />
                <HomePage
                  query={query}
                  onQueryChange={setQuery}
                  suggestions={suggestions}
                  onSuggestionSelect={(item) => setQuery(item)}
                  selectedWorker={selectedWorker}
                  setSelectedWorker={setSelectedWorker}
                  reviewsData={reviewsData}
                  setReviewsData={setReviewsData}
                  reviewForm={reviewForm}
                  setReviewForm={setReviewForm}
                  favorites={favorites}
                  setFavorites={setFavorites}
                  recentlyViewed={recentlyViewed}
                  setRecentlyViewed={setRecentlyViewed}
                  isLoading={isLoading}
                />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}
