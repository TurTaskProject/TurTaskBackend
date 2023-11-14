import React from 'react';

function EachBlog({ name, colorCode }) {
  return (
    <div className={`grid grid-rows-2 gap-4 text-left p-4 rounded-lg bg-white border border-gray-300 shadow-md`}>
      <div className={`text-xl font-bold`} style={{ color: colorCode }}>
        {name}
      </div>
      <div className='h-36'>
        Content goes here
      </div>
    </div>
  );
}

function Eisenhower() {
  return (
    <div className='bg-slate-100 text-left p-4 m-auto w-full'>
      <h1 className="text-3xl font-bold mb-4">The Eisenhower Matrix</h1>
      <div className='grid grid-rows-2 grid-cols-2 gap-2'>
        <EachBlog name="Urgent & Important" colorCode="#FF5733" />
        <EachBlog name="Urgent & Not important" colorCode="#FDDD5C" />
        <EachBlog name="Not urgent & Important" colorCode="#189AB4" />
        <EachBlog name="Not urgent & Not important" colorCode="#94FA92" />
      </div>
    </div>
  );
}

export default Eisenhower;
