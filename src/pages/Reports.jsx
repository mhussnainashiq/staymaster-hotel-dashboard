import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp } from '../context/AppContext'

export default function Reports() {
  const { state } = useApp()

  const stats = useMemo(() => {
    const occupied = state.rooms.filter(r => r.status === 'occupied').length
    const occupancy = state.rooms.length ? ((occupied / state.rooms.length) * 100).toFixed(1) : 0
    const totalRevenue = state.bills.reduce((s, b) => s + b.total, 0)
    const paidRevenue = state.bills.reduce((s, b) => s + (b.paidAmount || 0), 0)
    const avgRate = state.rooms.length ? (state.rooms.reduce((s, r) => s + r.rate, 0) / state.rooms.length).toFixed(0) : 0
    return { occupancy, totalRevenue, paidRevenue, avgRate, totalRooms: state.rooms.length, totalRes: state.reservations.length }
  }, [state])

  const typeData = useMemo(() => {
    const map = {}
    state.rooms.forEach(r => { map[r.type] = (map[r.type] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [state.rooms])

  return (
    <div>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-label">Occupancy</div><div className="kpi-value">{stats.occupancy}%</div></div>
        <div className="kpi-card"><div className="kpi-label">Total Revenue</div><div className="kpi-value">${stats.totalRevenue.toLocaleString()}</div></div>
        <div className="kpi-card"><div className="kpi-label">Paid Revenue</div><div className="kpi-value">${stats.paidRevenue.toLocaleString()}</div></div>
        <div className="kpi-card"><div className="kpi-label">Avg. Room Rate</div><div className="kpi-value">${stats.avgRate}</div></div>
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">Rooms by Type</div>
        <div className="card-body" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Bar dataKey="value" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <div className="card-header">Summary</div>
        <div className="card-body">
          <p>Total rooms: <strong>{stats.totalRooms}</strong></p>
          <p>Total reservations: <strong>{stats.totalRes}</strong></p>
          <p>Total guests in system: <strong>{state.guests.length}</strong></p>
          <p>Staff members: <strong>{state.staff.length}</strong></p>
        </div>
      </div>
    </div>
  )
}
