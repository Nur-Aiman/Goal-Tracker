import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import './index.css';
import LongTermGoals from './pages/LongTermGoals';
import CurrentYearGoals from './pages/CurrentYearGoals';
import CurrentGoals from './pages/CurrentGoals';
import CurrentActivities from './pages/CurrentActivities';
import CompletedActivities from './pages/CompletedActivities';
import CompletedGoals from './pages/CompletedGoals';


function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/longTermGoals',
      element: <LongTermGoals />,
    },
    {
      path: '/currentYearGoals',
      element: <CurrentYearGoals />,
    },
    {
      path: '/currentGoals',
      element: <CurrentGoals />,
    },
    {
      path: '/currentActivities',
      element: <CurrentActivities />,
    },
    {
      path: '/completedActivities',
      element: <CompletedActivities />,
    },
    {
      path: '/completedGoals',
      element: <CompletedGoals />,
    },
   
    
  ]);

  return <RouterProvider router={router} />;
}

export default App;
