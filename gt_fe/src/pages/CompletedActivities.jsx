import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityDetails from '../components/ActivityDetails';
import { HOST } from '../api';
import HomeButton from '../components/HomeButton';

function CompletedActivities() {
  const [showActivityDetailsModal, setShowActivityDetailsModal] = useState(false);
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/');
  };

  const fetchCompletedActivities = () => {
    fetch(`${HOST}/goal/completedActivities`)
      .then(response => response.json())
      .then(data => {
        setActivities(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        setActivities([]);
      });
  };

  const handleActivityClick = (activityName, activityId) => {
    setSelectedActivity(activityName);
    setSelectedActivityId(activityId);
    setShowActivityDetailsModal(true);
  };

  const handleRemoveActivity = (activityId) => {
    if (window.confirm('Are you sure you want to remove this activity?')) {
      fetch(`${HOST}/goal/deleteActivity/${activityId}`, {
        method: 'DELETE',
      })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          alert('Activity removed successfully');
          setShowActivityDetailsModal(false);
          fetchCompletedActivities(); 
        } else {
          alert('Failed to remove activity');
        }
      })
      .catch(error => {
        console.error('Error removing activity:', error);
        alert('Error removing activity');
      });
    }
  };
  

  useEffect(() => {
    fetchCompletedActivities();
  }, []);

  // Grouping activities by year, category, and goalId
  const activitiesStructure = activities.reduce((acc, activity) => {
    const { year, category, goalId } = activity;
  
    // Ensure year structure exists
    if (!acc[year]) {
      acc[year] = {};
    }
  
    // Ensure category structure exists within year
    if (!acc[year][category]) {
      acc[year][category] = {};
    }
  
    // Ensure goalId structure exists within category
    if (!acc[year][category][goalId]) {
      acc[year][category][goalId] = {
        goalName: "", // We will assign the goalName later
        activities: []
      };
    }
  
    // Push the activity into the correct goalId structure
    acc[year][category][goalId].activities.push(activity);
  
    return acc;
  }, {});
  
  // Assign the goalName to each goalId
  activities.forEach(activity => {
    const { year, category, goal, goalId } = activity;
    if (activitiesStructure[year] && activitiesStructure[year][category] && activitiesStructure[year][category][goalId]) {
      // Only set the goalName if it has not been set yet to avoid overwriting
      if (activitiesStructure[year][category][goalId].goalName === "") {
        activitiesStructure[year][category][goalId].goalName = goal;
      }
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-8 relative" style={{ backgroundColor: '#222831', color: '#EEEEEE', minHeight: '100vh' }}>
      <h1 className="text-4xl font-bold mb-4" onClick={navigateToHome} style={{ cursor: 'pointer', color: '#00ADB5' }}>Completed Activities</h1>
      
      {Object.keys(activitiesStructure).length > 0 ? (
        Object.keys(activitiesStructure).map(year => (
          <div key={year} className="my-5">
            <h2 className="text-3xl font-bold my-3" style={{ color: '#EEEEEE' }}>{year}</h2>
            {Object.keys(activitiesStructure[year]).map(category => (
              <div key={category}>
                <h3 className="text-2xl font-semibold my-2" style={{ color: '#F8DE22' }}>{category}</h3>
                {Object.keys(activitiesStructure[year][category]).map(goalId => {
                  const { goalName, activities } = activitiesStructure[year][category][goalId];
                  return (
                    <div key={goalId}>
                      <h4 className="text-xl font-semibold my-1">{goalName}</h4>
                      <ul className="list-disc ml-8">
                        {activities.map(activity => (
                          <li key={activity.id} onClick={() => handleActivityClick(activity.activity, activity.id)}
                              className="cursor-pointer text-sm" style={{ transition: 'color 0.3s' }}
                              onMouseEnter={e => e.currentTarget.style.color = '#00ADB5'}
                              onMouseLeave={e => e.currentTarget.style.color = '#EEEEEE'}>
                            {activity.activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))
      ) : (
        <p className="text-center text-white">No completed activities found.</p>
      )}
  
      {showActivityDetailsModal && selectedActivity && (
        <ActivityDetails
          activity={selectedActivity}
          activityId={selectedActivityId}
          onCancel={() => setShowActivityDetailsModal(false)}
          onRemove={handleRemoveActivity}

        />
      )}
  
      <HomeButton />
    </div>
  );
  
}

export default CompletedActivities;
