import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './page/Home';
import FormUncontrol from './page/FormUncontrol';
import FormControl from './page/FormControl/FormControl';

function App() {
  return (
    <>
      <Routes>
        <Route path="/reactForms" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="form-uncontorl" element={<FormUncontrol />} />
          <Route path="form-contorl" element={<FormControl />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
