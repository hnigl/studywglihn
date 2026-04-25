import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Timetable from './components/Timetable'
import StudyWithMe from './components/StudyWithMe'
import ProcessChecking from './components/ProcessChecking'
import './App.css'
import heroLogo from './assets/frontpage.png.png'
import { auth, db } from './components/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully.");
      setEmail("");
      setPassword("");
      setIsRegistering(false);
    } catch (err) {
      setError(err.message || "Registration failed.");
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful.");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Login failed.");
    }
    setLoading(false);
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>Glinh's Study Corner</h1>
        <h2>{isRegistering ? 'Create an account' : 'Sign in to continue'}</h2>

        <input
          className="login-input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="login-error">{error}</div>}

        <div className="login-actions">
          <button
            className="login-button"
            onClick={isRegistering ? handleRegister : handleLogin}
            disabled={loading}
          >
            {loading ? 'Processing...' : isRegistering ? 'Create account' : 'Sign in'}
          </button>
          <button
            type="button"
            className="login-button login-toggle"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
            }}
          >
            {isRegistering ? 'Back to sign in' : 'Create account'}
          </button>
        </div>

        <p className="login-note">
          Enter your email and password to access your study dashboard.
        </p>
      </div>
    </div>
  );
};

const FrontPage = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState('Loading advice...');
  useEffect(() => {
    fetch('https://api.adviceslip.com/advice')
      .then(response => response.json())
      .then(data => setQuote(data.slip.advice))
      .catch(() => setQuote('Failed to load advice.'));
  }, []);
  const handleClick = () => {
    navigate('/timetable');
  };
  return (
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
      <div className="quote">"{quote}"</div>
    </div>
  );
};

const AppContent = ({ user }) => {
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
          <button onClick={() => signOut(auth)} className="logout-button">Logout</button>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/studywithme" element={<StudyWithMe />} />
          <Route path="/process-checking" element={<ProcessChecking user={user} />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const initialDaily = [
    { day: 'Mon', hours: 0, sessions: 0 },
    { day: 'Tue', hours: 0, sessions: 0 },
    { day: 'Wed', hours: 0, sessions: 0 },
    { day: 'Thu', hours: 0, sessions: 0 },
    { day: 'Fri', hours: 0, sessions: 0 },
    { day: 'Sat', hours: 0, sessions: 0 },
    { day: 'Sun', hours: 0, sessions: 0 }
  ];

  const initialMonthly = [
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
  ];

  const ensureUsageDoc = async (currentUser) => {
    if (!currentUser) return;
    const userDoc = doc(db, 'users', currentUser.uid);
    const snapshot = await getDoc(userDoc);
    if (!snapshot.exists()) {
      await setDoc(userDoc, {
        dailyData: initialDaily,
        monthlyData: initialMonthly,
        updatedAt: new Date()
      });
    }
  };

  const recordUsage = async (currentUser, path) => {
    if (!currentUser) return;
    if (!['/studywithme', '/timetable'].includes(path)) return;

    const pageSettings = {
      '/studywithme': { hours: 0.5, sessions: 1 },
      '/timetable': { hours: 0.3, sessions: 1 }
    };
    const { hours, sessions } = pageSettings[path];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const today = dayNames[now.getDay()];
    const thisMonth = monthNames[now.getMonth()];

    const userDoc = doc(db, 'users', currentUser.uid);
    const snapshot = await getDoc(userDoc);
    const data = snapshot.exists() ? snapshot.data() : { dailyData: initialDaily, monthlyData: initialMonthly };

    const updatedDaily = data.dailyData.map((item) => {
      if (item.day === today) {
        return {
          ...item,
          hours: Math.round((item.hours + hours) * 10) / 10,
          sessions: item.sessions + sessions
        };
      }
      return item;
    });

    const updatedMonthly = data.monthlyData.map((item) => {
      if (item.month === thisMonth) {
        return {
          ...item,
          hours: Math.round((item.hours + hours) * 10) / 10,
          sessions: item.sessions + sessions
        };
      }
      return item;
    });

    await setDoc(userDoc, {
      dailyData: updatedDaily,
      monthlyData: updatedMonthly,
      updatedAt: new Date()
    }, { merge: true });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        ensureUsageDoc(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    recordUsage(user, location.pathname);
  }, [location.pathname, user]);

  if (loading) {
    return <div style={{ padding: 50, textAlign: 'center' }}>Loading...</div>;
  }

  return user ? <AppContent user={user} /> : <Login />;
}

export default App;