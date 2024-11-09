// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import WebPageGenerator from './components/WebPageGenerator';
import Proj001ConwaysGameOfLife from './components/Proj001ConwaysGameOfLife';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/001" element=<Proj001ConwaysGameOfLife /> />
      </Routes>
    </Router>
  );
}

export default App;