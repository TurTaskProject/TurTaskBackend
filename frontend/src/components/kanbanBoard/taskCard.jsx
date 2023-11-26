import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskDetailModal } from "./taskDetailModal";
import { GoChecklist, GoArchive } from "react-icons/go";

export function TaskCard({ task, deleteTask, updateTask }) {
  // State to track if the mouse is over the task card
  const [mouseIsOver, setMouseIsOver] = useState(false);

  // DnD Kit hook for sortable items
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  // Style for the task card, adjusting for dragging animation
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // ---- DESC AND TAG ---- */

  // Tags
  const tags =
    task.tags.length > 0 ? (
      <div className="flex flex-wrap mx-3 mt-4">
        {task.tags.map((tag, index) => (
          <div
            key={index}
            className={`text-xs inline-flex items-center font-bold leading-sm uppercase px-2 py-1 bg-${tag.color}-200 text-${tag.color}-700 rounded-full`}>
            {tag.label}
          </div>
        ))}
      </div>
    ) : null;

  // difficulty?
  const difficultyTag = task.difficulty ? (
    <span
      className={`text-[10px] inline-flex items-center font-bold leading-sm uppercase px-2 py-1 rounded-full ${
        task.difficulty === 1
          ? "bg-blue-200 text-blue-700"
          : task.difficulty === 2
          ? "bg-green-200 text-green-700"
          : task.difficulty === 3
          ? "bg-yellow-200 text-yellow-700"
          : task.difficulty === 4
          ? "bg-purple-200 text-purple-700"
          : "bg-red-200 text-red-700"
      }`}>
      difficulty
    </span>
  ) : null;

  // Due Date
  const dueDateTag =
    task.end_event && new Date(task.end_event) > new Date()
      ? (() => {
          const daysUntilDue = Math.ceil((new Date(task.end_event) - new Date()) / (1000 * 60 * 60 * 24));

          let colorClass =
            daysUntilDue >= 365
              ? "gray-200"
              : daysUntilDue >= 30
              ? "blue-200"
              : daysUntilDue >= 7
              ? "green-200"
              : daysUntilDue > 0
              ? "yellow-200"
              : "red-200";

          const formattedDueDate =
            daysUntilDue >= 365
              ? new Date(task.end_event).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : new Date(task.end_event).toLocaleDateString("en-US", { day: "numeric", month: "short" });

          return (
            <span className={`bg-${colorClass} text-[10px] font-xl font-bold px-2 py-1 rounded-full`}>
              Due: {formattedDueDate}
            </span>
          );
        })()
      : null;

  // Subtask count
  const subtaskCountTag = task.subtaskCount ? (
    <span className="bg-green-200 text-green-600 text-[10px] font-xl font-bold me-2 px-2.5 py-0.5 rounded">
      <GoChecklist /> {task.subtaskCount}
    </span>
  ) : null;

  // ---- DRAG STATE ---- */

  // If the card is being dragged
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-mainBackgroundColor p-2.5 items-center flex text-left rounded-xl border-2 border-gray-400 cursor-grab relative"
      />
    );
  }

  // If the card is not being dragged
  return (
    <div>
      {/* Task Detail Modal */}
      <TaskDetailModal
        taskId={task.id}
        title={task.content}
        description={task.description}
        tags={task.tags}
        difficulty={task.difficulty}
        challenge={task.challenge}
        importance={task.importance}
        updateTask={updateTask}
      />

      {/* -------- Task Card -------- */}
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className="justify-center flex flex-col text-left rounded-xl cursor-grab relative hover:border-2 hover:border-blue-400 shadow bg-white"
        onMouseEnter={() => {
          setMouseIsOver(true);
        }}
        onMouseLeave={() => {
          setMouseIsOver(false);
        }}>
        {/* -------- Task Content -------- */}
        {/* Tags */}
        {tags}
        <div>
          {/* Title */}
          <p
            className={`p-2.5 my-auto w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap rounded-xl bg-white font-semibold`}
            onClick={() => document.getElementById(`task_detail_modal_${task.id}`).showModal()}>
            {task.content}
          </p>
          {/* -------- Archive Task Button -------- */}
          {mouseIsOver && (
            <button
              onClick={() => {
                deleteTask(task.id);
              }}
              className="stroke-white absolute right-0 top-1/2 rounded-full bg-white -translate-y-1/2 bg-columnBackgroundColor p-2 hover:opacity-100 ">
              <GoArchive />
            </button>
          )}
        </div>
        {/* Description */}
        <div className="flex flex-wrap mb-4 mx-3 space-x-1">
          {difficultyTag}
          {dueDateTag}
          {subtaskCountTag}
        </div>
      </div>
    </div>
  );
}
