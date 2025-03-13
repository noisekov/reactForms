import styles from './Layout.module.css';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <Link to={'/'}>Home</Link>
        <Link to={'/form-uncontorl'}>Uncontorl form</Link>
        <Link to={'/form-contorl'}>Contol form</Link>
      </header>
      <div style={{ flexGrow: 1, alignItems: 'center', display: 'flex' }}>
        <Outlet />
      </div>
      <footer className={styles.footer}>Create by noisekov</footer>
    </div>
  );
};

export default Layout;
