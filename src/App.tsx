import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './app/auth/login'
import ForgotPasswordPage from './app/auth/forgotPassword'
import PagesLayout from './app/pages'
import DashboardPage from './app/pages/dashboard'
import ProduitsPage from './app/pages/produits'
import CommandesPage from './app/pages/commandes'
import ClientsPage from './app/pages/clients'
import FacturesPage from './app/pages/factures'

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
          <Route path="produits" element={<ProduitsPage />} />
          <Route path="commandes" element={<CommandesPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="factures" element={<FacturesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
