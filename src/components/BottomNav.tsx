import { NavLink } from 'react-router-dom'
import { Home, Heart, User, List, PlusCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const tenantTabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/saved', label: 'Saved', icon: Heart },
  { to: '/profile', label: 'Profile', icon: User },
]

const landlordTabs = [
  { to: '/listings', label: 'My Listing', icon: List },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function BottomNav() {
  const { role } = useAuth()
  const tabs = role === 'landlord' ? landlordTabs : tenantTabs

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-surface border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-md flex">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-2.5 text-xs ${
                isActive ? 'text-primary-soft' : 'text-muted'
              }`
            }
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}