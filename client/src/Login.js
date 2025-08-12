import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  setErrorMsg("");

  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log("login response data:", data)

    if (response.ok) {
      navigate("/");
      localStorage.setItem("loggedIn", "true");
      setIsLoggedIn(true);

      localStorage.setItem("username", data.user.name);

      setEmail("");      
      setPassword("");
    } else {
      setErrorMsg(data.message || "Login failed.");
    }
  } catch (error) {
    console.error("Login error:", error);
  }

};


  return (
    <div className="auth-container text-center">
      <img
        src="images/iitk_logo.png"
        alt="IITK Logo"
        className="mb-3 auth-logo"
      />
      <h2 className="mb-3">Login</h2>

      <form onSubmit={handleLogin} className="text-start">
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100">Login</button>
      </form>

      {errorMsg && <p className="text-danger mt-2">{errorMsg}</p>}

      <p className="mt-3">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;