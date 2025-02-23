import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

let TablesprintContext = createContext();

let TablesprintProvider = ({ children }) => {
  let [user, setUser] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    let storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/", { replace: true });
    } else {
      setUser(storedUser);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/", { replace: true });
  };

  return (
    <TablesprintContext.Provider value={{ user, setUser, logout }}>
      {children}
    </TablesprintContext.Provider>
  );
};

export let TablesprintState = () => {
  return useContext(TablesprintContext);
};

export default TablesprintProvider;