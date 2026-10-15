import { useState, useMemo } from 'react'
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const emptyRoom = { number: '', type: 'Standard', floor: 1, rate: 100, status: 'available', capacity: 2, amenities: '', notes: '' }

export default function Rooms() {
  const { state, dispatch } = useApp()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [modal, setModal] = useState(null) // null | 'add' | room obj
  const [form, setForm] = useState(emptyRoom)
  const [error, setError] = useState('')

  const filtered = useMemo(() => {
    return state.rooms.filter(r => {
      const matchSearch = !search || r.number.includes(search) || r.type.toLowerCase().includes(search.toLowerCase())
      const matchStatus = filterStatus === 'all' || r.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [state.rooms, search, filterStatus])

  const openAdd = () => { setForm(emptyRoom); setError(''); setModal('add') }
  const openEdit = (room) => { setForm({ ...room }); setError(''); setModal(room) }
  const close = () => setModal(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.number.trim()) { setError('Room number is required'); return }
    if (form.rate < 0) { setError('Rate must be positive'); return }
    if (modal === 'add') {
      if (state.rooms.some(r => r.number === form.number.trim())) {
        setError('Room number already exists'); return
      }
      dispatch({ type: 'ADD_ROOM', payload: { ...form, number: form.number.trim(), rate: Number(form.rate), floor: Number(form.floor), capacity: Number(form.capacity) } })
    } else {
      dispatch({ type: 'UPDATE_ROOM', payload: { ...form, rate: Number(form.rate), floor: Number(form.floor), capacity: Number(form.capacity) } })
    }
    close()
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this room?')) dispatch({ type: 'DELETE_ROOM', payload: id })
  }

  return (
    <div>
      <div className="toolbar">
        <div className="search-wrap">
          <Search size={16} />
          <input className="search-input form-control" placeholder="Search rooms..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-control" style={{ width: 140 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Room</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Number</th>
                <th>Type</th>
                <th>Floor</th>
                <th>Rate</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="empty-state">No rooms found</td></tr>
              ) : filtered.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.number}</strong></td>
                  <td>{r.type}</td>
                  <td>{r.floor}</td>
                  <td>${r.rate}</td>
                  <td>{r.capacity}</td>
                  <td>
                    <span className={`badge badge-${r.status === 'available' ? 'success' : r.status === 'occupied' ? 'info' : 'warning'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon" onClick={() => openEdit(r)} aria-label="Edit"><Pencil size={16} /></button>
                    <button className="btn-icon" onClick={() => handleDelete(r.id)} aria-label="Delete"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              {modal === 'add' ? 'Add Room' : 'Edit Room'}
              <button className="btn-icon" onClick={close}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-error">{error}</div>}
                <div className="form-grid">
                  <div className="form-group">
                    <label>Room Number *</label>
                    <input className="form-control" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                      <option>Standard</option>
                      <option>Deluxe</option>
                      <option>Suite</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Floor</label>
                    <input type="number" className="form-control" value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })} min={1} />
                  </div>
                  <div className="form-group">
                    <label>Rate ($)</label>
                    <input type="number" className="form-control" value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} min={0} />
                  </div>
                  <div className="form-group">
                    <label>Capacity</label>
                    <input type="number" className="form-control" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} min={1} />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Amenities</label>
                    <input className="form-control" value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} placeholder="WiFi, TV, AC..." />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Notes</label>
                    <textarea className="form-control" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary">{modal === 'add' ? 'Add Room' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
