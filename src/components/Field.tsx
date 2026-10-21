import type { InputHTMLAttributes } from 'react'

export default function Field({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm text-muted">{label}</span>
      <input
        {...props}
        className="mt-1 w-full rounded-xl bg-surface border border-border px-4 py-3 outline-none focus:border-primary"
      />
    </label>
  )
}