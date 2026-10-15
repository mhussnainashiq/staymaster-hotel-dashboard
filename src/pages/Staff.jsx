import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const empty = { name: '', role: 'Front Desk', email: '', phone: '', shift: 'Morning', status: 'active' }

export default function Staff() {
  const { state, dispatch } = useApp()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)

  const openAdd = () => { setForm(empty); setModal('add') }
  const openEdit = (s) => { setForm({ ...s }); setModal(s) }
  const close = () => setModal(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (modal === 'add') dispatch({ type: 'ADD_STAFF', payload: form })
    else dispatch({ type: 'UPDATE_STAFF', payload: form })
    close()
  }

  return (
    <div>
      <div className="toolbar">
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Staff</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Role</th><th>Email</th><th>Phone</th><th>Shift</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {state.staff.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.role}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>{s.shift}</td>
                  <td><span className={`badge badge-${s.status === 'active' ? 'success' : 'muted'}`}>{s.status}</span></td>
                  <td>
                    <button className="btn-icon" onClick={() => openEdit(s)}><Pencil size={16} /></button>
                    <button className="btn-icon" onClick={() => { if (window.confirm('Delete?')) dispatch({ type: 'DELETE_STAFF', payload: s.id }) }}><Trash2 size={16} /></button>
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
            <div className="modal-header">{modal === 'add' ? 'Add Staff' : 'Edit Staff'}<button className="btn-icon" onClick={close}><X size={20} /></button></div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group"><label>Name</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                  <div className="form-group"><label>Role</label>
                    <select className="form-control" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                      <option>Front Desk</option><option>Housekeeping</option><option>Maintenance</option><option>Manager</option><option>Room Service</option>
                    </select>
                  </div>
                  <div className="form-group"><label>Email</label><input type="email" className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                  <div className="form-group"><label>Phone</label><input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                  <div className="form-group"><label>Shift</label>
                    <select className="form-control" value={form.shift} onChange={e => setForm({ ...form, shift: e.target.value })}>
                      <option>Morning</option><option>Day</option><option>Evening</option><option>Night</option>
                    </select>
                  </div>
                  <div className="form-group"><label>Status</label>
                    <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option value="active">Active</option><option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
