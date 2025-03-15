import { useDispatch } from 'react-redux';
import styles from './Layout.module.css';
import { Link, Outlet } from 'react-router-dom';
import { clearData } from '../features/dataSlice';

const Layout = () => {
  const dispatch = useDispatch();

  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <Link to={'/reactForms'}>Home</Link>
        <Link
          to={'/reactForms/form-uncontorl'}
          onClick={() => dispatch(clearData())}
        >
          Uncontorl form
        </Link>
        <Link
          to={'/reactForms/form-contorl'}
          onClick={() => dispatch(clearData())}
        >
          Contol form
        </Link>
      </header>
      <div className={styles.layout}>
        <Outlet />
      </div>
      <footer className={styles.footer}>Create by noisekov</footer>
    </div>
  );
};

export default Layout;
