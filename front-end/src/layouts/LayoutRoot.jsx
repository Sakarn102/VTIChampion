import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GlobalModals from '../components/GlobalModals';

export default function LayoutRoot() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <GlobalModals />
    </>
  );
}
