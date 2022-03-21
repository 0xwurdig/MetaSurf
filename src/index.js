import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from "@ethersproject/providers";
import { BrowserRouter as Router } from 'react-router-dom';
// import { Routes } from './routes'; // where we are going to specify our routes
import App from './App';

function getLibrary(provider) {
  return new Web3Provider(provider);
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <App />
      </Router>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

