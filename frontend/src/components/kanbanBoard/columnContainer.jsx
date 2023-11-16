import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { BsFillTrashFill } from "react-icons/bs";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./taskCard";

function ColumnContainer({ column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask }) {
  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map(task => task.id);
  }, [tasks]);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
      opacity-40
      border-2
      border-blue-500
      w-[350px]
      max-h-[400px]
      rounded-md
      flex
      flex-col
      "></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
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
        onClick={() => {
          setEditMode(true);
        }}
        className="
      bg-mainBackgroundColor
      text-md
      h-[60px]
      cursor-grab
      rounded-md
      rounded-b-none
      p-3
      font-bold
      border-columnBackgroundColor
      border-4
      flex
      items-center
      justify-between
      ">
        <div className="flex gap-2">
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-gray-200 focus:border-blue-500 border rounded-md outline-none px-2"
              value={column.title}
              onChange={e => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={e => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="
        stroke-gray-500
        hover:stroke-white
        hover:bg-columnBackgroundColor
        rounded
        px-1
        py-2
        ">
          <BsFillTrashFill />
        </button>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
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

export default ColumnContainer;
