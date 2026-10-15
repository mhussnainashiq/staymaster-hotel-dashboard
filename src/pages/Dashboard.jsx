import { useMemo } from 'react'
import { BedDouble, CalendarCheck, Users, DollarSign, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useApp } from '../context/AppContext'

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Dashboard() {
  const { state } = useApp()
  const { rooms, reservations, guests, bills } = state

  const stats = useMemo(() => {
    const occupied = rooms.filter(r => r.status === 'occupied').length
    const available = rooms.filter(r => r.status === 'available').length
    const maintenance = rooms.filter(r => r.status === 'maintenance').length
    const occupancy = rooms.length ? Math.round((occupied / rooms.length) * 100) : 0
    const activeRes = reservations.filter(r => r.status === 'confirmed' || r.status === 'checked-in').length
    const revenue = bills.reduce((s, b) => s + (b.paidAmount || 0), 0)
    return { occupied, available, maintenance, occupancy, activeRes, revenue, totalRooms: rooms.length, totalGuests: guests.length }
  }, [rooms, reservations, guests, bills])

  const statusData = [
    { name: 'Available', value: stats.available },
    { name: 'Occupied', value: stats.occupied },
    { name: 'Maintenance', value: stats.maintenance },
  ]

  const bookingData = [
    { name: 'Mon', bookings: 4 },
    { name: 'Tue', bookings: 6 },
    { name: 'Wed', bookings: 5 },
    { name: 'Thu', bookings: 8 },
    { name: 'Fri', bookings: 12 },
    { name: 'Sat', bookings: 15 },
    { name: 'Sun', bookings: 10 },
  ]

  const recent = reservations.slice(0, 5)

  return (
    <div>
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon blue"><BedDouble size={22} /></div>
          <div className="kpi-label">Occupancy Rate</div>
          <div className="kpi-value">{stats.occupancy}%</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon green"><CalendarCheck size={22} /></div>
          <div className="kpi-label">Active Reservations</div>
          <div className="kpi-value">{stats.activeRes}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon orange"><Users size={22} /></div>
          <div className="kpi-label">Total Guests</div>
          <div className="kpi-value">{stats.totalGuests}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon red"><DollarSign size={22} /></div>
          <div className="kpi-label">Revenue (Paid)</div>
          <div className="kpi-value">${stats.revenue.toLocaleString()}</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="card">
          <div className="card-header">Weekly Bookings</div>
          <div className="card-body" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="bookings" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-header">Room Status</div>
          <div className="card-body" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Recent Reservations</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(r => {
                const guest = guests.find(g => g.id === r.guestId)
                const room = rooms.find(rm => rm.id === r.roomId)
                return (
                  <tr key={r.id}>
                    <td>{guest?.name || '—'}</td>
                    <td>{room?.number || '—'}</td>
                    <td>{r.checkIn}</td>
                    <td>{r.checkOut}</td>
                    <td>
                      <span className={`badge badge-${r.status === 'checked-in' ? 'success' : r.status === 'confirmed' ? 'info' : r.status === 'checked-out' ? 'muted' : 'warning'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>${r.total}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
