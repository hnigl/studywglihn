import React, { useState, useEffect } from 'react'
import '../styles/Timetable.css'

const STORAGE_KEY_TASKS = 'timetableTasks'
const STORAGE_KEY_CHECKED = 'timetableChecked'

function Timetable() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const taskSlots = 5
  
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TASKS)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length === 7) return parsed
      } catch (e) {
        console.warn('Error parsing stored timetable tasks', e)
      }
    }
    return Array(7).fill(null).map(() => Array(taskSlots).fill(''))
  })
  
  const [checkedTasks, setCheckedTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CHECKED)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length === 7) return parsed
      } catch (e) {
        console.warn('Error parsing stored timetable check state', e)
      }
    }
    return Array(7).fill(null).map(() => Array(taskSlots).fill(false))
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CHECKED, JSON.stringify(checkedTasks))
  }, [checkedTasks])

  const handleTaskChange = (dayIndex, taskIndex, value) => {
    const newTasks = tasks.map((day, dIdx) => {
      if (dIdx === dayIndex) {
        return day.map((task, tIdx) => tIdx === taskIndex ? value : task)
      }
      return day
    })
    setTasks(newTasks)
  }

  const handleCheckboxChange = (dayIndex, taskIndex) => {
    const newCheckedTasks = checkedTasks.map((day, dIdx) => {
      if (dIdx === dayIndex) {
        return day.map((task, tIdx) => tIdx === taskIndex ? !task : task)
      }
      return day
    })
    setCheckedTasks(newCheckedTasks)
  }

  return (
    <div className="timetable-container">
      <h2>Weekly Timetable</h2>
      <div className="chart-wrapper">
        <table className="timetable-chart">
          <thead>
            <tr>
              {days.map((day) => (
                <th key={day} className="day-header">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array(taskSlots).fill(null).map((_, taskIndex) => (
              <tr key={taskIndex}>
                {days.map((day, dayIndex) => (
                  <td key={`${dayIndex}-${taskIndex}`} className="task-cell">
                    <div className="task-box">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={checkedTasks[dayIndex][taskIndex]}
                          onChange={() => handleCheckboxChange(dayIndex, taskIndex)}
                          className="task-checkbox"
                        />
                        <input
                          type="text"
                          placeholder="Add task..."
                          value={tasks[dayIndex][taskIndex]}
                          onChange={(e) => handleTaskChange(dayIndex, taskIndex, e.target.value)}
                          className={`task-input ${checkedTasks[dayIndex][taskIndex] ? 'completed' : ''}`}
                        />
                      </label>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Timetable