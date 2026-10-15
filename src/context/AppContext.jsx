import { createContext, useContext, useReducer, useEffect } from 'react'
import { initialData } from '../data/sampleData'

const AppContext = createContext()

const STORAGE_KEY = 'staymaster_data_v1'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {}
  return initialData
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {}
}

function reducer(state, action) {
  let next = state
  switch (action.type) {
    case 'SET_THEME':
      next = { ...state, theme: action.payload }
      break
    case 'ADD_ROOM':
      next = { ...state, rooms: [...state.rooms, { ...action.payload, id: Date.now().toString() }] }
      break
    case 'UPDATE_ROOM':
      next = { ...state, rooms: state.rooms.map(r => r.id === action.payload.id ? { ...r, ...action.payload } : r) }
      break
    case 'DELETE_ROOM':
      next = { ...state, rooms: state.rooms.filter(r => r.id !== action.payload) }
      break
    case 'ADD_RESERVATION':
      next = { ...state, reservations: [...state.reservations, { ...action.payload, id: Date.now().toString() }] }
      break
    case 'UPDATE_RESERVATION':
      next = { ...state, reservations: state.reservations.map(r => r.id === action.payload.id ? { ...r, ...action.payload } : r) }
      break
    case 'DELETE_RESERVATION':
      next = { ...state, reservations: state.reservations.filter(r => r.id !== action.payload) }
      break
    case 'ADD_GUEST':
      next = { ...state, guests: [...state.guests, { ...action.payload, id: Date.now().toString() }] }
      break
    case 'UPDATE_GUEST':
      next = { ...state, guests: state.guests.map(g => g.id === action.payload.id ? { ...g, ...action.payload } : g) }
      break
    case 'DELETE_GUEST':
      next = { ...state, guests: state.guests.filter(g => g.id !== action.payload) }
      break
    case 'ADD_HOUSEKEEPING':
      next = { ...state, housekeeping: [...state.housekeeping, { ...action.payload, id: Date.now().toString() }] }
      break
    case 'UPDATE_HOUSEKEEPING':
      next = { ...state, housekeeping: state.housekeeping.map(h => h.id === action.payload.id ? { ...h, ...action.payload } : h) }
      break
    case 'ADD_ROOM_SERVICE':
      next = { ...state, roomService: [...state.roomService, { ...action.payload, id: Date.now().toString() }] }
      break
    case 'UPDATE_ROOM_SERVICE':
      next = { ...state, roomService: state.roomService.map(s => s.id === action.payload.id ? { ...s, ...action.payload } : s) }
      break
    case 'ADD_BILL':
      next = { ...state, bills: [...state.bills, { ...action.payload, id: Date.now().toString() }] }
      break
    case 'UPDATE_BILL':
      next = { ...state, bills: state.bills.map(b => b.id === action.payload.id ? { ...b, ...action.payload } : b) }
      break
    case 'ADD_STAFF':
      next = { ...state, staff: [...state.staff, { ...action.payload, id: Date.now().toString() }] }
      break
    case 'UPDATE_STAFF':
      next = { ...state, staff: state.staff.map(s => s.id === action.payload.id ? { ...s, ...action.payload } : s) }
      break
    case 'DELETE_STAFF':
      next = { ...state, staff: state.staff.filter(s => s.id !== action.payload) }
      break
    case 'RESET_DATA':
      next = initialData
      break
    default:
      return state
  }
  saveState(next)
  return next
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme || 'light')
  }, [state.theme])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
