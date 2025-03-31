import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddMovie from "./pages/AddMovie";
import UpdateMovie from "./pages/UpdateMovie";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Header */}
        <header className="main-header">
          <h1>Movie Management System</h1>
        </header>

        {/* Navigation */}
        <nav className="main-nav">
          <Link to="/" className="nav-link home">Home</Link>
          <Link to="/add" className="nav-link add">Add Movie</Link>
          {/* <Link to="/update" className="nav-link update">Update Movie</Link> */}
        </nav>

        {/* Pages */}
        <main className="content-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<AddMovie />} />
            <Route path="/update" element={<UpdateMovie />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;