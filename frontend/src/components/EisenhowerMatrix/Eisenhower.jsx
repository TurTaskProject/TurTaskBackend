import React, { useState } from "react";
import { FiAlertCircle, FiClock, FiXCircle, FiCheckCircle } from "react-icons/fi";

function EachBlog({ name, colorCode, contentList, icon }) {
  const [tasks, setTasks] = useState(contentList);

  const handleCheckboxChange = index => {
    const updatedTasks = [...tasks];
    updatedTasks[index].checked = !updatedTasks[index].checked;
    setTasks(updatedTasks);
  };

  return (
    <div className={`h-full text-left p-4 rounded-lg bg-white border border-gray-300 overflow-y-auto`}>
      <div className="flex" style={{ color: colorCode }}>
        <span className="mx-2 mt-1">{icon}</span>
        <span>{name}</span>
      </div>
      <hr className="my-3 h-0.5 border-t-0 bg-gray-300 opacity-100 dark:opacity-50" />
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks</p>
        ) : (
          tasks.map((item, index) => (
            <div key={index} className="flex items-start">
              <input
                type="checkbox"
                checked={item.checked}
                className="checkbox mt-1 mr-2"
                onChange={() => handleCheckboxChange(index)}
              />
              <label className="cursor-pointer">{item.text}</label>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Eisenhower() {
  const contentList_ui = [
    { text: "Complete report for the meeting", checked: true },
    { text: "Review project proposal", checked: false },
    { text: "Submit expense report", checked: false },
    { text: "Complete report for the meeting", checked: true },
    { text: "Review project proposal", checked: false },
    { text: "Submit expense report", checked: false },
    { text: "Complete report for the meeting", checked: true },
    { text: "Review project proposal", checked: false },
    { text: "Submit expense report", checked: false },
  ];

  const contentList_uni = [];
  const contentList_nui = [];
  const contentList_nuni = [];

  return (
    <div className="bg-slate-100 text-left p-4 w-full">
      <div className="grid grid-rows-2 grid-cols-2 gap-2">
        <EachBlog name="Urgent & Important" colorCode="#ff5f68" icon={<FiAlertCircle />} contentList={contentList_ui} />
        <EachBlog name="Urgent & Not important" colorCode="#ffb000" icon={<FiClock />} contentList={contentList_uni} />
        <EachBlog
          name="Not urgent & Important"
          colorCode="#4772fa"
          icon={<FiCheckCircle />}
          contentList={contentList_nui}
        />
        <EachBlog
          name="Not urgent & Not important"
          colorCode="#0cce9c"
          icon={<FiXCircle />}
          contentList={contentList_nuni}
        />
      </div>
    </div>
  );
}

export default Eisenhower;
