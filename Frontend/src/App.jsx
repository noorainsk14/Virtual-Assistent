import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./components/signUp/SignUp";
import SignIn from "./components/signIn/SignIn";
import Home from "./components/Home/Home";
import Customize from "./components/Customize/Customize";
import { useContext } from "react";
import UserDataContext from "./context/userContext";
import Customize2 from "./components/Customize2/Customize2";

function App() {
  const { userData, _setUserData } = useContext(UserDataContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData?.assistantImage && userData?.assistantName ? (
            <Home />
          ) : (
            <Navigate to={"/customize"} />
          )
        }
      />
      <Route
        path="/sign-up"
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />
      <Route
        path="/sign-in"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to={"/sign-in"} />}
      />
      <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to={"/sign-in"} />}
      />
    </Routes>
  );
}

export default App;
