import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Timetable from './components/Timetable'
import StudyWithMe from './components/StudyWithMe'
import ProcessChecking from './components/ProcessChecking'
import './App.css'
import heroLogo from './assets/frontpage.png.png';
function App() {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/timetable')
  }

  return (
    <div className="app">
      <header className="header">
        <div className="title-section">
          <h2>Glinh's Study Corner</h2>
        </div>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/timetable">Timetable</Link>
          <Link to="/studywithme">Study with Glinh</Link>
          <Link to="/process-checking">Process Checking</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={
            <div className="front-page">
              <div className="welcome-text">
                Welcome to Glinh’s Study Corner — your dedicated hub for organized and effective learning.
              </div>
              <img 
                  src={heroLogo} 
                  alt="Study with Glinh" 
                  className="hero-image" 
              />
              <button className="start-button" onClick={handleClick}>Start</button>
            </div>
          } />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/studywithme" element={<StudyWithMe />} />
          <Route path="/process-checking" element={<ProcessChecking />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
