import { useMemo, useState, useEffect } from "react";
import ColumnContainerCard from "./columnContainerWrapper";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./taskCard";
import { AiOutlinePlusCircle } from "react-icons/ai";
import axiosInstance from "../../api/configs/AxiosConfig";

function KanbanBoard() {
  const [columns, setColumns] = useState([]);
  const columnsId = useMemo(() => columns.map(col => col.id), [columns]);

  const [tasks, setTasks] = useState([]);

  const [activeColumn, setActiveColumn] = useState(null);

  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  // Example
  //   {
  //     "id": 95,
  //     "title": "Test Todo",
  //     "notes": "Test TodoTest TodoTest Todo",
  //     "importance": 1,
  //     "difficulty": 1,
  //     "challenge": false,
  //     "fromSystem": false,
  //     "creation_date": "2023-11-20T19:50:16.369308Z",
  //     "last_update": "2023-11-20T19:50:16.369308Z",
  //     "is_active": true,
  //     "is_full_day_event": false,
  //     "start_event": "2023-11-20T19:49:49Z",
  //     "end_event": "2023-11-23T18:00:00Z",
  //     "google_calendar_id": null,
  //     "completed": true,
  //     "completion_date": "2023-11-20T19:50:16.369308Z",
  //     "priority": 3,
  //     "user": 1,
  //     "list_board": 1,
  //     "tags": []
  //   }
  // ]

  // [
  //   {
  //     "id": 8,
  //     "name": "test",
  //     "position": 2,
  //     "board": 3
  //   }
  // ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await axiosInstance.get("/todo");

        // Transform
        const transformedTasks = tasksResponse.data.map(task => ({
          id: task.id,
          columnId: task.list_board,
          content: task.title,
          difficulty: task.difficulty,
          notes: task.notes,
          importance: task.importance,
          difficulty: task.difficulty,
          challenge: task.challenge,
          fromSystem: task.fromSystem,
          creation_date: task.creation_date,
          last_update: task.last_update,
          is_active: task.is_active,
          is_full_day_event: task.is_full_day_event,
          start_event: task.start_event,
          end_event: task.end_event,
          google_calendar_id: task.google_calendar_id,
          completed: task.completed,
          completion_date: task.completion_date,
          priority: task.priority,
          user: task.user,
          list_board: task.list_board,
          tags: task.tags,
        }));
        setTasks(transformedTasks);

        const columnsResponse = await axiosInstance.get("/lists");

        // Transform
        const transformedColumns = columnsResponse.data.map(column => ({
          id: column.id,
          title: column.name,
        }));
        setColumns(transformedColumns);
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className="
      m-auto
      flex
      w-full
      items-center
      overflow-x-auto
      overflow-y-hidden
  ">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <div className="ml-2 flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map(col => (
                <ColumnContainerCard
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter(task => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          {/* create new column */}
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="
                    h-[60px]
                    w-[268px]
                    max-w-[268px]
                    cursor-pointer
                    rounded-xl
                    bg-[#f1f2f4]
                    border-2
                    p-4
                    hover:bg-gray-200
                    flex
                    gap-2
                    my-2
                    bg-opacity-60
                    ">
            <div className="my-1">
              <AiOutlinePlusCircle />
            </div>
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay className="bg-white" dropAnimation={null} zIndex={20}>
            {activeColumn && (
              <ColumnContainerCard
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(task => task.columnId === activeColumn.id)}
              />
            )}
            {activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId) {
    const newTask = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id) {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id, content) {
    const newTasks = tasks.map(task => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    if (content === "") return deleteTask(id);
    setTasks(newTasks);
  }

  function createNewColumn() {
    const columnToAdd = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id) {
    const filteredColumns = columns.filter(col => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter(t => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id, title) {
    const newColumns = columns.map(col => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function onDragStart(event) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const isActiveAColumn = active.data.current?.type === "Column";
    const isActiveATask = active.data.current?.type === "Task";
    const isOverAColumn = over.data.current?.type === "Column";
    const isOverATask = over.data.current?.type === "Task";

    // Reorder columns if the dragged item is a column
    if (isActiveAColumn && isOverAColumn) {
      setColumns(columns => {
        const activeColumnIndex = columns.findIndex(col => col.id === activeId);
        const overColumnIndex = columns.findIndex(col => col.id === overId);

        const reorderedColumns = arrayMove(columns, activeColumnIndex, overColumnIndex);

        axiosInstance
          .put("todo/change_task_list_board/", { columns: reorderedColumns })
          .then(response => {
            // Successful handle
          })
          .catch(error => {
            console.error("Error updating column order:", error);
          });

        return reorderedColumns;
      });
    }

    // Reorder tasks within the same column
    if (isActiveATask && isOverATask) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId);
        const overIndex = tasks.findIndex(t => t.id === overId);

        const reorderedTasks = arrayMove(tasks, activeIndex, overIndex);

        return reorderedTasks;
      });
    }

    // Move tasks between columns and update columnId
    if (isActiveATask && isOverAColumn) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId);
        const overIndex = tasks.findIndex(t => t.id === overId);

        const newColumnId = overId;
        const new_index = event.over?.index;

        if (newColumnId != tasks[activeIndex].columnId) {
        // Update the columnId of the task
        tasks[activeIndex].columnId = newColumnId;
        
        axiosInstance
          .put(`todo/change_task_order/`, { activeId, newColumnId, new_index })
          .then(response => {
            // Successful update handle
          })
          .catch(error => {
            console.error("Error updating task columnId and index:", error);
          });
        }

        // If new_index is not provided, insert the task at the end
        if (new_index !== null && 0 <= new_index && new_index <= tasks.length) {
          return arrayMove(tasks, activeIndex, new_index);
        } else {
          return arrayMove(tasks, activeIndex, tasks.length);
        }
      });
    }
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId);
        const overIndex = tasks.findIndex(t => t.id === overId);

        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  function generateId() {
    return Math.floor(Math.random() * 10001);
  }
}

export default KanbanBoard;
