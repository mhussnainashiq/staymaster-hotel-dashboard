import { useState, useMemo } from 'react'
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const emptyRes = { guestId: '', roomId: '', checkIn: '', checkOut: '', status: 'confirmed', adults: 1, children: 0, total: 0, notes: '' }

function datesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd
}

export default function Reservations() {
  const { state, dispatch } = useApp()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyRes)
  const [error, setError] = useState('')

  const filtered = useMemo(() => {
    return state.reservations.filter(r => {
      const guest = state.guests.find(g => g.id === r.guestId)
      const room = state.rooms.find(rm => rm.id === r.roomId)
      const q = search.toLowerCase()
      const matchSearch = !search || guest?.name.toLowerCase().includes(q) || room?.number.includes(search)
      const matchStatus = filterStatus === 'all' || r.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [state.reservations, state.guests, state.rooms, search, filterStatus])

  const openAdd = () => { setForm({ ...emptyRes, guestId: state.guests[0]?.id || '', roomId: state.rooms[0]?.id || '' }); setError(''); setModal('add') }
  const openEdit = (r) => { setForm({ ...r }); setError(''); setModal(r) }
  const close = () => setModal(null)

  const calcTotal = (roomId, checkIn, checkOut) => {
    const room = state.rooms.find(r => r.id === roomId)
    if (!room || !checkIn || !checkOut) return 0
    const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
    return nights * room.rate
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.guestId || !form.roomId || !form.checkIn || !form.checkOut) {
      setError('All required fields must be filled'); return
    }
    if (form.checkOut <= form.checkIn) {
      setError('Check-out must be after check-in'); return
    }
    // Conflict check
    const conflict = state.reservations.some(r => {
      if (modal !== 'add' && r.id === form.id) return false
      if (r.roomId !== form.roomId) return false
      if (r.status === 'cancelled' || r.status === 'checked-out') return false
      return datesOverlap(form.checkIn, form.checkOut, r.checkIn, r.checkOut)
    })
    if (conflict) {
      setError('This room is already booked for the selected dates'); return
    }
    const total = calcTotal(form.roomId, form.checkIn, form.checkOut)
    const payload = { ...form, total, adults: Number(form.adults), children: Number(form.children) }
    if (modal === 'add') {
      dispatch({ type: 'ADD_RESERVATION', payload: { ...payload, createdAt: new Date().toISOString().slice(0, 10) } })
    } else {
      dispatch({ type: 'UPDATE_RESERVATION', payload })
    }
    close()
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this reservation?')) dispatch({ type: 'DELETE_RESERVATION', payload: id })
  }

  return (
    <div>
      <div className="toolbar">
        <div className="search-wrap">
          <Search size={16} />
          <input className="search-input form-control" placeholder="Search by guest or room..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-control" style={{ width: 150 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked-in">Checked-in</option>
          <option value="checked-out">Checked-out</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> New Reservation</button>
      </div>

      <div className="card">
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="empty-state">No reservations found</td></tr>
              ) : filtered.map(r => {
                const guest = state.guests.find(g => g.id === r.guestId)
                const room = state.rooms.find(rm => rm.id === r.roomId)
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
                    <td>
                      <button className="btn-icon" onClick={() => openEdit(r)}><Pencil size={16} /></button>
                      <button className="btn-icon" onClick={() => handleDelete(r.id)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              {modal === 'add' ? 'New Reservation' : 'Edit Reservation'}
              <button className="btn-icon" onClick={close}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-error">{error}</div>}
                <div className="form-grid">
                  <div className="form-group">
                    <label>Guest *</label>
                    <select className="form-control" value={form.guestId} onChange={e => setForm({ ...form, guestId: e.target.value })} required>
                      <option value="">Select guest</option>
                      {state.guests.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Room *</label>
                    <select className="form-control" value={form.roomId} onChange={e => setForm({ ...form, roomId: e.target.value, total: calcTotal(e.target.value, form.checkIn, form.checkOut) })} required>
                      <option value="">Select room</option>
                      {state.rooms.map(r => <option key={r.id} value={r.id}>{r.number} — {r.type} (${r.rate}/night)</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Check-in *</label>
                    <input type="date" className="form-control" value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value, total: calcTotal(form.roomId, e.target.value, form.checkOut) })} required />
                  </div>
                  <div className="form-group">
                    <label>Check-out *</label>
                    <input type="date" className="form-control" value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value, total: calcTotal(form.roomId, form.checkIn, e.target.value) })} required />
                  </div>
                  <div className="form-group">
                    <label>Adults</label>
                    <input type="number" className="form-control" value={form.adults} onChange={e => setForm({ ...form, adults: e.target.value })} min={1} />
                  </div>
                  <div className="form-group">
                    <label>Children</label>
                    <input type="number" className="form-control" value={form.children} onChange={e => setForm({ ...form, children: e.target.value })} min={0} />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option value="confirmed">Confirmed</option>
                      <option value="checked-in">Checked-in</option>
                      <option value="checked-out">Checked-out</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Estimated Total</label>
                    <input className="form-control" value={`$${form.total || 0}`} readOnly />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Notes</label>
                    <textarea className="form-control" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary">{modal === 'add' ? 'Create' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
