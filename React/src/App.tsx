import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import faviconImg from './assets/favicon.png';
import { MainLayout } from '../component/layout/MainLayout';
import { DashboardLayout } from '../component/layout/DashboardLayout';
import { Home } from './pages/Home/page';
import { Login } from './pages/Auth/Login/page';
import { Register } from './pages/Auth/Register/page';
import { Dashboard } from './pages/Dashboard/page';
import { TransactionPage } from './pages/Transaction/page'
import { ProfilePage } from './pages/Profile/page';

function App() {
  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = faviconImg;
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <MainLayout>
            <Home />
          </MainLayout>
        } />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        } />

        <Route path="/transaction" element={
          <DashboardLayout>
            <TransactionPage />
          </DashboardLayout>
        } />
        <Route
          path="/profile"
          element={
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;