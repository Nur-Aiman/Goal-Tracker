import React from 'react';

function AddNewYear({ year, setYear, onSave, onCancel }) {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#393E46] p-8 rounded" style={{ border: '1px solid #00ADB5' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#F8DE22' }}>Add New Year</h2>
        <input
          type="number"
          placeholder="Enter year"
          className="border p-2 rounded mb-4 w-full"
          style={{ borderColor: '#00ADB5', backgroundColor: 'white', color: 'black' }}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <div className="flex justify-end space-x-4">
          <button
            className="bg-[#00ADB5] hover:bg-[#222831] text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-[#00ADB5] hover:bg-[#222831] text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNewYear;
