import { useMemo, useState, useEffect } from "react";
import { ColumnContainerCard } from "./columnContainerWrapper";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskCard } from "./taskCard";
import { axiosInstance } from "src/api/AxiosConfig";

export function KanbanBoard() {
  const [columns, setColumns] = useState([]);
  const [boardId, setBoardData] = useState();
  const [isLoading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // ---------------- END STATE INITIATE ----------------

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  // ---------------- Task Handlers ----------------
  const handleTaskUpdate = (tasks, updatedTask) => {
    const updatedTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
    setTasks(updatedTasks);
  };

  const handleApiError = (error, action) => {
    console.error(`Error ${action}:`, error);
  };

  const createTask = async (columnId) => {
    try {
      const response = await axiosInstance.post("todo/", {
        title: `New Task`,
        importance: 1,
        difficulty: 1,
        challenge: false,
        fromSystem: false,
        is_active: false,
        is_full_day_event: false,
        completed: false,
        priority: 1,
        list_board: columnId,
      });
      const newTask = {
        id: response.data.id,
        columnId,
        content: response.data.title,
      };

      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      handleApiError(error, "creating task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axiosInstance.delete(`todo/${id}/`);
      const newTasks = tasks.filter((task) => task.id !== id);
      setTasks(newTasks);
    } catch (error) {
      handleApiError(error, "deleting task");
    }
  };

  const updateTask = async (id, content, tasks) => {
    try {
      if (content === "") {
        await deleteTask(id);
      } else {
        const response = await axiosInstance.put(`todo/${id}/`, { content });

        const updatedTask = {
          id,
          columnId: response.data.list_board,
          content: response.data.title,
        };

        handleTaskUpdate(tasks, updatedTask);
      }
    } catch (error) {
      handleApiError(error, "updating task");
    }
  };

  // ---------------- END Task Handlers ----------------

  // ---------------- Fetch Data ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await axiosInstance.get("/todo");

        // Transform
        const transformedTasks = tasksResponse.data.map((task) => ({
          id: task.id,
          columnId: task.list_board,
          content: task.title,
          difficulty: task.difficulty,
          notes: task.notes,
          importance: task.importance,
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
        const transformedColumns = columnsResponse.data.map((column) => ({
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

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("boards/");
        if (response.data && response.data.length > 0) {
          setBoardData(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching board data:", error);
        setLoading(false);
      }
      setLoading(false);
    };
    fetchBoardData();
  }, []);

  // ---------------- END Fetch Data ----------------

  return (
    <div
      className="
      m-auto
      flex
      w-full
      items-center
      justify-center
      overflow-x-auto
      overflow-y-hidden
  ">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <div className="flex gap-4">
          <div className="flex gap-4">
            {!isLoading ? (
              <SortableContext items={columnsId}>
                {columns.map((col) => (
                  <ColumnContainerCard
                    key={col.id}
                    column={col}
                    createTask={createTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    tasks={(tasks || []).filter((task) => task.columnId === col.id)}
                  />
                ))}{" "}
              </SortableContext>
            ) : (
              <span className="loading loading-dots loading-lg"></span>
            )}
          </div>
        </div>

        {createPortal(
          <DragOverlay className="bg-white" dropAnimation={null} zIndex={20}>
            {/* Render the active task as a draggable overlay */}
            <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  // Handle the start of a drag event
  function onDragStart(event) {
    // Check if the dragged item is a Task
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  // Handle the end of a drag event
  function onDragEnd(event) {
    // Reset active column and task after the drag ends
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return; // If not dropped over anything, exit

    const activeId = active.id;
    const overId = over.id;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverAColumn = over.data.current?.type === "Column";
    const isOverATask = over.data.current?.type === "Task";

    // Reorder logic for Tasks within the same column
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        const reorderedTasks = arrayMove(tasks, activeIndex, overIndex);

        return reorderedTasks;
      });
    }

    // Move tasks between columns and update columnId
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;

        // API call to update task's columnId
        axiosInstance
          .put(`todo/change_task_list_board/`, { todo_id: activeId, new_list_board_id: overId, new_index: 0 })
          .then((response) => {})
          .catch((error) => {
            console.error("Error updating task columnId:", error);
          });

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  // Handle the drag-over event
  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return; // If not over anything, exit

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return; // If over the same element, exit

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return; // If not dragging a Task, exit

    // Reorder logic for Tasks within the same column
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        // If moving to a different column, update columnId
        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";
    // Move the Task to a different column and update columnId
    if (isActiveATask && isOverAColumn && tasks.some((task) => task.columnId !== overId)) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}
