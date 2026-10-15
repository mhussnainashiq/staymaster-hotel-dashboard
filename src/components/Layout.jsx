import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BedDouble, CalendarDays, Users, LogIn,
  Sparkles, UtensilsCrossed, Receipt, UserCog, BarChart3,
  Settings, Menu, X, Moon, Sun, Hotel
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/rooms', icon: BedDouble, label: 'Rooms' },
  { to: '/reservations', icon: CalendarDays, label: 'Reservations' },
  { to: '/guests', icon: Users, label: 'Guests' },
  { to: '/check-in-out', icon: LogIn, label: 'Check-in / Out' },
  { to: '/housekeeping', icon: Sparkles, label: 'Housekeeping' },
  { to: '/room-service', icon: UtensilsCrossed, label: 'Room Service' },
  { to: '/billing', icon: Receipt, label: 'Billing' },
  { to: '/staff', icon: UserCog, label: 'Staff' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

const titles = {
  '/': 'Dashboard',
  '/rooms': 'Room Management',
  '/reservations': 'Reservations',
  '/guests': 'Guest Management',
  '/check-in-out': 'Check-in & Check-out',
  '/housekeeping': 'Housekeeping',
  '/room-service': 'Room Service',
  '/billing': 'Billing & Payments',
  '/staff': 'Staff Management',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { state, dispatch } = useApp()
  const location = useLocation()
  const title = titles[location.pathname] || 'StayMaster'

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' })
  }

  return (
    <div className="app-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <Hotel size={28} />
          <div>Stay<span>Master</span></div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="btn-icon menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="header-title">{title}</h1>
          </div>
          <div className="header-actions">
            <button className="btn-icon" onClick={toggleTheme} aria-label="Toggle theme">
              {state.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>
        <main className="page">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 90, background: 'rgba(0,0,0,0.3)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
