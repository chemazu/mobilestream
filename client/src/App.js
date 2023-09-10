// import logo from "./logo.svg";
import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import Stream from "./Stream";
import Watch from "./Watch";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/stream" element={<Stream />} />
        <Route path="/watch" element={<Watch />} />
      </Routes>
      <Link to ="/stream">Stream</Link>
      <Link to ="/watch">Watch</Link>

    </div>
  );
}

export default App;
