import React from 'react';

function ActivityModal({ activity, onClose, onContinueLater, onMarkAsCompleted }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50  flex items-center justify-center p-4">
      <div className="bg-[#393E46] p-8 rounded w-full max-w-md" style={{ color: '#EEEEEE', border: '1px solid #00ADB5' }}>
        <h2 className="text-2xl font-bold mb-4">Activity Details</h2>
  
        <p><strong>Activity:</strong> {activity.activity}</p>
        <p><strong>Associated Goal:</strong> {activity.goal}</p>
        <div className="flex justify-between mt-4">
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded transition duration-300 ease-in-out" onClick={onClose}>Close</button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded transition duration-300 ease-in-out" onClick={onContinueLater}>Continue Later</button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded transition duration-300 ease-in-out" onClick={onMarkAsCompleted}>Mark as Completed</button>
        </div>
      </div>
    </div>
  );
}

export default ActivityModal;
