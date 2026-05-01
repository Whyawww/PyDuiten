import { useEffect } from 'react';
import { MainLayout } from '../component/layout/MainLayout';
import { Home } from './pages/Home/page';
import faviconImg from './assets/favicon.png';

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
    <MainLayout>
      <Home />
    </MainLayout>
  );
}

export default App;