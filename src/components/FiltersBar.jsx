export default function FiltersBar({
  category,
  onCategoryChange,
  area,
  onAreaChange,
  availability,
  onAvailabilityChange,
  minRating,
  onMinRatingChange,
  experience,
  onExperienceChange,
  verifiedOnly,
  onVerifiedChange,
  sortBy,
  onSortChange,
  categories,
  areas,
  availabilityOptions,
  experienceOptions,
  sortOptions,
}) {
  return (
    <div className="mb-8 mt-8 sm:mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#eee] pb-4 sm:pb-4 gap-4">
      <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-3 sm:gap-6">
        <label className="relative flex items-center rounded-full bg-[#f5f5f5] p-1">
          <select
            id="category"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="w-full appearance-none rounded-full bg-white py-1 sm:py-1.5 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[11px] sm:text-[13px] font-bold text-black shadow-sm outline-none cursor-pointer"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-3 h-4 w-4 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </label>

        <div className="flex items-center gap-6 text-[14px] font-bold text-[#999]">
          <select
            id="area"
            value={area}
            onChange={(event) => onAreaChange(event.target.value)}
            className="appearance-none bg-transparent hover:text-black outline-none cursor-pointer pr-4"
          >
            {areas.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            id="availability"
            value={availability}
            onChange={(event) => onAvailabilityChange(event.target.value)}
            className="appearance-none bg-transparent hover:text-black outline-none cursor-pointer pr-4"
          >
            {availabilityOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            id="experience"
            value={experience}
            onChange={(event) => onExperienceChange(event.target.value)}
            className="appearance-none bg-transparent hover:text-black outline-none cursor-pointer pr-4"
          >
            {experienceOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-6 text-[14px] font-bold text-[#999]">
        <label className="flex items-center gap-2 cursor-pointer hover:text-black">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(event) => onVerifiedChange(event.target.checked)}
            className="h-4 w-4 rounded border-[#ccc] text-black focus:ring-black accent-black"
          />
          Verified only
        </label>

        <div className="flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="4" cy="4" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="20" cy="20" r="2"/><path strokeDasharray="2,2" d="M12 4v0c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8"/></svg>
          <select
            id="sort"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            className="appearance-none bg-transparent text-black outline-none cursor-pointer"
          >
            {sortOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
