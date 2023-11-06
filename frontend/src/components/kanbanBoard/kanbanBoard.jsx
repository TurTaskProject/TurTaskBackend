import React, { useEffect } from 'react';
import * as ej from '@syncfusion/ej2-base'; // Import necessary Syncfusion modules and styles
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-lists/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-dropdowns/styles/material.css';
import '@syncfusion/ej2-splitbuttons/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-kanban/styles/material.css';
import '@syncfusion/ej2-react-kanban/styles/material.css';

const KanbanBoard = () => {
  useEffect(() => {
    const kanbanData = [
      // Your Kanban data here
    ];

    const kanbanObj = new ej.kanban.Kanban({
      dataSource: kanbanData,
      keyField: 'Status',
      columns: [
        { headerText: 'Backlog', keyField: 'Open' },
        { headerText: 'In Progress', keyField: 'InProgress' },
        { headerText: 'Testing', keyField: 'Testing' },
        { headerText: 'Done', keyField: 'Close' }
      ],
      cardSettings: {
        contentField: 'Summary',
        headerField: 'Id',
      },
      swimlaneSettings: {
        keyField: 'Assignee'
      }
    });

    kanbanObj.appendTo('#Kanban'); 
    
    return () => {
      kanbanObj.destroy();
    };
  }, []);

  return (
    <div id="Kanban"></div>
  );
};

export default KanbanBoard;
