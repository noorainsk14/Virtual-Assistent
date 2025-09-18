import React from "react";
import UserDataContext from "./userContext.js";

function UserContextProvider({ children }) {
  const serverUrl = "http://localhost:8080/api/v1/users";
  const value = {
    serverUrl,
  };

  return (
    <div>
      <UserDataContext.Provider value={value}>
        {children}
      </UserDataContext.Provider>
    </div>
  );
}

export default UserContextProvider;
