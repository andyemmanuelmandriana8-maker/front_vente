import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './app/auth/login'
import ForgotPasswordPage from './app/auth/forgotPassword'
import PagesLayout from './app/pages'
import DashboardPage from './app/pages/dashboard'
import UsersPage from './app/pages/users'
import ProduitsPage from './app/pages/produits'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/forgotPassword" element={<ForgotPasswordPage />} />
        <Route path="/pages" element={<PagesLayout />}>
          <Route index element={<Navigate to="/pages/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="produits" element={<ProduitsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
