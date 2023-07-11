
import axios from 'axios';
import { Route, Routes } from 'react-router';
import './App.css';
import Layout from './Layout';
import BlogPage from './pages/BlogPage';
import AuthContextProvider from './components/Providers/AuthContextProvider';
import GlobalContextProvider from './components/Providers/GlobalContextProvider';
import UserContextProvider from './components/Providers/UserContextProvider';
import GunStorePage from './pages/GunStorePage';
import IndexPage from './pages/IndexPage';
import LoginAdminPage from './pages/authPages/LoginAdminPage';
import LoginUserPage from './pages/authPages/LoginUserPage';
import NotFoundPage from './pages/NotFoundPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/profilePage';
import RegisterAdminPage from './pages/authPages/RegisterAdminPage';
import RegisterUserPage from './pages/authPages/RegisterUserPage';
import Dashboard from './pages/Dashboard';
import StorePage from './pages/StorePage';
import RegisterPage from './pages/authPages/RegisterPage';
import LoginPage from './pages/authPages/LoginPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import FeedsPage from './pages/FeedsPage';

axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

function App() {

  return (
    <GlobalContextProvider>
      <AuthContextProvider>
        <UserContextProvider>
          <Routes>
            <Route path="/" element={<Layout />} >
              <Route index element={<IndexPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="login/user" element={<LoginUserPage />} />
              <Route path="login/admin" element={<LoginAdminPage />} />
              <Route path="register/user" element={<RegisterUserPage />} />
              <Route path="register/admin" element={<RegisterAdminPage />} />
              <Route path="cart" element={<ShoppingCartPage />} />
              <Route path="feeds" element={<FeedsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="profile/home" element={<ProfilePage />} />
              <Route path="profile/inbox" element={<ProfilePage />} />
              <Route path="profile/settings" element={<ProfilePage />} />
              <Route path="profile/settings/:subpage?" element={<ProfilePage />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="blog/:title?" element={<BlogPage />} />
              <Route path='store' element={<StorePage />} />
              <Route path='store/guns' element={<GunStorePage />} />
              <Route path='payment' element={<PaymentPage />} />
              <Route path='notfound' element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </UserContextProvider>
      </AuthContextProvider>
    </GlobalContextProvider>
  )
}

export default App;
