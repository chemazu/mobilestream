// import logo from "./logo.svg";
import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import Stream from "./Stream";
import Watch from "./Watch";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/stream/:id" element={<Stream />} />
        <Route path="/watch/:id" element={<Watch />} />
      </Routes>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Link to="/stream/1">Stream Channel 1</Link>
        <Link to="/watch/1">Watch Channel 1</Link>
        <Link to="/stream/2">Stream Channel 2</Link>
        <Link to="/watch/2">Watch Channel 2</Link>
        <Link to="/stream/3">Stream Channel 3</Link>
        <Link to="/watch/3">Watch Channel 3</Link>
      </div>
    </div>
  );
}

export default App;
