import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useMemo } from "react";
import { TaskCard } from "./taskCard";

export function ColumnContainer({ column, createTask, tasks, deleteTask, updateTask }) {
  // Memoize task IDs to prevent unnecessary recalculations
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="
  bg-[#f1f2f4]
  w-[280px]
  max-h-[400px]
  rounded-md
  flex
  flex-col
  ">
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        className="
      ml-3
      text-md
      font-bold
      flex
      items-center
      justify-between
      ">
        <div className="flex gap-2">{column.title}</div>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-2 p-1 overflow-x-hidden overflow-y-auto">
        {/* Provide a SortableContext for the tasks within the column */}
        <SortableContext items={tasksIds}>
          {/* Render TaskCard for each task in the column */}
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
              // Adjust the useSortable hook for tasks to enable dragging
              useSortable={(props) => useSortable({ ...props, disabled: false })}
            />
          ))}
        </SortableContext>
      </div>

      {/* Column footer */}
      <button
        className="flex gap-2 items-center rounded-md p-2 my-2 hover:bg-zinc-200 active:bg-zinc-400"
        onClick={() => {
          createTask(column.id);
        }}>
        <AiOutlinePlusCircle />
        Add task
      </button>
    </div>
  );
}
