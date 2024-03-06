import React from 'react';

function ActivityDetails({ activity, activityId, goalName, onStart, onEdit, onRemove, onCancel }) {
  const handleBackdropClick = (event) => {
  
        if (event.target.id === "modal-backdrop") {
          onCancel();
        }
      };
    
      return (
        <div id="modal-backdrop" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
          <div className="bg-[#393E46] p-8 rounded w-full max-w-md" style={{border: '1px solid #00ADB5'}}>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#F8DE22' }}>Activity Details</h2>
            <p className="mb-4"><strong>Activity:</strong> {activity}</p>
            <p className="mb-4"><strong>Associated Goal:</strong> {goalName}</p>
            <div className="flex justify-end space-x-4">
            <button
  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
  onClick={() => onRemove(activityId)}>
  Remove Activity
</button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onEdit}>Edit</button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => onStart(activity.id)}>Start Activity</button>
        </div>
          </div>
        </div>
      );
    }

export default ActivityDetails;
