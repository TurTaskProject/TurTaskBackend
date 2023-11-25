import { ColumnContainer } from "./columnContainer";

export function ColumnContainerCard({ column, createTask, tasks, deleteTask, updateTask }) {
  return (
    <div className="card bg-[#f1f2f4] shadow border p-1 my-2">
      <ColumnContainer
        column={column}
        createTask={createTask}
        tasks={tasks}
        deleteTask={deleteTask}
        updateTask={updateTask}
      />
    </div>
  );
}
