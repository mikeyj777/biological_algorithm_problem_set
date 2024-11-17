// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import WebPageGenerator from './components/WebPageGenerator';
import Proj001ConwaysGameOfLife from './components/Proj001ConwaysGameOfLife';
import Proj002Landscape2D from './components/Proj002Landscape2D';
import Proj004BasicBeetleSearch from './components/Proj004BasicBeetleSearch';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/001" element=<Proj001ConwaysGameOfLife /> />
        <Route path="/002" element=<Proj002Landscape2D /> />
        <Route path="/004" element=<Proj004BasicBeetleSearch /> />
      </Routes>
    </Router>
  );
}

export default App;