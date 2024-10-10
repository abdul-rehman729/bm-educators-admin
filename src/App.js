import "./App.css";
import Tabs from "./components/tabs";
import "./custom.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "./components/tabContents/users";
import Categories from "./components/tabContents/categories";
import Quizzes from "./components/tabContents/quizzes";
import Chapters from "./components/tabContents/chapters";
import Requests from "./components/tabContents/requests";
import Payments from "./components/tabContents/payments";
import Permissions from "./components/tabContents/permissions";
import Login from "./components/login/login";
import { useState, useEffect } from "react";

function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const storedLoginState = localStorage.getItem("isLogin");
    if (storedLoginState === "true") {
      setIsLogin(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("isLogin", isLogin);
  }, [isLogin]);

  return (
    <div className={isLogin ? "bm-main" : ""}>
      <Router>
        {isLogin ? <Tabs setIsLogin={setIsLogin} /> : null}

        <Routes>
          {/* Show Login Route when not logged in */}
          {!isLogin ? (
            <Route path="/" element={<Login setIsLogin={setIsLogin} />} />
          ) : (
            <>
              <Route path="/" element={<Users />} />
              <Route path="/categories" element={<Categories />} />
              
              {/* Dynamic Route for quizzes based on the selected category name */}
              <Route path="/quizzes/" element={<Quizzes />} />
              
              {/* Dynamic Route for chapters based on the selected chapter */}
              <Route path="/chapters/" element={<Chapters />} />
              
              <Route path="/requests" element={<Requests />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/permissions" element={<Permissions />} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
