import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { Notes } from "./pages/notes";
import { Register } from "./pages/register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;