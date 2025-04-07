import React, { createContext, useContext, useState } from 'react';

const OpenTaskContext = createContext();

export const OpenTaskProvider = ({ children }) => {
  const [openNotificationTask, setOpenNotificationTask] = useState(false);
  const [selectedTaskName, setSelectedTaskName] = useState("");

  return (
    <OpenTaskContext.Provider value={{
      openNotificationTask,
      openOpenNotificationTask: setOpenNotificationTask, 
      selectedTaskName,
      setSelectedTaskName
    }}>
      {children}
    </OpenTaskContext.Provider>
  );
};

export const useOpenTask = () => useContext(OpenTaskContext);
