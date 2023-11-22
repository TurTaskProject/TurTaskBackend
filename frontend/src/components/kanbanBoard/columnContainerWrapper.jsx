import { ColumnContainer } from "./columnContainer";

export function ColumnContainerCard({ column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask }) {
  return (
    <div className="card bg-[#f1f2f4] shadow p-1 my-2 border-2">
      <ColumnContainer
        column={column}
        deleteColumn={deleteColumn}
        updateColumn={updateColumn}
        createTask={createTask}
        tasks={tasks}
        deleteTask={deleteTask}
        updateTask={updateTask}
      />
    </div>
  );
}
