import React, { useState, useEffect } from 'react'
import '../styles/StudyWithMe.css'

function StudyWithMe() {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [inputHours, setInputHours] = useState('')
  const [inputMinutes, setInputMinutes] = useState('')
  const [inputSeconds, setInputSeconds] = useState('')

  // Countdown effect
  useEffect(() => {
    let interval
    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (totalSeconds === 0) {
      setIsRunning(false)
    }
    return () => clearInterval(interval)
  }, [isRunning, totalSeconds])

  // Update hours, minutes, seconds display
  useEffect(() => {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    setHours(h)
    setMinutes(m)
    setSeconds(s)
  }, [totalSeconds])

  const handleSetTime = () => {
    const h = parseInt(inputHours) || 0
    const m = parseInt(inputMinutes) || 0
    const s = parseInt(inputSeconds) || 0

    // Validate inputs (max 24 hours)
    if (h > 24 || h < 0 || m > 59 || m < 0 || s > 59 || s < 0) {
      alert('Please enter valid time values (0-24 hours, 0-59 minutes/seconds)')
      return
    }

    const total = h * 3600 + m * 60 + s
    if (total === 0) {
      alert('Please set a time greater than 0')
      return
    }

    setTotalSeconds(total)
    setIsRunning(false)
    setInputHours('')
    setInputMinutes('')
    setInputSeconds('')
  }

  const toggleTimer = () => {
    if (totalSeconds > 0) {
      setIsRunning(!isRunning)
    }
  }

  const resetTimer = () => {
    setTotalSeconds(0)
    setIsRunning(false)
    setInputHours('')
    setInputMinutes('')
    setInputSeconds('')
  }

  const formatTime = (value) => {
    return String(value).padStart(2, '0')
  }

  return (
    <div className="study-container">
      <h2>Study With Me</h2>
      
      <div className="content-section">
        <div className="timer-section">
          <div className="timer-input-section">
            <h3>Set Timer (up to 24 hours)</h3>
            <div className="input-group">
              <div className="input-field">
                <label>Hours</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={inputHours}
                  onChange={(e) => setInputHours(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="input-field">
                <label>Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={inputMinutes}
                  onChange={(e) => setInputMinutes(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="input-field">
                <label>Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={inputSeconds}
                  onChange={(e) => setInputSeconds(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <button className="set-btn" onClick={handleSetTime}>
              Set Time
            </button>
          </div>

          <div className="timer-display">
            <div className="timer-box">
              <div className="countdown">
                {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
              </div>
            </div>
          </div>

          <div className="timer-controls">
            <button
              className={`control-btn ${isRunning ? 'pause' : 'play'}`}
              onClick={toggleTimer}
              disabled={totalSeconds === 0}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button className="control-btn reset" onClick={resetTimer}>
              Reset
            </button>
          </div>
        </div>

        <div className="music-section">
          <h3>Music</h3>
          <div className="music-embed">
            <iframe
              src="https://open.spotify.com/embed/playlist/6HuGmDDzcvvcJ88nWrPEoG"
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Study Playlist"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="video-section">
        <div className="video-embed">
          <iframe
            src="https://www.youtube.com/embed/L-mLsFt5ZpI"
            width="100%"
            height="315"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Study Video"
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default StudyWithMe