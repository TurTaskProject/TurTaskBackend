import { useState, useEffect } from "react";
import { FaTasks, FaRegListAlt } from "react-icons/fa";
import { FaPlus, FaRegTrashCan, FaPencil } from "react-icons/fa6";
import { TbChecklist } from "react-icons/tb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addSubtasks, deleteSubtasks, getSubtask, updateSubtask } from "src/api/SubTaskApi";
import { updateTodoTaskPartial } from "src/api/TaskApi";
import format from "date-fns/format";

export function TaskDetailModal({
  title,
  description,
  tags,
  difficulty,
  challenge,
  importance,
  taskId,
  start_event,
  end_event,
  updateTask,
  completed,
}) {
  if (importance >= 3) {
    importance = true;
  } else {
    importance = false;
  }

  const s = formatAMPM(new Date(start_event));
  const e = formatAMPM(new Date(end_event));
  const [isChallengeChecked, setChallengeChecked] = useState(challenge);
  const [isImportantChecked, setImportantChecked] = useState(importance);
  const [currentDifficulty, setCurrentDifficulty] = useState((difficulty - 1) * 25);
  const [selectedTags, setSelectedTags] = useState([]);
  const [dateStart, setDateStart] = useState(new Date(start_event));
  const [dateEnd, setDateEnd] = useState(new Date(end_event));
  const [startDateEnabled, setStartDateEnabled] = useState(false);
  const [endDateEnabled, setEndDateEnabled] = useState(false);
  const [isTaskComplete, setTaskComplete] = useState(completed);
  const [starteventValue, setStartEventValue] = useState(e);
  const [endeventValue, setEndEventValue] = useState(s);
  const [subtaskText, setSubtaskText] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [currentTitle, setTitle] = useState(title);
  const [isTitleEditing, setTitleEditing] = useState(false);
  const [isDescriptionEditing, setDescriptionEditing] = useState(false);
  const [updatedDescription, setUpdatedDescription] = useState(description);

  const handleDescriptionEditToggle = () => {
    setDescriptionEditing(!isDescriptionEditing);
  };

  const handleDescriptionChange = async () => {
    const data = {
      notes: updatedDescription,
    };
    await updateTodoTaskPartial(taskId, data);
    setDescriptionEditing(false);
  };

  const handleTitleChange = async () => {
    const data = {
      title: currentTitle,
    };
    await updateTodoTaskPartial(taskId, data);
    setTitleEditing(false);
  };

  {
    /* -------- Time -------- */
  }

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  const handleStartEventTimeChange = async (startdate, starttime) => {
    if (!validateTimeFormat(starttime)) {
      console.error("Wrong time format");
      return;
    }

    // Format incoming date
    setDateStart(startdate);
    setStartEventValue(starttime);
    const formatDate = convertToFormattedDate(startdate);
    // Format incoming time
    const formatTime = convertToFormattedTime(starttime).slice(0, -1) + ":00.000000Z";
    console.log(formatTime);
    // Combine both of them
    const formatDateTime = formatDate + formatTime;

    const data = {
      startTime: formatDateTime,
    };
    console.log(formatDateTime);
    await updateTodoTaskPartial(taskId, data);
  };

  const handleEndEventTimeChange = async (enddate, endtime) => {
    if (!validateTimeFormat(endtime)) {
      console.error("Wrong time format");
      return;
    }

    // Format incoming date
    setDateEnd(enddate);
    setEndEventValue(endtime);
    const formatDate = convertToFormattedDate(enddate);
    // Format incoming time
    const formatTime = convertToFormattedTime(endtime);

    // Combine both of them
    const formatDateTime = formatDate + formatTime;

    const data = {
      startTime: formatDateTime,
    };
    await updateTodoTaskPartial(taskId, data);
  };

  const convertToFormattedDate = (dateValue) => {
    const formattedDate = format(dateValue, "yyyy-MM-dd'T'", {
      timeZone: "UTC",
    });
    return formattedDate;
  };

  const convertToFormattedTime = (timeValue) => {
    // 2023-11-28 T [04:37:48.000000Z]
    // 12:00 AM -> 12:00:00.000000Z
    // 10:00 PM -> 22:00:00.000000Z

    var hours = parseInt(timeValue.substr(0, 2));
    if (timeValue.indexOf("AM") != -1 && hours == 12) {
      timeValue = timeValue.replace("12", "0");
    }
    if (timeValue.indexOf("PM") != -1 && hours < 12) {
      timeValue = timeValue.replace(hours, hours + 12);
    }
    const formattedTime = timeValue.replace(/(AM|PM)/, "");
    const [formattedHours, restOfTime] = formattedTime.split(":");
    const paddedHours = formattedHours.length === 1 ? `0${formattedHours}` : formattedHours;
    console.log(`${paddedHours}:${restOfTime}`);
    return `${paddedHours}:${restOfTime}`;
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

  const validateTimeFormat = (time) => {
    const timeFormatRegex = /^([1-9]|1[0-2]):[0-5][0-9]( |)(AM|PM)$/i;
    return timeFormatRegex.test(time);
  };

  {
    /* -------- END Time -------- */
  }

  const handleChallengeChange = async () => {
    setChallengeChecked(!isChallengeChecked);
    const data = {
      challenge: !isChallengeChecked,
    };
    await updateTodoTaskPartial(taskId, data);
  };

  const handleImportantChange = async () => {
    let important_num = 0;
    if (isImportantChecked) {
      important_num = 5;
    }

    setImportantChecked(!isImportantChecked);
    const data = {
      important: important_num,
    };
    await updateTodoTaskPartial(taskId, data);
  };

  const handleDifficultyChange = async (event) => {
    setCurrentDifficulty(parseInt(event.target.value, 10));
    let diff = event.target.value / 25 + 1;
    const data = {
      difficulty: diff,
    };
    await updateTodoTaskPartial(taskId, data);
  };

  const handleTagChange = (tag) => {
    const isSelected = selectedTags.includes(tag);
    setSelectedTags(isSelected ? selectedTags.filter((selectedTag) => selectedTag !== tag) : [...selectedTags, tag]);
    ``;
  };

  const handleTaskCompleteChange = async () => {
    let completed = false;
    if (isTaskComplete) {
      setTaskComplete(false);
      completed = false;
    } else {
      setTaskComplete(true);
      completed = true;
      setStartDateEnabled(false);
      setEndDateEnabled(false);
    }
    const data = {
      completed: completed,
    };
    await updateTodoTaskPartial(taskId, data);
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
      await updateSubtask(updatedSubtasks[index].id, {
        completed: updatedSubtasks[index].completed,
      });
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
      {tag.name}
    </div>
  ));

  // Selected tags
  const selectedTagElements = selectedTags.map((tag, index) => (
    <div
      key={index}
      className={`text-xs inline-flex items-center font-bold leading-sm uppercase px-2 py-1 bg-${tag.color}-200 text-${tag.color}-700 rounded-full`}>
      {tag.name}
    </div>
  ));

  return (
    <dialog id={`task_detail_modal_${taskId}`} className="modal">
      <div className="modal-box w-4/5 max-w-3xl">
        {/* Title */}
        <div className="flex flex-col py-2">
          <div className="flex flex-col">
            {isTitleEditing ? (
              <div className="flex gap-2 items-center">
                <FaTasks className="my-2" />
                <input
                  type="text"
                  className="input-md input-bordered font-bold text-lg"
                  value={currentTitle}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <button className="btn btn-sm" onClick={handleTitleChange}>
                  Save
                </button>
              </div>
            ) : (
              <h3 className="font-bold text-lg">
                <span className="flex gap-2">
                  {<FaTasks className="my-2" />}
                  {currentTitle}
                  <FaPencil className="my-2" onClick={() => setTitleEditing(true)} />
                </span>
              </h3>
            )}
            <p className="text-xs">{currentTitle}</p>
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
                      {tag}
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
                    onChange={(dateStart) => setDateStart(dateStart)}
                    disabled={!startDateEnabled}
                  />
                </div>
              </div>
            </div>

            {/* Start event time picker */}
            <div className="rounded mx-2 mt-4 flex flex-row items-center">
              {/* handleStartEventTimeChange */}
              <input
                type="text"
                placeholder={starteventValue}
                value={starteventValue}
                onChange={(starteventValue) => setStartEventValue(starteventValue)}
                className="input input-bordered w-full max-w-xs"
                disabled={!startDateEnabled}
              />
              <div className="rounded mx-2">
                <button
                  className="btn btn-sm"
                  disabled={isTaskComplete}
                  onClick={() => handleStartEventTimeChange(dateStart, starteventValue)}>
                  Update Time
                </button>
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
                <DatePicker selected={dateEnd} onChange={(dateEnd) => setDateEnd(dateEnd)} disabled={!endDateEnabled} />
              </div>
              {/* End event time picker */}
              <div className="rounded mx-2 flex flex-row items-center">
                {/* handleEndEventTimeChange */}
                <input
                  type="text"
                  placeholder={endeventValue}
                  className="input input-bordered w-full max-w-xs"
                  disabled={!endDateEnabled}
                />
                <div className="rounded mx-2">
                  <button
                    className="btn btn-sm"
                    disabled={isTaskComplete}
                    onClick={() => handleEndEventTimeChange(dateEnd, endeventValue)}>
                    Update Time
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Description */}
        {isDescriptionEditing ? (
          <div className="flex flex-col gap-2">
            <h2 className="font-bold">
              <span className="flex gap-2">
                <FaRegListAlt className="my-1" />
                Description
              </span>
            </h2>
            <textarea
              className="textarea w-full"
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
            />
            <button className="btn btn-sm" onClick={handleDescriptionChange}>
              Save
            </button>
          </div>
        ) : (
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
            <FaPencil className="cursor-pointer" onClick={handleDescriptionEditToggle} />
          </div>
        )}

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
          {/* Complete? */}
          <div className="card shadow border-2 p-2">
            <div className="form-control">
              <label className="label cursor-pointer space-x-2">
                <span className="label-text">Complete</span>
                <input
                  type="checkbox"
                  checked={isTaskComplete}
                  className="checkbox bg-black"
                  onChange={handleTaskCompleteChange}
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
