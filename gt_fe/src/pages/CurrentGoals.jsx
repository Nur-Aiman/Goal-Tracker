import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddNewYear from '../components/AddNewYear';
import GoalDetails from '../components/GoalDetails'; 
import AddActivity from '../components/AddActivity';
import ActivityDetails from '../components/ActivityDetails';
import { HOST } from '../api';
import HomeButton from '../components/HomeButton';

function CurrentGoals() {
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showAddNewYearModal, setShowAddNewYearModal] = useState(false);
  const [showGoalDetailsModal, setShowGoalDetailsModal] = useState(false); 
  const [year, setYear] = useState('');
  const [goalDetails, setGoalDetails] = useState({}); 
  const [goals, setGoals] = useState([]);
  const [isViewMode, setIsViewMode] = useState(false); 
  const [isCurrentYearContext, setIsCurrentYearContext] = useState(false);
  const [isCurrentGoalContext, setIsCurrentGoalContext] = useState(false);
  const [showActivityDetailsModal, setShowActivityDetailsModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedGoalName, setSelectedGoalName] = useState(null);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [startedActivitiesCount, setStartedActivitiesCount] = useState({});


  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/'); 
  };

  const fetchCurrentGoals = () => {
    fetch(`${HOST}/goal/viewCurrentGoals`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      setGoals(Array.isArray(data) ? data : []);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      setGoals([]); 
    });
  };

  const fetchStartedActivitiesCount = () => {
    fetch(`${HOST}/goal/goalsWithStartedActivitiesCount`)
      .then((response) => response.json())
      .then((data) => {
  
        const countMap = data.reduce((acc, item) => {
          acc[item.id] = parseInt(item.started_activities_count, 10);
          return acc;
        }, {});
        setStartedActivitiesCount(countMap);
      })
      .catch((error) => console.error('Error fetching started activities count:', error));
  };
  

  const currentYear = new Date().getFullYear();

  const handleActivityClick = (activityName, activityId, goalId) => {
    setSelectedActivity(activityName);
    setSelectedActivityId(activityId);
    const associatedGoal = goals.find(goal => goal.id === goalId);
    setSelectedGoalName(associatedGoal ? associatedGoal.goal : 'Unknown Goal');
    setShowActivityDetailsModal(true);
  };
  

  useEffect(() => {
    fetchCurrentGoals(); 
    fetchStartedActivitiesCount();
  }, [showAddActivityModal, showActivityDetailsModal]);
  

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
  
  const handleAddActivity = () => {
    fetchCurrentGoals();
    fetchStartedActivitiesCount();
    setShowAddActivityModal(true);
 
  };

  const handleSaveActivity = (activity, category, goal) => {
   
    console.log(activity, category, goal);
    setShowAddActivityModal(false);
  };
  
  const handleCancelActivity = () => {
    setShowAddActivityModal(false);
    fetchCurrentGoals();
    fetchStartedActivitiesCount();
  };

  const handleGoalClick = async (goalId) => {
    console.log(goalId);
    setIsViewMode(true);
    setIsCurrentGoalContext(true);
    const response = await fetch(`${HOST}/goal/viewGoal/${goalId}`);
    const data = await response.json();
    console.log(data);
    setGoalDetails(data);
    setShowGoalDetailsModal(true);
  };

  const handleAddGoal = () => {
    setIsViewMode(false);
    setIsCurrentYearContext(false);
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
          fetchCurrentGoals(); 
          fetchStartedActivitiesCount();
          handleCancelGoal();
        }
      })
      .catch(error => {
        alert(`Error saving goal: ${error.message}`);
        console.error('Error saving goal:', error);
      }); 
    };

    const handleStartActivity = (activityId) => {
      fetch(`${HOST}/goal/startActivity/${activityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
    
          alert(`Failed to start activity: ${data.error}`);
        } else {
    
          alert('Activity started successfully!');
          fetchCurrentGoals(); 
          fetchStartedActivitiesCount();
          setShowActivityDetailsModal(false); 
        }
      })
      .catch(error => {
    
        console.error('Error starting activity:', error);
        alert(`Error starting activity: ${error.message}`);
      });
    };
    
    

  const handleCancelGoal = () => {
    setShowGoalDetailsModal(false); 
    fetchCurrentGoals();
    fetchStartedActivitiesCount();
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
        fetchCurrentGoals(); 
        fetchStartedActivitiesCount();
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

  const handleRemoveActivity = (activityId) => {
    fetch(`${HOST}/goal/deleteActivity/${activityId}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert('Activity removed successfully');
        setShowActivityDetailsModal(false);
        fetchCurrentGoals(); 
        fetchStartedActivitiesCount();
      } else {
        alert('Failed to remove activity');
      }
    })
    .catch(error => {
      console.error('Error removing activity:', error);
      alert('Error removing activity');
    });
  };
  

  return (
    <div className="max-w-4xl mx-auto p-8 relative" style={{ backgroundColor: '#222831', color: '#EEEEEE', minHeight: '100vh' }}>
      <h1 className="text-4xl font-bold mb-4" onClick={navigateToHome} style={{ cursor: 'pointer', color: '#00ADB5' }}>Current <br /> Goals</h1>
      <div className="absolute top-8 right-8 space-x-4">
        <button className="bg-#00ADB5 hover:bg-#393E46 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out" onClick={handleAddActivity}>Add Activity</button>
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
                      <li key={goal.id}>
                        <div onClick={() => handleGoalClick(goal.id)} className="text-lg my-1 cursor-pointer" style={{ transition: 'color 0.3s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#00ADB5'}
                          onMouseLeave={e => e.currentTarget.style.color = '#EEEEEE'}>
                          {goal.goal}
                          <p className="text-emerald-300 text-sm  italic">
        Activities started : {startedActivitiesCount[goal.id] || 0} 
      </p>
                        </div>
                      
                        {goal.activities && goal.activities.length > 0 ? (
                          <ul className="list-disc ml-8">
                            {goal.activities.map((activity, index) => (
                              <li key={index} onClick={() => handleActivityClick(activity.activity, activity.id, goal.id)} className="text-sm cursor-pointer" style={{ transition: 'color 0.3s' }}
                                  onMouseEnter={e => e.currentTarget.style.color = '#00ADB5'}
                                  onMouseLeave={e => e.currentTarget.style.color = '#EEEEEE'}>
                                {activity.activity}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="ml-8 text-sm">No activities found for this goal.</p>
                        )}
                      </li>
                    ))
                  ) : (
                    <p>No goals found in this category.</p>
                  )}
                </ul>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p className="text-center text-white">No current goals found.</p>
      )}
  
  {showActivityDetailsModal && selectedActivity && (
  <ActivityDetails
    activity={selectedActivity}
    goalName={selectedGoalName}
    activityId={selectedActivityId}
    onStart={() => handleStartActivity(selectedActivityId)}
    onCancel={() => setShowActivityDetailsModal(false)}
    onRemove={handleRemoveActivity}
  />
)}

  
      {showAddNewYearModal && (
        <AddNewYear
          year={year}
          setYear={setYear}
          onSave={handleSaveYear}
          onCancel={handleCloseModal}
        />
      )}
  
      {showGoalDetailsModal && (
        <GoalDetails
          goalDetails={goalDetails}
          setGoalDetails={setGoalDetails}
          onSave={handleSaveGoal}
          onCancel={handleCancelGoal}
          mode={isViewMode ? 'view' : 'edit'}
          currentYearPage={isCurrentYearContext ? currentYear : null}
          isCurrentGoalsContext={isCurrentGoalContext}
        />
      )}
  
      {showAddActivityModal && (
        <AddActivity onSave={handleSaveActivity} onCancel={handleCancelActivity} goals={goals} />
      )}
       <HomeButton />
    </div>
  );
  
}

export default CurrentGoals;
