import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HOST } from '../api';
import ActivityModal from '../components/ActivityModal'; 
import HomeButton from '../components/HomeButton';

function CurrentActivities() {
  const [activities, setActivities] = useState([]);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const navigate = useNavigate();

  const fetchActivities = () => {
    fetch(`${HOST}/goal/currentActivities`)
      .then(response => response.json())
      .then(data => {
        setActivities(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        setActivities([]);
      });
  };

  const navigateToHome = () => {
    navigate('/');
  };

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setShowActivityModal(true);
  };

  const handlePostponeActivity = (activityId) => {
    fetch(`${HOST}/goal/postponeActivity/${activityId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert('Activity postponed successfully');
        setShowActivityModal(false);
        fetchActivities();
      } else {
        alert('Failed to postpone activity');
      }
    })
    .catch(error => {
      console.error('Error postponing activity:', error);
      alert('Error postponing activity');
    });
  };

  const handleRemoveActivity = (activityId) => {
    fetch(`${HOST}/goal/deleteActivity/${activityId}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert('Activity removed successfully');
        setShowActivityModal(false);
        fetchActivities(); 
      } else {
        alert('Failed to remove activity');
      }
    })
    .catch(error => {
      console.error('Error removing activity:', error);
      alert('Error removing activity');
    });
  };

  const activitiesByCategory = activities.reduce((acc, activity) => {
    (acc[activity.category] = acc[activity.category] || []).push(activity);
    return acc;
  }, {});

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8" style={{ backgroundColor: '#222831', color: '#EEEEEE', minHeight: '100vh' }}>
      <h1 className="text-5xl font-bold mb-4" onClick={navigateToHome} style={{ cursor: 'pointer', color: '#00ADB5' }}>Current Activities</h1>
      {Object.keys(activitiesByCategory).length > 0 ? (
        Object.entries(activitiesByCategory).map(([category, activities]) => (
          <div key={category}>
            <h2 className="text-3xl font-semibold mb-2" style={{ color: '#F8DE22' }}>{category}</h2>
            {activities.map(activity => (
              <div key={activity.id} onClick={() => handleActivityClick(activity)} className="cursor-pointer" style={{ transition: 'background-color 0.3s', padding: '15px', margin: '10px 0', borderRadius: '5px', fontSize: '1.25rem' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#393E46'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <p style={{ color: '#EEEEEE', margin: '0 0 5px 0' }}>{activity.activity}</p>
                <p style={{ color: '#AAAAAA', fontSize: '1rem' }}>Associated Goal: {activity.goal}</p>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p style={{ fontSize: '1.25rem' }}>No current activities.</p>
      )}
      {showActivityModal && selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          onClose={() => setShowActivityModal(false)}
          onContinueLater={() => handlePostponeActivity(selectedActivity.id)}
        />
      )}
      <HomeButton />
    </div>
  );
}

export default CurrentActivities;