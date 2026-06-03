
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {!isHomePage && <Header />}
      <main className="flex-grow">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
