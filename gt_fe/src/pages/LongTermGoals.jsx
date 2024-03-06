
import React, { useState, useEffect } from 'react';
import AddNewYear from '../components/AddNewYear';
import GoalDetails from '../components/GoalDetails'; 
import { HOST } from '../api';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../components/HomeButton';


function LongTermGoals() {
  const [showAddNewYearModal, setShowAddNewYearModal] = useState(false);
  const [showGoalDetailsModal, setShowGoalDetailsModal] = useState(false); 
  const [year, setYear] = useState('');
  const [goalDetails, setGoalDetails] = useState({}); 
  const [goals, setGoals] = useState([]);
  const [isViewMode, setIsViewMode] = useState(false); 

  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/'); 
  };

  const fetchLongTermGoals = () => {
    fetch(`${HOST}/goal/viewGoals`)
    .then(response => response.json())
    .then(data => {
      setGoals(Array.isArray(data) ? data : []);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      setGoals([]); 
    });
  };

  useEffect(() => {
    fetchLongTermGoals();
  }, [showGoalDetailsModal, showAddNewYearModal ]);

  const goalsByYear = goals.reduce((acc, goal) => {
    const year = goal.year;
    if (!acc[year]) {
      acc[year] = {};
    }
    const category = goal.category;
    if (!acc[year][category]) {
      acc[year][category] = [];
    }
    acc[year][category].push(goal);
    return acc;
  }, {});
  

  const handleGoalClick = async (goalId) => {
    console.log(goalId);
    setIsViewMode(true);
    const response = await fetch(`${HOST}/goal/viewGoal/${goalId}`);
    const data = await response.json();
    console.log(data);
    setGoalDetails(data);
    setShowGoalDetailsModal(true);
  };

  const handleAddGoal = () => {
    setIsViewMode(false);
    setGoalDetails({});
    setShowGoalDetailsModal(true); 
  };

  const handleAddYear = () => {
    setShowAddNewYearModal(true);
  };

  const handleSaveGoal = () => {
    const requestBody = {
        goal: goalDetails.goal,
        category: goalDetails.category,
        planStartMonth: goalDetails.planStartMonth,
        planStartYear: goalDetails.planStartYear,
        planCompleteMonth: goalDetails.planCompleteMonth,
        planCompleteYear: goalDetails.planCompleteYear,
        intention: goalDetails.intention,
        why: goalDetails.why,
        how: goalDetails.how,
        year: goalDetails.year,
        specific: goalDetails.specific,
        measurable: goalDetails.measurable,
        attainable: goalDetails.attainable,
        relevant: goalDetails.relevant,
        timeBound: goalDetails.timeBound,
      };
    
      fetch(`${HOST}/goal/addGoal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
         
          alert(data.error);
        } else {
   
          console.log('Goal saved:', data);
          alert('Goal added successfully!');
          setGoalDetails({}); 
          handleCancelGoal();
        }
      })
      .catch(error => {
        alert(`Error saving goal: ${error.message}`);
        console.error('Error saving goal:', error);
      }); 
    };

  const handleCancelGoal = () => {
    setShowGoalDetailsModal(false); 
  };

  const handleSaveYear = () => {
    console.log('Year saved:', year);

    fetch(`${HOST}/goal/addYear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ year }),
    })
    .then(response => response.json())
    .then(data => {

     

      if (data && data.message) {
        alert(data.message);
      } else {
        alert('A valid year is required');
      }
      
     
      if (data.message !== 'Year already exists') {
        setShowAddNewYearModal(false);
        setYear('');
      }
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      alert('Error saving year: ' + error.message);
    });
  };

  const handleCloseModal = () => {
    setShowAddNewYearModal(false);
    setYear(''); 
  };

  return (
    <div className="max-w-4xl mx-auto p-8 relative" style={{ backgroundColor: '#222831', color: '#EEEEEE', minHeight: '100vh' }}>
      <h1 className="text-4xl font-bold mb-4" onClick={navigateToHome} style={{ cursor: 'pointer', color: '#00ADB5' }}>Long Term Goals</h1>
      <div className="absolute top-8 right-8 space-x-4">
        <button className="bg-#00ADB5 hover:bg-#393E46 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out" onClick={handleAddGoal}>Add Goal</button>
        <button className="bg-#00ADB5 hover:bg-#393E46 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out" onClick={handleAddYear}>Add Year</button>
      </div>

      {Object.keys(goalsByYear).length > 0 ? (
  Object.keys(goalsByYear).map(year => (
    <div key={year} className="my-5">
      <h2 className="text-3xl font-bold my-3" style={{ color: '#EEEEEE' }}>{year}</h2>
      {Object.keys(goalsByYear[year]).map(category => (
        <div key={category} className="ml-5">
          <h3 className="text-2xl font-semibold my-2" style={{ color: '#F8DE22' }}>{category}</h3>
          <ul className="list-disc ml-8">
            {goalsByYear[year][category].length > 0 ? (
              goalsByYear[year][category].map(goal => (
                <li key={goal.id} className="text-lg my-1 cursor-pointer" style={{ transition: 'color 0.3s', color: '#EEEEEE' }}
                  onClick={() => handleGoalClick(goal.id)}>
                  {goal.goal}
                </li>
              ))
            ) : (
              <li className="text-lg my-1" style={{ color: '#EEEEEE' }}>No goals found in this category.</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  ))
) : (
  <div className="text-center mt-8">
    <p className="text-white">No long term goals found.</p>
  </div>
)}




{showAddNewYearModal && (
        <AddNewYear year={year} setYear={setYear} onSave={handleSaveYear} onCancel={handleCloseModal} />
      )}

      {showGoalDetailsModal && (
        <GoalDetails goalDetails={goalDetails} setGoalDetails={setGoalDetails} onSave={handleSaveGoal} onCancel={handleCancelGoal} mode={isViewMode ? 'view' : 'edit'} />
      )}
       <HomeButton />
    </div>
  );
}

export default LongTermGoals;
