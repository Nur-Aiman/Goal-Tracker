import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../components/HomeButton';

function Home() {
  let navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  const showUnderConstructionMessage = () => {
    window.alert('This feature is under construction.');
  };

  return (
    <div className="max-w-4xl mx-auto p-8" style={{ backgroundColor: '#222831', color: '#EEEEEE', minHeight: '100vh'  }}>
      <h1 className="text-4xl font-bold mb-4 text-center" style={{ color: '#F8DE22' }}>Goal Tracker</h1>
      <hr style={{ 
  border: '0',
  height: '2px',
  backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(30, 144, 255, 0.75), rgba(0, 0, 0, 0))',
  marginBottom: '20px'
}} />

<div className="flex flex-col gap-4">
  {['/currentActivities', '/currentGoals', '/currentYearGoals', '/longTermGoals', '/completedGoals', '/completedActivities'].map((path, index) => (
    <button
      key={index}
      className="text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
      style={{
        background: 'linear-gradient(45deg, #009688, #00ADB5)',
        boxShadow: '0 6px 9px rgba(0, 0, 0, 0.2)',
      }}
      onClick={() => path.includes('/') ? navigateTo(path) : showUnderConstructionMessage()}
    >
      {['Current Activities', 'Current Goals', 'This Year Goal', 'Long Term Goals', 'Completed Goals', 'Completed Activities'][index]}
    </button>
  ))}
</div>


      <HomeButton />
    </div>
  );
}

export default Home;
