import "./App.css";
import Tabs from "./components/tabs";
import "./custom.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Users from "./components/tabContents/users";
import Categories from "./components/tabContents/categories";
import Quizzes from "./components/tabContents/quizzes";
import ViewUser from "./components/tabContents/viewUser";
import Chapters from "./components/tabContents/chapters";
import Questions from "./components/tabContents/questions";
import Requests from "./components/tabContents/requests";
import Payments from "./components/tabContents/payments";
import Permissions from "./components/tabContents/permissions";
import Login from "./components/login/login";
import NotFound from "./components/NotFound"; 
import Logo from "./assets/logo.png";
import { useState, useEffect } from "react";
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode

// Utility function to decode JWT token and check expiry using jwtDecode
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token); // Decode token
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decodedToken.exp < currentTime; // Check if the token is expired
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // If there is an error, assume the token is expired
  }
}

function App() {
  const [isLogin, setIsLogin] = useState(false); // Login state
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Check if token exists and is not expired
    if (token && !isTokenExpired(token)) {
      setIsLogin(true); // User is logged in
    } else {
      // If token is expired or not available, log out the user
      setIsLogin(false);
      localStorage.removeItem("isLogin");
      localStorage.removeItem("token");
    }
    setLoading(false); // Stop loading
  }, []);

  useEffect(() => {
    // Sync the login state with local storage
    localStorage.setItem("isLogin", isLogin);
  }, [isLogin]);

  if (loading) {
    return (
      <div className="bm-page-loading">
        <img src={Logo} alt="logo" />
      </div>
    );
  }

  return (
    <div className={isLogin ? "bm-main" : ""}>
      <Router>
        {isLogin ? <Tabs setIsLogin={setIsLogin} /> : null}

        <Routes>
          {/* Login route */}
          {!isLogin ? (
            <Route path="/" element={<Login setIsLogin={setIsLogin} />} />
          ) : (
            <>
              <Route path="/" element={<Users />} />
              <Route path="/users/:userId" element={<ViewUser />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/quizzes/" element={<Quizzes />} />
              <Route path="/quizzes/:categoryId" element={<Quizzes />} />
              <Route path="/chapters/" element={<Chapters />} />
              <Route path="/chapters/:quizId" element={<Chapters />} />
              <Route path="/questions/:chapterId" element={<Questions />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/permissions" element={<Permissions />} />

              {/* Handle invalid URLs (404 Page Not Found) */}
              <Route path="*" element={<NotFound />} />
            </>
          )}

          {/* Redirect to login page if not logged in and trying to access a protected route */}
          <Route path="*" element={!isLogin ? <Navigate to="/" /> : <NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
