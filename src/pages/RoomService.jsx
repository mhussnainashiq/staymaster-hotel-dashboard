import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function RoomService() {
  const { state, dispatch } = useApp()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ roomId: '', guestId: '', items: '', total: 0, notes: '' })

  const updateStatus = (item, status) => {
    dispatch({ type: 'UPDATE_ROOM_SERVICE', payload: { ...item, status } })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.roomId || !form.items) return
    dispatch({
      type: 'ADD_ROOM_SERVICE',
      payload: {
        ...form,
        total: Number(form.total),
        status: 'pending',
        orderedAt: new Date().toISOString().slice(0, 16),
      }
    })
    setModal(false)
    setForm({ roomId: '', guestId: '', items: '', total: 0, notes: '' })
  }

  return (
    <div>
      <div className="toolbar">
        <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={18} /> New Order</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Room</th><th>Guest</th><th>Items</th><th>Total</th><th>Status</th><th>Ordered</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {state.roomService.map(s => {
                const room = state.rooms.find(r => r.id === s.roomId)
                const guest = state.guests.find(g => g.id === s.guestId)
                return (
                  <tr key={s.id}>
                    <td>{room?.number}</td>
                    <td>{guest?.name || '—'}</td>
                    <td>{s.items}</td>
                    <td>${s.total}</td>
                    <td>
                      <span className={`badge badge-${s.status === 'delivered' ? 'success' : s.status === 'preparing' ? 'info' : 'warning'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>{s.orderedAt?.replace('T', ' ')}</td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      {s.status === 'pending' && <button className="btn btn-sm btn-primary" onClick={() => updateStatus(s, 'preparing')}>Prepare</button>}
                      {s.status === 'preparing' && <button className="btn btn-sm btn-primary" onClick={() => updateStatus(s, 'delivered')}>Deliver</button>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">New Room Service Order <button className="btn-icon" onClick={() => setModal(false)}><X size={20} /></button></div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Room</label>
                    <select className="form-control" value={form.roomId} onChange={e => setForm({ ...form, roomId: e.target.value })} required>
                      <option value="">Select</option>
                      {state.rooms.filter(r => r.status === 'occupied').map(r => <option key={r.id} value={r.id}>{r.number}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Guest</label>
                    <select className="form-control" value={form.guestId} onChange={e => setForm({ ...form, guestId: e.target.value })}>
                      <option value="">Select</option>
                      {state.guests.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Items</label>
                    <textarea className="form-control" value={form.items} onChange={e => setForm({ ...form, items: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Total ($)</label>
                    <input type="number" className="form-control" value={form.total} onChange={e => setForm({ ...form, total: e.target.value })} min={0} />
                  </div>
                  <div className="form-group">
                    <label>Notes</label>
                    <input className="form-control" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Place Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
