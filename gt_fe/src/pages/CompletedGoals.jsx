import React, { useState, useEffect } from 'react';
import { HOST } from '../api';
import HomeButton from '../components/HomeButton';
import { useNavigate } from 'react-router-dom';

function CompletedGoals() {
  const [completedGoals, setCompletedGoals] = useState([]);

  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate('/');
  };

  const fetchCompletedGoals = () => {
    fetch(`${HOST}/goal/completedGoals`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCompletedGoals(data);
        } else {
          console.error('Unexpected data format:', data);
        }
      })
      .catch(error => console.error('Error fetching completed goals:', error));
  };
  

  useEffect(() => {
    fetchCompletedGoals();
  }, []);

  const goalsByCategory = completedGoals.reduce((acc, goal) => {
    const category = goal.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(goal);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto p-8 relative" style={{ backgroundColor: '#222831', color: '#EEEEEE', minHeight: '100vh' }}>
      <h1 className="text-4xl font-bold mb-4" style={{cursor: 'pointer', color: '#00ADB5' }} onClick={navigateToHome}>Completed Goals</h1>

      {Object.keys(goalsByCategory).length > 0 ? (
        Object.keys(goalsByCategory).map(category => (
          <div key={category} className="my-5">
            <h2 className="text-3xl font-bold my-3" style={{ color: '#F8DE22' }}>{category}</h2>
            <ul className="list-disc ml-8">
              {goalsByCategory[category].length > 0 ? (
                goalsByCategory[category].map(goal => (
                  <li key={goal.id} className="text-lg my-1" style={{ transition: 'color 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#00ADB5'}
                    onMouseLeave={e => e.currentTarget.style.color = '#EEEEEE'}>
                    {goal.goal} - {goal.year}
                  </li>
                ))
              ) : (
                <p>No completed goals found in this category.</p>
              )}
            </ul>
          </div>
        ))
      ) : (
        <p className="text-center text-white">No completed goals found.</p>
      )}

      <HomeButton />
    </div>
  );
}

export default CompletedGoals;
