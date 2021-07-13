import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import MenuList from './components/MenuList/MenuList';

function App() {

  return (
    <Router>
      <MenuList />
    </Router>
  );
}

export default App;
