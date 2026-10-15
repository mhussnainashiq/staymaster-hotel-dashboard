import { useApp } from '../context/AppContext'

export default function Billing() {
  const { state, dispatch } = useApp()

  const markPaid = (bill) => {
    dispatch({ type: 'UPDATE_BILL', payload: { ...bill, status: 'paid', paidAmount: bill.total } })
  }

  const printInvoice = (bill) => {
    const guest = state.guests.find(g => g.id === bill.guestId)
    const res = state.reservations.find(r => r.id === bill.reservationId)
    const room = state.rooms.find(r => r.id === res?.roomId)
    const win = window.open('', '_blank')
    win.document.write(`
      <html><head><title>Invoice #${bill.id}</title>
      <style>body{font-family:system-ui;padding:40px;max-width:600px;margin:0 auto}h1{color:#0ea5e9}table{width:100%;border-collapse:collapse;margin:20px 0}td,th{padding:8px;border-bottom:1px solid #ddd;text-align:left}.total{font-size:1.3rem;font-weight:bold}</style>
      </head><body>
      <h1>StayMaster Invoice</h1>
      <p><strong>Invoice #:</strong> ${bill.id}<br>
      <strong>Date:</strong> ${bill.createdAt}<br>
      <strong>Guest:</strong> ${guest?.name || '—'}<br>
      <strong>Room:</strong> ${room?.number || '—'}</p>
      <table>
        <tr><th>Description</th><th>Amount</th></tr>
        <tr><td>Room Charges</td><td>$${bill.roomCharges.toFixed(2)}</td></tr>
        <tr><td>Service Charges</td><td>$${bill.serviceCharges.toFixed(2)}</td></tr>
        <tr><td>Tax</td><td>$${bill.tax.toFixed(2)}</td></tr>
        <tr class="total"><td>Total</td><td>$${bill.total.toFixed(2)}</td></tr>
      </table>
      <p>Status: <strong>${bill.status}</strong></p>
      <p style="margin-top:40px;color:#666;font-size:0.9rem">Thank you for staying with StayMaster.</p>
      </body></html>
    `)
    win.document.close()
    win.print()
  }

  return (
    <div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Invoice</th><th>Guest</th><th>Room Charges</th><th>Services</th><th>Tax</th><th>Total</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {state.bills.length === 0 ? (
                <tr><td colSpan={8} className="empty-state">No bills yet</td></tr>
              ) : state.bills.map(b => {
                const guest = state.guests.find(g => g.id === b.guestId)
                return (
                  <tr key={b.id}>
                    <td>#{b.id.slice(-6)}</td>
                    <td>{guest?.name || '—'}</td>
                    <td>${b.roomCharges.toFixed(2)}</td>
                    <td>${b.serviceCharges.toFixed(2)}</td>
                    <td>${b.tax.toFixed(2)}</td>
                    <td><strong>${b.total.toFixed(2)}</strong></td>
                    <td>
                      <span className={`badge badge-${b.status === 'paid' ? 'success' : 'warning'}`}>{b.status}</span>
                    </td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-sm btn-secondary" onClick={() => printInvoice(b)}>Print</button>
                      {b.status !== 'paid' && <button className="btn btn-sm btn-primary" onClick={() => markPaid(b)}>Mark Paid</button>}
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
