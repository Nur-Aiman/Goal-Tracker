import React, { useState, useEffect } from 'react';
import { HOST } from '../api';

function AddActivityModal({ onSave, onCancel, goals }) {
  const [activity, setActivity] = useState('');
  const [category, setCategory] = useState('');
  const [goal, setGoal] = useState('');
  const [filteredGoals, setFilteredGoals] = useState([]);

  const categories = ["Career", "Religion", "Family", "Finance", "Mental", "Health", "Society"];
  
  const fetchCurrentGoals = () => {
    fetch(`${HOST}/goal/viewCurrentGoals`)
      .then(response => response.json())
      .then(setGoal)
      .catch(console.error);
  };

  useEffect(() => {
    if (category) {
      fetchCurrentGoals();
      setFilteredGoals(goals.filter(g => g.category === category));
    } else {
      fetchCurrentGoals();
      setFilteredGoals([]);
    }
  }, [category, goals]);

  const handleSaveActivity = async (activity, category, goalId, callback) => {
    console.log("Saving activity:", activity, category, goalId);
    try {
      const response = await fetch(`${HOST}/goal/addActivity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activity, category, goalId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save activity');
      }
      alert('Activity saved successfully');
      callback(); 
      fetchCurrentGoals();
      onCancel();

    } catch (error) {
      console.error('Failed to save activity:', error);
      alert(`Error saving activity: ${error.message}`);
    }
  };
  
  
  

  const handleSave = async () => {
    const goal = goals.find(g => g.id === goals.id); 
    const data = {
      activity,
      category,
      associated_goal: goal.id, 
      status: 'pending', 
    };

    try {
      const response = await fetch(`${HOST}/goal/addActivity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const responseData = await response.json();
        alert('Activity added successfully');
        fetchCurrentGoals();
        oncancel();
        onSave(responseData); 
      } else {
        const errorData = await response.json();
        alert(`Failed to add activity: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Failed to add activity:', error);
      alert(`Failed to add activity: ${error.message}`);
    }
  };
  const handleSaveAndClose = () => {
    const goalId = filteredGoals.find(g => g.goal === goal).id;
    handleSaveActivity(activity, category, goalId, onCancel);


  };
  
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-[#393E46] p-8 rounded w-full max-w-md" style={{ color: '#EEEEEE', border: '1px solid #00ADB5' }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#F8DE22' }}>Add Activity</h2>
        <label className="block mb-2">Activity:</label>
        <input
          type="text"
          placeholder="Activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="border p-2 rounded w-full mb-4"
          style={{ backgroundColor: '#EEEEEE', color: '#222831' }}
        />
        <label className="block mb-2">Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full mb-4"
          style={{ backgroundColor: '#EEEEEE', color: '#222831' }}
        >
          <option value="">Select category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        <label className="block mb-2">Goal:</label>
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="border p-2 rounded w-full mb-4"
          style={{ backgroundColor: '#EEEEEE', color: '#222831' }}
        >
          <option value="">Select goal</option>
          {filteredGoals.map((g) => (
            <option key={g.id} value={g.goal}>{g.goal}</option>
          ))}
        </select>
        <div className="flex justify-end space-x-4">
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out" onClick={onCancel}>Cancel</button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out" onClick={handleSaveAndClose}>Save</button>
        </div>
      </div>
    </div>
  );
  
  
  
}

export default AddActivityModal;
