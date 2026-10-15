import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Rooms from './pages/Rooms'
import Reservations from './pages/Reservations'
import Guests from './pages/Guests'
import CheckInOut from './pages/CheckInOut'
import Housekeeping from './pages/Housekeeping'
import RoomService from './pages/RoomService'
import Billing from './pages/Billing'
import Staff from './pages/Staff'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="guests" element={<Guests />} />
        <Route path="check-in-out" element={<CheckInOut />} />
        <Route path="housekeeping" element={<Housekeeping />} />
        <Route path="room-service" element={<RoomService />} />
        <Route path="billing" element={<Billing />} />
        <Route path="staff" element={<Staff />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
