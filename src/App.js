import React from 'react';
// import { Home } from './views/Home';
// import { About } from './views/About';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import CreateNFT from './pages/CreateNFT';
import CreateStream from './pages/CreateStream';
import CreateVideo from './pages/CreateVideo';
import DashBoard from './pages/DashBoard';
import Home from './pages/Home';
import MerchDash from './pages/MerchDash';
import Rewards from './pages/Rewards';
import WatchStream from './pages/watchStream';
import WatchVideo from './pages/WatchVideo';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="home" element={<Home />} />
        <Route exact path="watchStream" element={<WatchStream />} />
        <Route exact path="dashboard" element={<DashBoard />} />
        <Route exact path="createStream" element={<CreateStream />} />
        <Route exact path="createVideo" element={<CreateVideo />} />
        <Route exact path="createNft" element={<CreateNFT />} />
        <Route exact path="merchDashboard" element={<MerchDash />} />
        <Route exact path="rewards" element={<Rewards />} />
        <Route path="stream/:id" element={<WatchStream />} />
        <Route path="video/:id" element={<WatchVideo />} />
      </Routes>
    </Router>
  );
};

export default App;

