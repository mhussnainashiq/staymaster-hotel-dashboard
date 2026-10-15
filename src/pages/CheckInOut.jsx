import { useState } from 'react'
import { LogIn, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function CheckInOut() {
  const { state, dispatch } = useApp()
  const [msg, setMsg] = useState('')

  const pendingCheckIn = state.reservations.filter(r => r.status === 'confirmed')
  const checkedIn = state.reservations.filter(r => r.status === 'checked-in')

  const doCheckIn = (res) => {
    dispatch({ type: 'UPDATE_RESERVATION', payload: { ...res, status: 'checked-in' } })
    dispatch({ type: 'UPDATE_ROOM', payload: { ...state.rooms.find(r => r.id === res.roomId), status: 'occupied' } })
    setMsg(`Checked in successfully for room ${state.rooms.find(r => r.id === res.roomId)?.number}`)
    setTimeout(() => setMsg(''), 3000)
  }

  const doCheckOut = (res) => {
    dispatch({ type: 'UPDATE_RESERVATION', payload: { ...res, status: 'checked-out' } })
    dispatch({ type: 'UPDATE_ROOM', payload: { ...state.rooms.find(r => r.id === res.roomId), status: 'available' } })
    // Create bill if not exists
    if (!state.bills.some(b => b.reservationId === res.id)) {
      const tax = res.total * 0.1
      dispatch({
        type: 'ADD_BILL',
        payload: {
          reservationId: res.id,
          guestId: res.guestId,
          roomCharges: res.total,
          serviceCharges: 0,
          tax,
          total: res.total + tax,
          status: 'open',
          paidAmount: 0,
          createdAt: new Date().toISOString().slice(0, 10),
        }
      })
    }
    setMsg(`Checked out successfully. Bill generated.`)
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div>
      {msg && <div className="alert alert-success">{msg}</div>}
      <div className="chart-grid">
        <div className="card">
          <div className="card-header"><LogIn size={18} style={{ marginRight: 8 }} /> Pending Check-ins</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Guest</th><th>Room</th><th>Check-in</th><th>Action</th></tr></thead>
              <tbody>
                {pendingCheckIn.length === 0 ? (
                  <tr><td colSpan={4} className="empty-state">No pending check-ins</td></tr>
                ) : pendingCheckIn.map(r => {
                  const guest = state.guests.find(g => g.id === r.guestId)
                  const room = state.rooms.find(rm => rm.id === r.roomId)
                  return (
                    <tr key={r.id}>
                      <td>{guest?.name}</td>
                      <td>{room?.number}</td>
                      <td>{r.checkIn}</td>
                      <td><button className="btn btn-primary btn-sm" onClick={() => doCheckIn(r)}>Check In</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><LogOut size={18} style={{ marginRight: 8 }} /> Currently Checked-in</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Guest</th><th>Room</th><th>Check-out</th><th>Action</th></tr></thead>
              <tbody>
                {checkedIn.length === 0 ? (
                  <tr><td colSpan={4} className="empty-state">No guests checked in</td></tr>
                ) : checkedIn.map(r => {
                  const guest = state.guests.find(g => g.id === r.guestId)
                  const room = state.rooms.find(rm => rm.id === r.roomId)
                  return (
                    <tr key={r.id}>
                      <td>{guest?.name}</td>
                      <td>{room?.number}</td>
                      <td>{r.checkOut}</td>
                      <td><button className="btn btn-secondary btn-sm" onClick={() => doCheckOut(r)}>Check Out</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
