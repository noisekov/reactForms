import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './Home.module.css';

const Home = () => {
  const data = useSelector((state: RootState) => state.data);

  return data.name ? (
    <div>
      <pre className={styles.code}>{JSON.stringify(data, null, 4)}</pre>
      <p>Your image</p>
      {typeof data.image === 'string' && (
        <img src={data.image} alt="image" width={200} height={200} />
      )}
    </div>
  ) : (
    <div>Data not send</div>
  );
};

export default Home;
