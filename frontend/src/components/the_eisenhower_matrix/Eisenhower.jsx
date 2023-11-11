import React from 'react';

function EachBlog({ name, colorCode }) {
  return (
    <div className="grid grid-rows-2 gap-4 text-left p-4 rounded-lg bg-white">
      <div className="text-xl font-bold" style={{ color: colorCode }}>
        {name}
      </div>
      <div>
        content
      </div>
    </div>
  );
}

function Eisenhower() {
  return (
    <div className='bg-slate-200 text-left p-1 m-auto'>
      <h1 className="text-xl font-bold">The Eisenhower Matrix</h1>
      <div className='p-4 m-auto grid grid-rows-2 grid-cols-2 gap-4'>
        <EachBlog name="Urgent & Important" colorCode="#FF5733" />
        <EachBlog name="Urgent & Not important" colorCode="#FDDD5C" />
        <EachBlog name="Not urgent & Important" colorCode="#189AB4" />
        <EachBlog name="Not urgent & Not important" colorCode="#94FA92" />
      </div>
    </div>
  );
}

export default Eisenhower;
