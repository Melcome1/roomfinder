import { useState } from 'react'
import { Download, Share, X } from 'lucide-react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

const KEY = 'install-banner-dismissed'

export default function InstallBanner() {
  const { canInstall, showIosHelp, install } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(KEY) === '1' } catch { return false }
  })

  if (dismissed || (!canInstall && !showIosHelp)) return null

  const close = () => {
    setDismissed(true)
    try { localStorage.setItem(KEY, '1') } catch { /* ignore */ }
  }

  return (
    <div className="relative rounded-2xl bg-surface border border-border p-4 mb-4">
      <button onClick={close} aria-label="Dismiss" className="absolute right-3 top-3 text-muted">
        <X size={18} />
      </button>

      <div className="flex items-center gap-3 pr-6">
        <img src="/icon-192.png" alt="" className="size-12 rounded-xl" />
        <div>
          <p className="font-semibold">Install RoomFinder</p>
          <p className="text-sm text-muted">Add it to your home screen for quick access.</p>
        </div>
      </div>

      {canInstall ? (
        <button
          onClick={install}
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 font-semibold"
        >
          <Download size={18} /> Install app
        </button>
      ) : (
        <p className="mt-3 text-sm text-muted flex flex-wrap items-center gap-1">
          Tap <Share size={16} className="text-primary-soft" /> <b className="text-white">Share</b>, then
          <b className="text-white">Add to Home Screen</b>.
        </p>
      )}
    </div>
  )
}