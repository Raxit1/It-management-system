import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../api/api";

export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company_code: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    try {

      const response = await API.post(
        "/login",
        formData
      );

      /* SAVE TOKEN */

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      /* DECODE TOKEN */

      const decoded = jwtDecode(
        response.data.access_token
      );

      console.log(decoded);

      /* ROLE BASED REDIRECT */

      if (decoded.role === "admin") {

        navigate("/dashboard");

      }
      else if (decoded.role === "employee") {

        navigate("/employee-dashboard");

      }
      else {

        navigate("/");

      }

    } catch (error) {

      console.log(error.response?.data);

      setError(
        error.response?.data?.detail ||
        "Login failed"
      );

    }
  };

  return (

    <div className="login-container">

      <form
        onSubmit={handleLogin}
        className="login-box"
      >

        <h1 className="login-title">
          Company Login
        </h1>

        <p className="login-subtitle">
          Welcome back to IT Management System
        </p>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <input
          type="text"
          name="company_code"
          placeholder="Company Code"
          className="login-input"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="login-input"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="login-input"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="login-button"
        >
          Login
        </button>

      </form>

    </div>
  );
}