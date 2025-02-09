import { Routes, Route, Navigate } from "react-router-dom";
import IndexPage from "./pages/index";
import NotFoundPage from "./pages/notFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;