import { useState, useMemo } from 'react'
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const empty = { name: '', email: '', phone: '', idType: 'Passport', idNumber: '', address: '', notes: '' }

export default function Guests() {
  const { state, dispatch } = useApp()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return state.guests.filter(g => !search || g.name.toLowerCase().includes(q) || g.email.toLowerCase().includes(q) || g.phone.includes(search))
  }, [state.guests, search])

  const openAdd = () => { setForm(empty); setError(''); setModal('add') }
  const openEdit = (g) => { setForm({ ...g }); setError(''); setModal(g) }
  const close = () => setModal(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) { setError('Name and email are required'); return }
    if (modal === 'add') dispatch({ type: 'ADD_GUEST', payload: form })
    else dispatch({ type: 'UPDATE_GUEST', payload: form })
    close()
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this guest?')) dispatch({ type: 'DELETE_GUEST', payload: id })
  }

  return (
    <div>
      <div className="toolbar">
        <div className="search-wrap">
          <Search size={16} />
          <input className="search-input form-control" placeholder="Search guests..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Guest</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>ID Type</th><th>ID Number</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="empty-state">No guests found</td></tr>
              ) : filtered.map(g => (
                <tr key={g.id}>
                  <td><strong>{g.name}</strong></td>
                  <td>{g.email}</td>
                  <td>{g.phone}</td>
                  <td>{g.idType}</td>
                  <td>{g.idNumber}</td>
                  <td>
                    <button className="btn-icon" onClick={() => openEdit(g)}><Pencil size={16} /></button>
                    <button className="btn-icon" onClick={() => handleDelete(g.id)}><Trash2 size={16} /></button>
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
            <div className="modal-header">{modal === 'add' ? 'Add Guest' : 'Edit Guest'}<button className="btn-icon" onClick={close}><X size={20} /></button></div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-error">{error}</div>}
                <div className="form-grid">
                  <div className="form-group"><label>Name *</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                  <div className="form-group"><label>Email *</label><input type="email" className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
                  <div className="form-group"><label>Phone</label><input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                  <div className="form-group"><label>ID Type</label>
                    <select className="form-control" value={form.idType} onChange={e => setForm({ ...form, idType: e.target.value })}>
                      <option>Passport</option><option>Driver License</option><option>ID Card</option>
                    </select>
                  </div>
                  <div className="form-group"><label>ID Number</label><input className="form-control" value={form.idNumber} onChange={e => setForm({ ...form, idNumber: e.target.value })} /></div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Address</label><input className="form-control" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Notes</label><textarea className="form-control" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary">{modal === 'add' ? 'Add' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
