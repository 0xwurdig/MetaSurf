import React from 'react';
// import { Home } from './views/Home';
// import { About } from './views/About';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import CreateStream from './pages/CreateStream';
import CreateVideo from './pages/CreateVideo';
import DashBoard from './pages/DashBoard';
import Home from './pages/Home';
import WatchStream from './pages/watchStream';

const App = () => {
  return (
    <Router>
      <NavBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="home" element={<Home />} />
          <Route exact path="/watchStream" element={<WatchStream />} />
          <Route exact path="/dashboard" element={<DashBoard />} />
          <Route exact path="/createStream" element={<CreateStream />} />
          <Route exact path="/createVideo" element={<CreateVideo />} />
          <Route path="stream/:id" element={<WatchStream />} />
        </Routes>
    </Router>
  );
};

export default App;

