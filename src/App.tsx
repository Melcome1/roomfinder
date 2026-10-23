import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppLayout from './components/AppLayout'
import RoleGuard from './components/RoleGuard'
import Welcome from './pages/auth/Welcome'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/Profile'
import TenantHome from './pages/tenant/Home'
import Saved from './pages/tenant/Saved'
import RoomDetails from './pages/tenant/RoomDetails'
import Listings from './pages/landlord/Listings'
import AddRoom from './pages/landlord/AddRoom'
import EditRoom from './pages/landlord/EditRoom'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings/new" element={<AddRoom />} />
          <Route path="/listings/edit" element={<EditRoom />} />

          {/* Signed-in area */}
          <Route element={<AppLayout />}>
            <Route path="/profile" element={<Profile />} />

            <Route element={<RoleGuard allow="tenant" />}>
              <Route path="/" element={<TenantHome />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/room/:id" element={<RoomDetails />} />
            </Route>

            <Route element={<RoleGuard allow="landlord" />}>
              <Route path="/listings" element={<Listings />} />
              <Route path="/listings/new" element={<AddRoom />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}