import React from "react";
import logo from "../assets/logo.png";
import { ReactComponent as HomeIcon } from "../assets/home.svg";
import { ReactComponent as ScheduleIcon } from "../assets/schedule.svg";
import { ReactComponent as OnlineIcon } from "../assets/online.svg";
import { ReactComponent as QuizIcon } from "../assets/quiz.svg";
import { ReactComponent as ProgressIcon } from "../assets/progress.svg";
import { ReactComponent as LogoutIcon } from "../assets/logout.svg";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
import "../custom.css";

function Tabs({ setIsLogin }) {
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const location = useLocation(); // Get the current location (URL)

  // A mapping of paths to tab indices
  const tabPathMapping = {
    "/": 0,
    "/categories": 1,
    "/quizzes": 2,
    "/questions": 3,
    "/requests": 4, // Add this line for courseSlug paths
    "/payments": 5,
    "/permissions": 6,
  };

  // Determine which tab is active based on the URL path
  const activeTab = Object.keys(tabPathMapping).some((path) =>
    location.pathname.includes("/quizzes")
  )
    ? 2
    : tabPathMapping[location.pathname] || 0;

  const handleTabClick = (path) => {
    navigate(path); // Navigate to the corresponding route
  };

  const handleLogout = () => {
    setIsLogin(false);
    localStorage.setItem("isLogin", false);
    navigate("/");
  };

  return (
    <div className="bm-tabs-container">
      <div className="bm-tabs-header">
        <div className="bm-logo">
          <img src={logo} alt="" />
        </div>

        {/* Tabs for navigation */}
        <div
          className={activeTab === 0 ? "tab active" : "tab"}
          onClick={() => handleTabClick("/")} // Route to Dashboard
        >
          <HomeIcon />
          Users
        </div>
        <div
          className={activeTab === 1 ? "tab active" : "tab"}
          onClick={() => handleTabClick("/categories")} // Route to Schedule Classes
        >
          <ScheduleIcon />
          Categories
        </div>
        <div
          className={activeTab === 2 ? "tab active" : "tab"}
          onClick={() => handleTabClick("/quizzes")} // Route to Online Classes
        >
          <OnlineIcon />
          Quizzes
        </div>
        <div
          className={activeTab === 3 ? "tab active" : "tab"}
          onClick={() => handleTabClick("/questions")}
        >
          <QuizIcon />
          Questions
        </div>
        <div
          className={activeTab === 4 ? "tab active" : "tab"}
          onClick={() => handleTabClick("/requests")} // Route to Progress
        >
          <ProgressIcon />
          Requests
        </div>
        <div
          className={activeTab === 5 ? "tab active" : "tab"}
          onClick={() => handleTabClick("/payments")} // Route to Progress
        >
          <ProgressIcon />
          Payments
        </div>
        <div
          className={activeTab === 6 ? "tab active" : "tab"}
          onClick={() => handleTabClick("/permissions")} // Route to Progress
        >
          <ProgressIcon />
          Permissions
        </div>
        <button className="tab bm-logout" onClick={handleLogout}>
          <LogoutIcon />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Tabs;
