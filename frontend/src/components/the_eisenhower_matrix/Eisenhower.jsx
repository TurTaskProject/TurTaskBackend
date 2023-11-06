import React from 'react';

// Styles for row headers
const rowHeaderStyle = "bg-pink-300 text-pink-700 p-4 rounded-lg font-semibold text-lg shadow-md";

// Styles for column headers
const columnHeaderStyle = "bg-blue-300 text-blue-700 p-4 rounded-lg font-semibold text-lg shadow-md";

// Styles for content cells in green
const greenContextStyle = "bg-green-300 text-green-700 p-4 rounded-lg text-lg shadow-md";

// Styles for content cells in yellow
const yellowContextStyle = "bg-yellow-300 text-yellow-700 p-4 rounded-lg text-lg shadow-md";

function Eisenhower() {
  return (
    <div className="grid grid-rows-3 grid-flow-col gap-3 m-auto w-1/2 h-auto p-5 bg-slate-500 rounded-lg shadow-md">
      <div className="bg-indigo-300 text-indigo-700 p-4 rounded-lg font-semibold text-2xl shadow-lg">
        Eisenhower Matrix
      </div>
      {/* Row Headers */}
      <div className={rowHeaderStyle}>Important</div>
      <div className={rowHeaderStyle}>Not Important</div>

      {/* Column Headers */}
      <div className={columnHeaderStyle}>Urgent</div>

      {/* Content Cells */}
      <div className={greenContextStyle}>
        Urgent & Important
      </div>
      <div className={yellowContextStyle}>
        Urgent & Not Important
      </div>

      {/* Column Headers */}
      <div className={columnHeaderStyle}>Not Urgent</div>

      {/* Content Cells */}
      <div className={yellowContextStyle}>
        Not Urgent & Important
      </div>
      <div className={greenContextStyle}>
        Not Urgent & Not Important
      </div>
    </div>
  );
}

export default Eisenhower;
