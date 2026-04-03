import React, { useState, useEffect } from 'react'
import '../styles/ProcessChecking.css'

function ProcessChecking() {
  // Sample data - in a real app, this would track actual web usage
  const [dailyData, setDailyData] = useState([
    { day: 'Mon', hours: 2.5, sessions: 3 },
    { day: 'Tue', hours: 3.0, sessions: 4 },
    { day: 'Wed', hours: 1.5, sessions: 2 },
    { day: 'Thu', hours: 4.0, sessions: 5 },
    { day: 'Fri', hours: 2.0, sessions: 3 },
    { day: 'Sat', hours: 5.5, sessions: 6 },
    { day: 'Sun', hours: 3.5, sessions: 4 }
  ])

  const [monthlyData, setMonthlyData] = useState([
    { month: 'Jan', hours: 85.5, sessions: 120 },
    { month: 'Feb', hours: 92.0, sessions: 135 },
    { month: 'Mar', hours: 78.5, sessions: 110 },
    { month: 'Apr', hours: 95.0, sessions: 140 },
    { month: 'May', hours: 88.5, sessions: 125 },
    { month: 'Jun', hours: 102.0, sessions: 150 }
  ])

  const [totalWeeklyHours, setTotalWeeklyHours] = useState(0)
  const [totalMonthlyHours, setTotalMonthlyHours] = useState(0)

  useEffect(() => {
    const weeklyTotal = dailyData.reduce((sum, day) => sum + day.hours, 0)
    const monthlyTotal = monthlyData.reduce((sum, month) => sum + month.hours, 0)
    setTotalWeeklyHours(weeklyTotal)
    setTotalMonthlyHours(monthlyTotal)
  }, [dailyData, monthlyData])

  const maxDailyHours = Math.max(...dailyData.map(d => d.hours))
  const maxMonthlyHours = Math.max(...monthlyData.map(m => m.hours))

  return (
    <div className="process-container">
      <h2>Web Usage Tracking</h2>

      <div className="stats-section">
        <div className="total-hours">
          <h3>This Week's Usage</h3>
          <div className="hours-display">{totalWeeklyHours.toFixed(1)} hours</div>
          <div className="sessions-display">{dailyData.reduce((sum, day) => sum + day.sessions, 0)} sessions</div>
        </div>

        <div className="average-hours">
          <h3>This Month's Usage</h3>
          <div className="hours-display">{totalMonthlyHours.toFixed(1)} hours</div>
          <div className="sessions-display">{monthlyData.reduce((sum, month) => sum + month.sessions, 0)} sessions</div>
        </div>
      </div>

      <div className="chart-section">
        <h3>Daily Usage Breakdown</h3>
        <div className="chart-container">
          <div className="chart">
            {dailyData.map((data, index) => (
              <div key={data.day} className="chart-bar">
                <div className="bar-container">
                  <div
                    className="bar"
                    style={{
                      height: `${(data.hours / maxDailyHours) * 100}%`,
                      backgroundColor: `hsl(${200 + (index * 20)}, 40%, 60%)`
                    }}
                  >
                    <span className="bar-value">{data.hours}h</span>
                  </div>
                </div>
                <div className="bar-label">{data.day}</div>
              </div>
            ))}
          </div>

          <div className="y-axis">
            {Array.from({ length: Math.ceil(maxDailyHours) + 1 }, (_, i) => (
              <div key={i} className="y-axis-label">{i}h</div>
            ))}
          </div>
        </div>
      </div>

      <div className="monthly-breakdown">
        <h3>Monthly Usage Breakdown</h3>
        <div className="monthly-list">
          {monthlyData.map((data) => (
            <div key={data.month} className="monthly-item">
              <span className="month-name">{data.month}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(data.hours / maxMonthlyHours) * 100}%` }}
                ></div>
              </div>
              <span className="hours-value">{data.hours} hours</span>
              <span className="sessions-value">{data.sessions} sessions</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProcessChecking