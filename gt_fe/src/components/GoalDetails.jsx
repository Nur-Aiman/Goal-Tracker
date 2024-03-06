
import React, { useState, useEffect } from 'react';
import { HOST } from '../api';

function GoalDetails({ onSave, onCancel, setGoalDetails, goalDetails, mode, currentYearPage, isCurrentGoalsContext }) {
  const categories = ["Career", "Religion", "Family", "Finance", "Mental", "Health", "Society"];
  const [years, setYears] = useState([]);
  const currentYear = new Date().getFullYear();
  const year_option = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [isEditMode, setIsEditMode] = useState(false);

  const isViewMode = mode === 'view';

  const renderDetail = (label, value) => (
    isViewMode ? <p className="mb-4"><strong>{label}:</strong> {value}</p> :
    <textarea name={label.toLowerCase()} value={value} onChange={handleChange} className="border p-2 rounded w-full mb-4" disabled={isViewMode} />
  );

  useEffect(() => {
    fetch(`${HOST}/goal/getYear`) 
      .then(response => response.json())
      .then(data => setYears(data.map(year => year.year_id))) 
      .catch(error => console.error('Error fetching years:', error));
  }, []);

  const handleChange = (e) => {
    setGoalDetails({ ...goalDetails, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditMode(true);
  
    if (goalDetails.plan_start) {
      const startDate = new Date(goalDetails.plan_start);
      setGoalDetails((prevDetails) => ({
        ...prevDetails,
        planStartMonth: months[startDate.getMonth()],
        planStartYear: startDate.getFullYear().toString(),
      }));
    }
    if (goalDetails.plan_end) {
      const endDate = new Date(goalDetails.plan_end);
      setGoalDetails((prevDetails) => ({
        ...prevDetails,
        planCompleteMonth: months[endDate.getMonth()],
        planCompleteYear: endDate.getFullYear().toString(),
      }));
    }
  };
  

  const handleSaveEdit = async () => {
 
    const url = `${HOST}/goal/editGoal/${goalDetails.id}`;
  

    const updatedGoalDetails = {
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
  
    try {
  
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGoalDetails),
      });
  
      const data = await response.json();
  
  
      if (response.ok) {
        alert('Goal updated successfully!');
        setIsEditMode(false); 
        onCancel(); 
      } else {
        alert(`Failed to update goal: ${data.message}`);
      }
    } catch (error) {
      console.error('Failed to update goal:', error);
      alert(`Failed to update goal: ${error.message}`);
    }
  };
  

  const handleRemoveGoal = async () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        const response = await fetch(`${HOST}/goal/deleteGoal/${goalDetails.id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
  
        if (response.ok) {
          alert('Goal removed successfully!');
          onCancel(); 
        } else {
          alert(`Failed to remove goal: ${data.message}`);
        }
      } catch (error) {
        console.error('Failed to remove goal:', error);
        alert(`Failed to remove goal: ${error.message}`);
      }
    }
  };
  

  const handleEditClick = () => {
    console.log('Edit button clicked');
 
  };

  const handleContinueLater = () => {
    console.log('Continue Later clicked');

  };

  const handleMarkAsCompleted = async () => {
    console.log('Mark as Completed clicked');
   
  };

  const startGoal = async () => {
    try {
      const response = await fetch(`${HOST}/goal/startGoal/${goalDetails.id}`, {
        method: 'PUT',
      });
      const data = await response.json();
      if (response.ok) {
        alert('Goal started successfully!');
        onCancel();
      } else {
        alert(`Failed to start goal: ${data.message}`);
      }
    } catch (error) {
      console.error('Failed to start goal:', error);
      alert(`Failed to start goal: ${error.message}`);
    }
  };

  const postponeGoal = async () => {
    try {
      const response = await fetch(`${HOST}/goal/postponeGoal/${goalDetails.id}`, {
        method: 'PUT', 
      });
      const data = await response.json();
      if (response.ok) {
        alert('Goal has been postponed to another date');
        onCancel();
        
      } else {
        alert(`Failed to postpone goal: ${data.message}`);
      }
    } catch (error) {
      console.error('Failed to postpone goal:', error);
      alert(`Failed to postpone goal: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"> 
      <div className="bg-[#393E46] p-8 rounded w-full max-w-2xl max-h-[80vh] overflow-auto mx-auto my-auto" style={{border: '1px solid #00ADB5'}}>
      <div className="flex justify-between items-center">
  <h2 className="text-xl font-bold" style={{ color: '#F8DE22' }}>{isViewMode ? 'View Goal Details' : 'Add Goal Details'}</h2>
  {isViewMode && (
    <button 
    className="bg-[#00ADB5] hover:bg-[#222831] text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out" 
    onClick={() => isEditMode ? setIsEditMode(false) : handleEdit()}
  >
    {isEditMode ? 'Cancel Edit' : 'Edit'}
  </button>
  
  
  )}
</div>

    
        <label className="block mb-2">Goal:</label>
<textarea 
  name="goal" 
  value={goalDetails.goal}
  placeholder="Describe your goal. Dream big, but be clear and concise. What change do you want to achieve?" 
  onChange={handleChange} 
  className="border p-2 rounded w-full mb-4 text-black bg-white" 
  disabled={isViewMode && !isEditMode}
/>

<label className="block mb-2">Category:</label>
      {isViewMode && !isEditMode ? (
        <textarea 
          name="goal" 
          value={goalDetails.category}
          onChange={handleChange} 
          className="border p-2 rounded w-full mb-4 text-black bg-white" 
          disabled={true}
        />
      ) : (
        <select 
          name="category" 
          value={goalDetails.category} 
          onChange={handleChange} 
          className="border p-2 rounded w-full mb-4 text-black" 
          disabled={isViewMode && !isEditMode}
        >
          <option value="">Select category</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      )}

        
        <label className="block mb-2">Specific:</label>
        <textarea name="specific" value={goalDetails.specific} placeholder="Who is involved? What do you want to accomplish? Where? Why?" onChange={handleChange} className="border p-2 rounded w-full mb-4 text-black bg-white" disabled={isViewMode && !isEditMode}/>

        <label className="block mb-2">Measurable:</label>
        <textarea name="measurable" value={goalDetails.measurable} placeholder="How will you measure success? What metrics will indicate that the goal has been achieved?" onChange={handleChange} className="border p-2 rounded w-full mb-4 text-black bg-white" disabled={isViewMode && !isEditMode} />

        <label className="block mb-2">Achievable:</label>
        <textarea name="attainable" value={goalDetails.attainable} placeholder="Is the goal attainable? Do you have the necessary resources and capabilities?" onChange={handleChange} className="border p-2 rounded w-full mb-4 text-black bg-white" disabled={isViewMode && !isEditMode} />

        <label className="block mb-2">Relevant:</label>
        <textarea name="relevant" value={goalDetails.realistic} placeholder="Why is the goal important? How does it align with broader objectives?" onChange={handleChange} className="border p-2 rounded w-full mb-4 text-black bg-white" disabled={isViewMode && !isEditMode}/>

        <label className="block mb-2">Time-bound:</label>
        <textarea name="timeBound" value={goalDetails.time_bound} placeholder="When should the goal be achieved? Set a clear timeframe." onChange={handleChange} className="border p-2 rounded w-full mb-4 text-black bg-white" disabled={isViewMode && !isEditMode}/>

        <label className="block mb-2">Intention:</label>
        <textarea name="intention" value={goalDetails.intention} placeholder="What is the deeper purpose behind this goal? Think about the core reasons that motivate you to pursue this achievement." onChange={handleChange} className="border p-2 rounded w-full mb-4 text-black bg-white" disabled={isViewMode && !isEditMode} />

        <label className="block mb-2">Why:</label>
        <textarea name="why" value={goalDetails.why} placeholder="Explain why this goal is important to you and possibly to others. How does achieving this goal align with your values or long-term objectives?" onChange={handleChange} className="border p-2 rounded w-full mb-4 text-black bg-white" disabled={isViewMode && !isEditMode} />

        <label className="block mb-2">How:</label>
        <textarea name="how" value={goalDetails.how} placeholder="Outline the steps you'll take to achieve this goal. What actions will you perform to turn your vision into reality?" onChange={handleChange} className="border p-2 rounded w-full mb-4 text-black bg-white" disabled={isViewMode && !isEditMode} />

        <label className="block mb-2">Plan Start:</label>
<div className="flex space-x-3">
  {isViewMode && !isEditMode ? (
    <>
      <p className="border p-2 rounded w-1/2">{goalDetails.plan_start}</p>
    </>
  ) : (
    <>
      <select name="planStartMonth" value={goalDetails.planStartMonth} onChange={handleChange} className="border p-2 rounded w-1/2 text-black">
  {months.map((month, index) => (
    <option key={index} value={month} selected={month === goalDetails.planStartMonth}>{month}</option>
  ))}
</select>
<select name="planStartYear" value={goalDetails.planStartYear} onChange={handleChange} className="border p-2 rounded w-1/2 text-black">
  {year_option.map(year => (
    <option key={year} value={year} selected={year.toString() === goalDetails.planStartYear}>{year}</option>
  ))}
</select>

    </>
  )}
</div>


<label className="block mb-2">Plan End:</label>
<div className="flex space-x-3">
  {isViewMode && !isEditMode ? (
    <>
      <p className="border p-2 rounded w-1/2">{goalDetails.plan_end}</p>
    </>
  ) : (
    <>
      <select name="planCompleteMonth" value={goalDetails.planCompleteMonth} onChange={handleChange} className="border p-2 rounded w-1/2 text-black">
        {months.map((month, index) => (
    <option key={index} value={month} selected={month === goalDetails.planCompleteMonth}>{month}</option>
    ))}
      </select>
      <select name="planCompleteYear" value={goalDetails.planCompleteYear} onChange={handleChange} className="border p-2 rounded w-1/2 text-black">
        {year_option.map(year => (
    <option key={year} value={year} selected={year.toString() === goalDetails.planCompleteYear}>{year}</option>
    ))}
      </select>
    </>
  )}
</div>



        
<label className="block mb-2">Year:</label>
{isViewMode && !isEditMode ? (
  <p className="border p-2 rounded w-full mb-4 text-black bg-white">{goalDetails.year}</p>
) : (
  <select 
    name="year" 
    value={goalDetails.year || ''} 
    onChange={handleChange} 
    className="border p-2 rounded w-full mb-4 text-black bg-white"
    disabled={isViewMode && !isEditMode} 
  >
    <option value="">Select year</option>
    {years.map(year => (
      <option key={year} value={year}>{year}</option>
    ))}
  </select>
)}



<div className="flex justify-end space-x-4">
{isCurrentGoalsContext ? (
    <>
      {isEditMode ? (
        <>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleRemoveGoal}>Remove Goal</button>
          <button className="bg-[#00ADB5] hover:bg-[#222831] text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out" onClick={handleSaveEdit}>Save Edit</button>
        </>
      ) : (
        <>
          <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded" onClick={postponeGoal}>Continue Later</button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={onCancel}>Cancel</button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleMarkAsCompleted}>Mark as Completed</button>
        </>
      )}
    </>
          ) : (
            <>
           
              <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded" onClick={onCancel}>Cancel</button>
              {!isViewMode && (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onSave}>Save</button>
              )}
              {currentYearPage && (
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={startGoal}>Start Goal</button>
              )}
              {isEditMode && (
                <>
                 <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleRemoveGoal}>Remove Goal</button>
                <button className="bg-[#00ADB5] hover:bg-[#222831] text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out" onClick={handleSaveEdit}>Save Edit</button>
              </>
                            )}
            </>
          )}
        </div>






      </div>
    </div>
  );
}

export default GoalDetails;
