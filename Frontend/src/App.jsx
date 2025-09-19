import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import SignUp from "./components/signUp/SignUp";
import SignIn from "./components/signIn/SignIn";

function App() {
  return (
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
    </Routes>
  );
}

export default App;
