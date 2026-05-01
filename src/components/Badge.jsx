const variants = {
  verified: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  availability: 'border-sky-200 bg-sky-50 text-sky-700',
  default: 'border-slate-200 bg-slate-100 text-slate-700',
}

export default function Badge({ label, variant }) {
  const style = variants[variant] || variants.default
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {label}
    </span>
  )
}
