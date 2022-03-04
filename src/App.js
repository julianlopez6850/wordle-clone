import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/navbar.js'
import Main from './pages/main';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Main />
    </div>
  );
}

export default App;
