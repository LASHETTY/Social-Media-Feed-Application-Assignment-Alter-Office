import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import useStore from './store/useStore';
import Navigation from './components/Navigation';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Login from './pages/Login';

const App: React.FC = () => {
  const setCurrentUser = useStore(state => state.setCurrentUser);
  const currentUser = useStore(state => state.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, [setCurrentUser]);

  return (
    <Router>
      <div className="min-h-screen bg-background pb-16 md:pb-0 md:pt-16">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={currentUser ? <Feed /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={currentUser ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!currentUser ? <Login /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
