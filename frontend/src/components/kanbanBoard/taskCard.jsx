import { useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskDetailModal from "./taskDetailModal";

function TaskCard({ task, deleteTask, updateTask, description, tags, difficulty, challenge, importance}) {
  const [mouseIsOver, setMouseIsOver] = useState(false);

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

  {
    /* If card is dragged */
  }
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        opacity-30
      bg-mainBackgroundColor p-2.5 items-center flex text-left rounded-xl border-2 border-gray-400  cursor-grab relative
      "
      />
    );
  }

  return (
    <div>
      <TaskDetailModal
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
        }}>
        <p
          className="p-2.5 my-auto w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap rounded-xl shadow bg-white"
          onClick={() => document.getElementById("task_detail_modal").showModal()}>
          {task.content}
        </p>

        {mouseIsOver && (
          <button
            onClick={() => {
              deleteTask(task.id);
            }}
            className="stroke-white absolute right-0 top-1/2 rounded-full bg-white -translate-y-1/2 bg-columnBackgroundColor p-2 hover:opacity-100 ">
            <BsFillTrashFill />
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
