import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Report from "./pages/Report";
import HelpNearby from "./pages/HelpNearby";
import MyReports from "./pages/MyReports";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/map" element={<HelpNearby />} />
        <Route path="/my-reports" element={<MyReports />} />
      </Routes>
    </Router>
  );
}

export default App;