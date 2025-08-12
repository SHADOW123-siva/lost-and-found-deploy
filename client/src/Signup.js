import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/signup", {
        name,
        email,
        password,
      });

      alert("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="auth-container text-center">
      <img src="images/iitk_logo.png" alt="IITK Logo" className="mb-3 auth-logo" />
      <h2 className="mb-3">Sign Up</h2>

      <form onSubmit={handleSignup} className="text-start">
        <input type="text" className="form-control mb-2" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" className="form-control mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="form-control mb-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-success w-100">Create Account</button>
      </form>

      {errorMsg && <p className="text-danger mt-2">{errorMsg}</p>}
      <p className="mt-3">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Signup;