export default function AdminPanel() {
  return (
    <aside className="mt-12 rounded-3xl bg-[#f5f5f5] p-8 text-black">
      <h3 className="text-[24px] font-bold tracking-tight">Admin controls</h3>
      <p className="mt-2 text-[15px] font-medium text-[#666]">
        Manage trust and quality signals across the marketplace.
      </p>
      <ul className="mt-6 list-disc space-y-3 pl-5 text-[15px] font-medium text-[#666] marker:text-[#ccc]">
        <li>Verify workers and issue badges</li>
        <li>Feature top listings on the homepage</li>
        <li>Manage categories and service areas</li>
        <li>Moderate reviews and ratings</li>
      </ul>
      <button
        className="mt-8 rounded-full bg-black px-6 py-3.5 text-[15px] font-medium text-white transition hover:bg-[#222]"
        type="button"
      >
        Open admin console
      </button>
    </aside>
  )
}
