import React, { useState } from "react";
import Column from "./Column";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, content: "Task 1" },
    { id: 2, content: "Task 2" },
    { id: 3, content: "Task 3" },
  ]);

  const [columns, setColumns] = useState({
    backlog: tasks,
    inProgress: [],
    done: [],
  });

  const handleTaskDelete = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);

    const updatedColumns = {
      ...columns,
      backlog: updatedTasks,
      inProgress: columns.inProgress.filter((task) => task.id !== taskId),
      done: columns.done.filter((task) => task.id !== taskId),
    };
    setColumns(updatedColumns);
  };


