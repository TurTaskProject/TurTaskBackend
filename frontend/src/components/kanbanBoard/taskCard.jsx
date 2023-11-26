import { useState } from "react";
import { BsFillTrashFill, BsPencilSquare } from "react-icons/bs"; // Import the pencil icon
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskDetailModal } from "./taskDetailModal";

export function TaskCard({ task, deleteTask, updateTask }) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTaskName, setEditedTaskName] = useState(task.content);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
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
        className="opacity-30 bg-mainBackgroundColor p-2.5 items-center flex text-left rounded-xl border-2 border-gray-400 cursor-grab relative"
      />
    );
  }

  const startEditing = () => {
    setIsEditing(true);
  };

  const stopEditing = () => {
    setIsEditing(false);
    // Update the task name if it has changed
    if (editedTaskName !== task.content) {
      console.log("Updating task:", task.id, editedTaskName);
      updateTask(task.id, { ...task, content: editedTaskName });
    }
  };

  return (
    <div>
      <TaskDetailModal
        taskId={task.id}
        title={task.content}
        description={task.description}
        tags={task.tags}
        difficulty={task.difficulty}
        challenge={task.challenge}
        importance={task.importance}
      />
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className="justify-center items-center flex text-left rounded-xl cursor-grab relative hover:border-2 hover:border-blue-400 shadow bg-white"
        onMouseEnter={() => {
          setMouseIsOver(true);
        }}
        onMouseLeave={() => {
          setMouseIsOver(false);
        }}
      >
        {isEditing ? (
          <input
            type="text"
            className="p-2.5 my-auto w-full rounded-xl shadow bg-white"
            value={editedTaskName}
            onChange={(e) => setEditedTaskName(e.target.value)}
            onBlur={stopEditing}
            autoFocus
          />
        ) : (
          <p
            className="p-2.5 my-auto w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap rounded-xl shadow bg-white"
            onClick={() => document.getElementById(`task_detail_modal_${task.id}`).showModal()}
          >
            {task.content}
          </p>
        )}

        {mouseIsOver && (
          <div className="flex absolute right-0 top-1/2 transform -translate-y-1/2">
            {!isEditing && (
              <button
                onClick={startEditing}
                className="p-2 mx-1 bg-white rounded-full hover:opacity-100"
              >
                <BsPencilSquare />
              </button>
            )}
            <button
              onClick={() => {
                deleteTask(task.id);
              }}
              className="p-2 mx-1 bg-white rounded-full hover:opacity-100"
            >
              <BsFillTrashFill />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
