import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './Home.module.css';

const Home = () => {
  const data = useSelector((state: RootState) => state.data);

  return data.name ? (
    <>
      <pre className={styles.code}>{JSON.stringify(data, null, 4)}</pre>
    </>
  ) : (
    <div>Data not send</div>
  );
};

export default Home;
