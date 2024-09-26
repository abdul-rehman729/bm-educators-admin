import React from "react";
import logo from "../assets/logo.png";
import { ReactComponent as UserIcon } from "../assets/users.svg";
import { ReactComponent as CategoriesIcon } from "../assets/categories.svg";
import { ReactComponent as QuestionIcon } from "../assets/questions.svg";
import { ReactComponent as QuizIcon } from "../assets/quiz.svg";
import { ReactComponent as RequestIcon } from "../assets/requests.svg";
import { ReactComponent as PaymentIcon } from "../assets/payments.svg";
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
    "/questions": 2,
    "/quizzes": 3,
    "/requests": 4,
    "/payments": 5,
  };

  // Determine which tab is active based on the URL path
  const activeTab = Object.keys(tabPathMapping).some((path) =>
    location.pathname.includes("/quizzes")
  )
    ? 3
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
          <UserIcon />
          Users
        </div>
        <div
          className={activeTab === 1 ? "tab active" : "tab"}
          onClick={() => handleTabClick("/categories")} // Route to Schedule Classes
        >
          <CategoriesIcon />
          Categories
        </div>
        <div
          className={activeTab === 2 ? "tab active" : "tab"}
          onClick={() => handleTabClick("/questions")}
        >
          <QuestionIcon />
          Questions
        </div>
        <div
          className={activeTab === 3 ? "tab active" : "tab"}
          onClick={() => handleTabClick("/quizzes")} // Route to Online Classes
        >
          <QuizIcon />
          Quizzes
        </div>
        <div
          className={activeTab === 4 ? "tab active" : "tab"}
          onClick={() => handleTabClick("/requests")} // Route to Progress
        >
          <RequestIcon />
          Requests
        </div>
        <div
          className={activeTab === 5 ? "tab active" : "tab"}
          onClick={() => handleTabClick("/payments")} // Route to Progress
        >
          <PaymentIcon />
          Payments
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
