import { useState, useEffect } from "react";
import { axiosInstance } from "src/api/AxiosConfig";

export function TableBoard() {
  const [tasks, setTasks] = useState([]);

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
          subtaskCount: task.sub_task_count,
        }));
        setTasks(transformedTasks);
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };
    fetchData();
  }, []);

  // ---------------- END Fetch Data ----------------

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Title</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {/* BODY */}
          {tasks.map((task, index) => (
            <tr key={index}>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <td>
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-bold">{task.content}</div>
                    <div className="text-sm opacity-50">{task.content}</div>
                  </div>
                </div>
              </td>
              <td>
                {task.notes}
                <br />
                <span className="badge badge-ghost badge-sm">Description</span>
              </td>
              <td>{task.priority}</td>
              <th>
                <button className="btn btn-ghost btn-xs">
                  {task.end_event}
                </button>
              </th>
            </tr>
          ))}
          {/* END BODY */}
        </tbody>
        {/* foot */}
        <tfoot>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Due Date</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
