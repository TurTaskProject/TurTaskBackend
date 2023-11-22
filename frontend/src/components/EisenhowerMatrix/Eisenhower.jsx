import React, { useState, useEffect } from "react";
import { FiAlertCircle, FiClock, FiXCircle, FiCheckCircle } from "react-icons/fi";
import { readTodoTasks } from "../../api/TaskApi";
import axiosInstance from "src/api/AxiosConfig";

function EachBlog({ name, colorCode, contentList, icon }) {
  const [tasks, setTasks] = useState(contentList);

  const handleCheckboxChange = async (index) => {
    try {
      setTasks(contentList);

      const updatedTasks = [...tasks];
      const taskId = updatedTasks[index].id;

      const response = await axiosInstance.patch(`todo/${taskId}/`, {
        completed: !updatedTasks[index].completed,
      });

      updatedTasks[index].completed = response.data.completed;

      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className={`h-full text-left p-4 rounded-lg bg-white border border-gray-300 overflow-y-auto`}>
      <div className="flex" style={{ color: colorCode }}>
        <span className="mx-2 mt-1">{icon}</span>
        <span>{name}</span>
      </div>
      <hr className="my-3 h-0.5 border-t-0 bg-gray-300 opacity-100 dark:opacity-50" />
      <div className="space-y-2">
        {contentList && contentList.length > 0 ? (
          contentList.map((item, index) => (
            <div key={index} className="flex items-start">
              <input
                type="checkbox"
                checked={item.completed}
                className="checkbox mt-1 mr-2"
                onChange={() => handleCheckboxChange(index)}
              />
              <label className={`cursor-pointer ${item.completed ? "line-through text-gray-500" : ""}`}>
                {item.title}
              </label>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No tasks</p>
        )}
      </div>
    </div>
  );
}

function Eisenhower() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    readTodoTasks()
      .then((data) => {
        console.log(data);
        const contentList_ui = data.filter((task) => task.priority === 1);
        const contentList_uni = data.filter((task) => task.priority === 2);
        const contentList_nui = data.filter((task) => task.priority === 3);
        const contentList_nuni = data.filter((task) => task.priority === 4);

        setTasks({
          contentList_ui,
          contentList_uni,
          contentList_nui,
          contentList_nuni,
        });
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  return (
    <div className="bg-slate-100 text-left p-4 w-full h-max">
      <div className="grid grid-rows-2 grid-cols-2 gap-2">
        <EachBlog
          name="Urgent & Important"
          colorCode="#ff5f68"
          icon={<FiAlertCircle />}
          contentList={tasks.contentList_ui}
        />
        <EachBlog
          name="Urgent & Not important"
          colorCode="#ffb000"
          icon={<FiClock />}
          contentList={tasks.contentList_uni}
        />
        <EachBlog
          name="Not urgent & Important"
          colorCode="#4772fa"
          icon={<FiCheckCircle />}
          contentList={tasks.contentList_nui}
        />
        <EachBlog
          name="Not urgent & Not important"
          colorCode="#0cce9c"
          icon={<FiXCircle />}
          contentList={tasks.contentList_nuni}
        />
      </div>
    </div>
  );
}

export default Eisenhower;
