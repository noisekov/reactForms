import styles from './Layout.module.css';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <Link to={'/reactForms'}>Home</Link>
        <Link to={'/reactForms/form-uncontorl'}>Uncontorl form</Link>
        <Link to={'/reactForms/form-contorl'}>Contol form</Link>
      </header>
      <div className={styles.layout}>
        <Outlet />
      </div>
      <footer className={styles.footer}>Create by noisekov</footer>
    </div>
  );
};

export default Layout;
