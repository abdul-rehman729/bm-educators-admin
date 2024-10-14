import React, { useState } from "react";
import Logo from "../../assets/logo-horizontal.png";

function Login({ setIsLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://108.181.195.7:3000/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (data.status) {
        localStorage.setItem("token", data.userDetails.jwt_token);

        // Store login status
        setIsLogin(true);
        localStorage.setItem("isLogin", true);

        setError(null); // Clear error state
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
        setIsLogin(false);
      }
    } catch (error) {
      // Check if the token has expired or if an authorization error occurs
      if (error.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLogin");
        setIsLogin(false);
      }
      setError("An error occurred. Please try again later.");
      setIsLogin(false);
    } finally {
      setIsSubmitting(false); // Re-enable the form submission after processing
    }
  };

  return (
    <div className="bm-login">
      <div className="login-box">
        <img className="logo" src={Logo} alt="logo" />

        <div className="heading">
          <h1>Login</h1>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form
          className="login-form"
          autoComplete="off"
          onSubmit={handleSubmitLogin}
        >
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting} // Disable input when submitting
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting} // Disable input when submitting
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {" "}
            {/* Disable button when submitting */}
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
