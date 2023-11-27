import { useState, useEffect } from "react";
import { FaTasks, FaRegListAlt } from "react-icons/fa";
import { FaPlus, FaRegTrashCan } from "react-icons/fa6";
import { TbChecklist } from "react-icons/tb";
import DatePicker from "react-datepicker";
import { TimePicker } from "react-ios-time-picker";
import "react-datepicker/dist/react-datepicker.css";
import { addSubtasks, deleteSubtasks, getSubtask, updateSubtask } from "src/api/SubTaskApi";

export function TaskDetailModal({ title, description, tags, difficulty, challenge, importance, taskId, updateTask }) {
  const [isChallengeChecked, setChallengeChecked] = useState(challenge);
  const [isImportantChecked, setImportantChecked] = useState(importance);
  const [currentDifficulty, setCurrentDifficulty] = useState(difficulty);
  const [selectedTags, setSelectedTags] = useState([]);
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [startDateEnabled, setStartDateEnabled] = useState(false);
  const [endDateEnabled, setEndDateEnabled] = useState(false);
  const [isTaskComplete, setTaskComplete] = useState(false);
  const [value, setValue] = useState("10:00");
  const [subtaskText, setSubtaskText] = useState("");
  const [subtasks, setSubtasks] = useState([]);

  const onChange = (timeValue) => {
    setValue(timeValue);
  };
  const handleChallengeChange = () => {
    setChallengeChecked(!isChallengeChecked);
  };

  const handleImportantChange = () => {
    setImportantChecked(!isImportantChecked);
  };

  const handleDifficultyChange = (event) => {
    setCurrentDifficulty(parseInt(event.target.value, 10));
  };

  const handleTagChange = (tag) => {
    const isSelected = selectedTags.includes(tag);
    setSelectedTags(isSelected ? selectedTags.filter((selectedTag) => selectedTag !== tag) : [...selectedTags, tag]);
  };

  const handleStartDateChange = () => {
    if (!isTaskComplete) {
      setStartDateEnabled(!startDateEnabled);
    }
  };

  const handleEndDateChange = () => {
    if (!isTaskComplete) {
      setEndDateEnabled(!endDateEnabled);
    }
  };

  const handleTaskCompleteChange = () => {
    if (isTaskComplete) {
      setTaskComplete(false);
    } else {
      setTaskComplete(true);
      setStartDateEnabled(false);
      setEndDateEnabled(false);
    }
  };

  const addSubtask = async () => {
    try {
      if (subtaskText.trim() !== "") {
        const newSubtask = await addSubtasks(taskId, subtaskText.trim());
        setSubtasks([...subtasks, newSubtask]);
        setSubtaskText("");
      }
    } catch (error) {
      console.error("Error adding subtask:", error);
    }
  };

  const toggleSubtaskCompletion = async (index) => {
    try {
      const updatedSubtasks = [...subtasks];
      updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
      await updateSubtask(updatedSubtasks[index].id, { completed: updatedSubtasks[index].completed });
      setSubtasks(updatedSubtasks);
    } catch (error) {
      console.error("Error updating subtask:", error);
    }
  };

  const deleteSubtask = async (index) => {
    try {
      await deleteSubtasks(subtasks[index].id);
      const updatedSubtasks = [...subtasks];
      updatedSubtasks.splice(index, 1);
      setSubtasks(updatedSubtasks);
    } catch (error) {
      console.error("Error deleting subtask:", error);
    }
  };

  const subtaskElements = subtasks.map((subtask, index) => (
    <div key={index} className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={subtask.completed}
        className="checkbox checkbox-xs bg-gray-400"
        onChange={() => toggleSubtaskCompletion(index)}
      />
      <div className={`flex items-center rounded p-2 shadow border-2 ${subtask.completed && "line-through"}`}>
        {subtask.description}
        <FaRegTrashCan className="cursor-pointer ml-2 text-red-500" onClick={() => deleteSubtask(index)} />
      </div>
    </div>
  ));

  useEffect(() => {
    const fetchSubtasks = async () => {
      try {
        const fetchedSubtasks = await getSubtask(taskId);
        setSubtasks(fetchedSubtasks);
      } catch (error) {
        console.error("Error fetching subtasks:", error);
      }
    };

    fetchSubtasks();
  }, [taskId]);

  // Existing tags
  const existingTags = tags.map((tag, index) => (
    <div
      key={index}
      className={`text-xs inline-flex items-center font-bold leading-sm uppercase px-2 py-1 bg-${tag.color}-200 text-${tag.color}-700 rounded-full`}>
      {tag.label}
    </div>
  ));

  // Selected tags
  const selectedTagElements = selectedTags.map((tag, index) => (
    <div
      key={index}
      className={`text-xs inline-flex items-center font-bold leading-sm uppercase px-2 py-1 bg-${tag.color}-200 text-${tag.color}-700 rounded-full`}>
      {tag.label}
    </div>
  ));

  return (
    <dialog id={`task_detail_modal_${taskId}`} className="modal">
      <div className="modal-box w-4/5 max-w-3xl">
        {/* Title */}
        <div className="flex flex-col py-2">
          <div className="flex flex-col">
            <h3 className="font-bold text-lg">
              <span className="flex gap-2">
                {<FaTasks className="my-2" />}
                {title}
              </span>
            </h3>
            <p className="text-xs">{title}</p>
          </div>
        </div>
        {/* Tags */}
        <div className="flex flex-col py-2 pb-4">
          <div className="flex flex-row space-x-5">
            <div className="dropdown">
              <label tabIndex={0} className="btn-md border-2 rounded-xl m-1 py-1">
                + Add Tags
              </label>
              <ul tabIndex={0} className="dropdown-content z-[10] menu p-2 shadow bg-base-100 rounded-box w-52">
                {tags.map((tag, index) => (
                  <li key={index}>
                    <label className="cursor-pointer space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        className="checkbox checkbox-sm"
                        onChange={() => handleTagChange(tag)}
                      />
                      {tag.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-nowrap overflow-x-auto">
            {existingTags}
            {selectedTagElements}
          </div>
        </div>
        {/* Date Picker */}
        <div className="flex flex-col space-y-2 mb-2">
          {/* Start */}
          <div className="flex flex-row items-center">
            <div>
              <p className="text-xs font-bold">Start At</p>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={startDateEnabled}
                  className="checkbox checkbox-xs bg-gray-400"
                  onChange={handleStartDateChange}
                />
                <div className={`rounded p-2 shadow border-2 ${!startDateEnabled && "opacity-50"}`}>
                  <DatePicker
                    selected={dateStart}
                    onChange={(date) => setDateStart(date)}
                    disabled={!startDateEnabled}
                  />
                </div>
              </div>
            </div>

            <div className="rounded p-2 shadow border-2">
              <TimePicker
                value={value}
                onChange={onChange}
                className="rounded p-2 shadow border-2 z-[10000] relative"
              />
            </div>
            {/* Complete? */}
            <div className="mx-4">
              <div className="flex items-center space-x-2 mt-4">
                <div className="flex-1 flex-row card shadow border-2 p-2 pr-2">
                  <p className="text-md mx-2">Complete</p>
                  <input
                    type="checkbox"
                    checked={isTaskComplete}
                    className="checkbox checkbox-xl bg-gray-400"
                    onChange={handleTaskCompleteChange}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* End */}
          <div>
            <p className="text-xs font-bold">End At</p>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={endDateEnabled}
                className="checkbox checkbox-xs bg-gray-400"
                onChange={handleEndDateChange}
              />
              <div className={`rounded p-2 shadow border-2 ${!endDateEnabled && "opacity-50"}`}>
                <DatePicker selected={dateEnd} onChange={(date) => setDateEnd(date)} disabled={!endDateEnabled} />
              </div>
            </div>
          </div>
        </div>
        {/* Description */}
        <div className="flex flex-col gap-2">
          <h2 className="font-bold">
            <span className="flex gap-2">
              <FaRegListAlt className="my-1" />
              Description
            </span>
          </h2>
          <textarea className="textarea w-full" disabled>
            {description}
          </textarea>
        </div>
        {/* Difficulty, Challenge, and Importance */}
        <div className="flex flex-row space-x-3 my-4">
          <div className="flex-1 card shadow border-2 p-2">
            <input
              type="range"
              id="difficultySelector"
              min={0}
              max="100"
              value={currentDifficulty}
              className="range"
              step="25"
              onChange={handleDifficultyChange}
            />
            <div className="w-full flex justify-between text-xs px-2 space-x-2">
              <span>Easy</span>
              <span>Normal</span>
              <span>Hard</span>
              <span>Very Hard</span>
              <span>Devil</span>
            </div>
          </div>
          {/* Challenge Checkbox */}
          <div className="card shadow border-2 p-2">
            <div className="form-control">
              <label className="label cursor-pointer space-x-2">
                <span className="label-text">Challenge</span>
                <input
                  type="checkbox"
                  checked={isChallengeChecked}
                  className="checkbox bg-black"
                  onChange={handleChallengeChange}
                />
              </label>
            </div>
          </div>

          {/* Important Checkbox */}
          <div className="card shadow border-2 p-2">
            <div className="form-control">
              <label className="label cursor-pointer space-x-2">
                <span className="label-text">Important</span>
                <input
                  type="checkbox"
                  checked={isImportantChecked}
                  className="checkbox bg-black"
                  onChange={handleImportantChange}
                />
              </label>
            </div>
          </div>
        </div>
        {/* Subtask */}
        <div className="flex flex-col pt-2">
          <h2 className="font-bold">
            <span className="flex gap-1">
              <TbChecklist className="my-1" />
              Subtasks
            </span>
          </h2>
          <div className="flex space-x-3 pt-2">
            <input
              type="text"
              placeholder="subtask topic"
              className="input input-bordered flex-1 w-full"
              value={subtaskText}
              onChange={(e) => setSubtaskText(e.target.value)}
            />
            <button className="btn" onClick={addSubtask}>
              <FaPlus />
              Add Subtask
            </button>
          </div>
          {/* Display Subtasks */}
          <div className="flex flex-col space-y-2 pt-2">{subtaskElements}</div>
        </div>
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</button>
        </form>
      </div>
    </dialog>
  );
}
