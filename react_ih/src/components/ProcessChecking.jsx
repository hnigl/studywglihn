import React, { useState, useEffect } from 'react'
import '../styles/ProcessChecking.css'
import { db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const initialDailyData = [
  { day: 'Mon', hours: 0, sessions: 0 },
  { day: 'Tue', hours: 0, sessions: 0 },
  { day: 'Wed', hours: 0, sessions: 0 },
  { day: 'Thu', hours: 0, sessions: 0 },
  { day: 'Fri', hours: 0, sessions: 0 },
  { day: 'Sat', hours: 0, sessions: 0 },
  { day: 'Sun', hours: 0, sessions: 0 }
]

const initialMonthlyData = [
  { month: 'Jan', hours: 0, sessions: 0 },
  { month: 'Feb', hours: 0, sessions: 0 },
  { month: 'Mar', hours: 0, sessions: 0 },
  { month: 'Apr', hours: 0, sessions: 0 },
  { month: 'May', hours: 0, sessions: 0 },
  { month: 'Jun', hours: 0, sessions: 0 },
  { month: 'Jul', hours: 0, sessions: 0 },
  { month: 'Aug', hours: 0, sessions: 0 },
  { month: 'Sep', hours: 0, sessions: 0 },
  { month: 'Oct', hours: 0, sessions: 0 },
  { month: 'Nov', hours: 0, sessions: 0 },
  { month: 'Dec', hours: 0, sessions: 0 }
]

function ProcessChecking({ user }) {
  const [dailyData, setDailyData] = useState(initialDailyData)
  const [monthlyData, setMonthlyData] = useState(initialMonthlyData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    const loadUserUsage = async () => {
      setLoading(true)
      const usageDoc = doc(db, 'users', user.uid)
      const snapshot = await getDoc(usageDoc)

      if (snapshot.exists()) {
        const data = snapshot.data()
        if (data.dailyData) setDailyData(data.dailyData)
        if (data.monthlyData) setMonthlyData(data.monthlyData)
      } else {
        await setDoc(usageDoc, {
          dailyData: initialDailyData,
          monthlyData: initialMonthlyData,
          updatedAt: new Date()
        })
      }

      setLoading(false)
    }

    loadUserUsage()
  }, [user])

  if (!user) {
    return (
      <div className="process-container">
        <h2>Please sign in to see your usage data.</h2>
      </div>
    )
  }

  const totalWeeklyHours = dailyData.reduce((sum, day) => sum + day.hours, 0)
  const totalMonthlyHours = monthlyData.reduce((sum, month) => sum + month.hours, 0)
  const totalWeeklySessions = dailyData.reduce((sum, day) => sum + day.sessions, 0)
  const totalMonthlySessions = monthlyData.reduce((sum, month) => sum + month.sessions, 0)
  const maxDailyHours = Math.max(...dailyData.map(d => d.hours), 1)
  const maxMonthlyHours = Math.max(...monthlyData.map(m => m.hours), 1)

  return (
    <div className="process-container">
      <h2>Your Usage Dashboard</h2>
      {loading && <div className="process-loading">Loading saved usage... Please refresh or wait a moment.</div>}

      <div className="stats-section">
        <div className="total-hours">
          <h3>This Week</h3>
          <div className="hours-display">{totalWeeklyHours.toFixed(1)} hours</div>
          <div className="sessions-display">{totalWeeklySessions} sessions</div>
        </div>

        <div className="average-hours">
          <h3>This Month</h3>
          <div className="hours-display">{totalMonthlyHours.toFixed(1)} hours</div>
          <div className="sessions-display">{totalMonthlySessions} sessions</div>
        </div>
      </div>

      <div className="chart-section">
        <h3>Daily Usage</h3>
        <div className="chart-container">
          <div className="chart">
            {dailyData.map((data, index) => (
              <div key={data.day} className="chart-bar">
                <div className="bar-container">
                  <div
                    className="bar"
                    style={{
                      height: `${(data.hours / maxDailyHours) * 100}%`,
                      backgroundColor: `hsl(${220 + (index * 15)}, 50%, 60%)`
                    }}
                  >
                    <span className="bar-value">{data.hours.toFixed(1)}h</span>
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
        <h3>Monthly Usage</h3>
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
              <span className="hours-value">{data.hours.toFixed(1)} hours</span>
              <span className="sessions-value">{data.sessions} sessions</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProcessChecking