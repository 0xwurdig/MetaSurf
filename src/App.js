import React from 'react';
// import { Home } from './views/Home';
// import { About } from './views/About';

import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import CreateStream from './pages/CreateStream';
import DashBoard from './pages/DashBoard';
import Home from './pages/Home';
import WatchStream from './pages/WatchStream';

const App = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="home" element={<Home />} />
        <Route exact path="watchStream" element={<WatchStream />} />
        <Route exact path="dashboard" element={<DashBoard />} />
        <Route exact path="createStream" element={<CreateStream />} />
      </Routes>
    </div>
  );
};

export default App;

