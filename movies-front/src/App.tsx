import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddMovie from "./pages/AddMovie";
import UpdateMovie from "./pages/UpdateMovie";
import TheaterListPage from "./pages/theaters/TheaterListPage";
import AddTheaterPage from "./pages/theaters/AddTheaterPage";
import UpdateTheaterPage from "./pages/theaters/UpdateTheaterPage";
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
          <Link to="/theaters" className="nav-link theaters">Theaters</Link>
          <Link to="/theaters/add" className="nav-link add-theater">Add Theater</Link>
        </nav>

        {/* Pages */}
        <main className="content-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<AddMovie />} />
            <Route path="/update" element={<UpdateMovie />} />
            <Route path="/theaters" element={<TheaterListPage />} />
            <Route path="/theaters/add" element={<AddTheaterPage />} />
            <Route path="/theaters/update/:id" element={<UpdateTheaterPage />} />
            
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;