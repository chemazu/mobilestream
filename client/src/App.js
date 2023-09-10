// import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Stream from "./Stream";
import Watch from "./Watch";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/stream" element={<Stream />} />
        <Route path="/watch" element={<Watch />} />
      </Routes>
    </div>
  );
}

export default App;
