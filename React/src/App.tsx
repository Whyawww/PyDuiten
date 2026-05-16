import { useEffect, useState } from 'react';
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
import { SplashScreen } from '../component/ui/SplashScreen'
import { ForgotPassword } from './pages/Auth/ForgotPassword/page';
import { ResetPassword } from './pages/Auth/ResetPassword/page';
import { PrivacyPage } from './pages/Legal/Privacy';
import { TermsPage } from './pages/Legal/Terms';
import './i18n';

function App() {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem('splashSeen')
  );

  const handleSplashDone = () => {
    sessionStorage.setItem('splashSeen', '1');
    setShowSplash(false);
  };

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
    <> {showSplash && <SplashScreen onDone={handleSplashDone} />}
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
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;