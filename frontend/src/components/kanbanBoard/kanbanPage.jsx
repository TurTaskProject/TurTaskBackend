import { KanbanBoard } from "./kanbanBoard";
import { useState } from "react";

export const KanbanPage = () => {
  const [activeTab, setActiveTab] = useState("kanban");

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center border-2 py-3 mb-1">
        <div>
          <div className="tabs tabs-boxed">
            <a
              id="kanban"
              className={`tab ${activeTab === "kanban" ? "tab-active" : ""}`}
              onClick={() => handleTabClick("kanban")}>
              Kanban
            </a>
            {/* <a
              id="table"
              className={`tab ${activeTab === "table" ? "tab-active" : ""}`}
              onClick={() => handleTabClick("table")}>
              Table
            </a> */}
          </div>
        </div>
      </div>
      <KanbanBoard />
    </div>
  );
};
