import React, { useState } from "react";
import Logo from "../../assets/logo-horizontal.png";

function Login({ setIsLogin }) {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isSignupForm, setIsSignupForm] = useState(false);

  const handleSignupForm = () => {
    setIsLoginForm(false);
    setIsSignupForm(true);
  };

  const handleLoginForm = () => {
    setIsLoginForm(true);
    setIsSignupForm(false);
  };

  const handleIsLogin = () => {
    setIsLogin(true);
    localStorage.setItem("isLogin", true);
  };

  return (
    <>
      {isLoginForm && (
        <div className="bm-login">
          <div className="login-box">
            <img className="logo" src={Logo} alt="logo" />

            <div className="heading">
              <h1>Login</h1>
              <p>
                Don't have an account?{" "}
                <button onClick={handleSignupForm}>Sign up</button>
              </p>
            </div>

            <form action="#" className="login-form" autoComplete="off">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                />
              </div>

              <button type="submit" onClick={handleIsLogin}>
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {isSignupForm && (
        <div className="bm-login">
          <div className="login-box">
            <img className="logo" src={Logo} alt="logo" />

            <div className="heading">
              <h1>Sign up</h1>
              <p>
                Already have an account?{" "}
                <button onClick={handleLoginForm}>Login</button>
              </p>
            </div>

            <form action="#" className="login-form">
              <div className="field-row">
                <div className="field">
                  <label htmlFor="f-name">First Name</label>
                  <input
                    type="text"
                    id="f-name"
                    placeholder="Enter your First Name"
                  />
                </div>
                <div className="field">
                  <label htmlFor="l-name">Last Name</label>
                  <input
                    type="text"
                    id="l-name"
                    placeholder="Enter your Last Name"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                />
              </div>

              <button type="submit" onClick={handleIsLogin}>
                Sign up
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
