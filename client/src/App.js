import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import './App.css';
// REDUX

import { Provider } from 'react-redux';
import store from './store';
const App = () => (
  <Provider store={store}>
  <Router>
   <Navbar/>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    </Provider>
);

export default App;
