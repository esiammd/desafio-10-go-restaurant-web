import React from 'react';
import { Routes as Switch, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" element={<Dashboard />} />
    </Switch>
  );
};

export default Routes;
