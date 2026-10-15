import { useApp } from '../context/AppContext'

export default function Settings() {
  const { state, dispatch } = useApp()

  const resetData = () => {
    if (window.confirm('Reset all data to sample defaults? This cannot be undone.')) {
      dispatch({ type: 'RESET_DATA' })
      localStorage.removeItem('staymaster_data_v1')
      window.location.reload()
    }
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">Appearance</div>
        <div className="card-body">
          <div className="form-group" style={{ maxWidth: 300 }}>
            <label>Theme</label>
            <select
              className="form-control"
              value={state.theme}
              onChange={e => dispatch({ type: 'SET_THEME', payload: e.target.value })}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">Data Management</div>
        <div className="card-body">
          <p style={{ marginBottom: 12, color: 'var(--text-muted)' }}>
            All data is stored locally in your browser (LocalStorage). Clearing browser data will remove it.
          </p>
          <button className="btn btn-danger" onClick={resetData}>Reset to Sample Data</button>
        </div>
      </div>
      <div className="card">
        <div className="card-header">About</div>
        <div className="card-body">
          <p><strong>StayMaster</strong> — Hotel Management System</p>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Version 1.0.0 · Demo portfolio project</p>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Built with React, Vite, and LocalStorage</p>
        </div>
      </div>
    </div>
  )
}
