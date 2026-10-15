import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Housekeeping() {
  const { state, dispatch } = useApp()
  const [filter, setFilter] = useState('all')

  const list = filter === 'all' ? state.housekeeping : state.housekeeping.filter(h => h.status === filter)

  const updateStatus = (item, status) => {
    dispatch({ type: 'UPDATE_HOUSEKEEPING', payload: { ...item, status, updatedAt: new Date().toISOString().slice(0, 10) } })
    if (status === 'clean') {
      const room = state.rooms.find(r => r.id === item.roomId)
      if (room && room.status === 'available') {
        // already available
      }
    }
  }

  return (
    <div>
      <div className="toolbar">
        <select className="form-control" style={{ width: 160 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="clean">Clean</option>
          <option value="dirty">Dirty</option>
          <option value="in-progress">In Progress</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Room</th><th>Status</th><th>Assigned To</th><th>Priority</th><th>Updated</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {list.map(h => {
                const room = state.rooms.find(r => r.id === h.roomId)
                return (
                  <tr key={h.id}>
                    <td><strong>{room?.number || '—'}</strong></td>
                    <td>
                      <span className={`badge badge-${h.status === 'clean' ? 'success' : h.status === 'dirty' ? 'danger' : h.status === 'in-progress' ? 'info' : 'warning'}`}>
                        {h.status}
                      </span>
                    </td>
                    <td>{h.assignedTo}</td>
                    <td>{h.priority}</td>
                    <td>{h.updatedAt}</td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      {h.status !== 'clean' && <button className="btn btn-sm btn-primary" onClick={() => updateStatus(h, 'clean')}>Mark Clean</button>}
                      {h.status !== 'dirty' && <button className="btn btn-sm btn-secondary" onClick={() => updateStatus(h, 'dirty')}>Mark Dirty</button>}
                      {h.status !== 'in-progress' && <button className="btn btn-sm btn-secondary" onClick={() => updateStatus(h, 'in-progress')}>In Progress</button>}
                    </td>
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
