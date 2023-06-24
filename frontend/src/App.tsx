
import axios from 'axios'
import { Route, Routes } from 'react-router'
import './App.css'
import AccountPage from './pages/SettingsPage'
import BlogPage from './pages/BlogPage'
import Layout from './Layout'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import ProfilePage from './pages/ProfilePage'
import SignUpPage from './pages/SignUpPage'
import AuthContextProvider from './components/AuthContext'
import GlobalContextProvider from './components/GlobalContext'
import GunStorePage from './pages/GunStorePage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentPage from './pages/PaymentPage'
import IndexPage from './pages/IndexPage'
import SettingsPage from './pages/SettingsPage'

axios.defaults.baseURL = 'http://localhost:4000/api'
axios.defaults.withCredentials = true

function App() {
  
  return (
    <GlobalContextProvider>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<IndexPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="blog/:title?" element={<BlogPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="settings/:subpage?" element={<SettingsPage />} />
            <Route path='guns-store' element={<GunStorePage />} />
            <Route path='payment' element={<PaymentPage />} />
            <Route path='notfound' element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthContextProvider>
    </GlobalContextProvider>
  )
}

export default App
