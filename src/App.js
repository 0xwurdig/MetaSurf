import React from 'react';
// import { Home } from './views/Home';
// import { About } from './views/About';

import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import WatchStream from './pages/watchStream';

const App = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="watchStream" element={<WatchStream />} />
      </Routes>
    </div>
  );
};

export default App;

