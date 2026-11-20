import { useState } from "react";
import "./Auth.css";

// This component handles both login and registration.
function Auth({ onLogin }) {
  // Track whether the user wants to sign up or log in.
  const [isRegistering, setIsRegistering] = useState(false);

  // Store the information entered by the user.
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle login or registration when the user submits the form.
const handleSubmit = async (event) => {
  // Prevent the page from refreshing.
  event.preventDefault();

  // Choose the correct API endpoint.
  const endpoint = isRegistering ? "register" : "login";

  // Prepare the information to send to the backend.
  const userData = {
    email: email,
    password: password
  };

  // Registration also requires the user's full name.
  if (isRegistering) {
    userData.fullName = fullName;
  }

  try {
    // Send the form information to the backend.
    const response = await fetch(
      `/api/auth/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(userData)
      }
    );

    // Read the response from the backend.
    const data = await response.json();

    // Show an error if the request was unsuccessful.
    if (!response.ok) {
      alert(data.error || "Something went wrong.");
      return;
    }

    // After registration, switch to the login form.
    if (isRegistering) {
      alert("Account created successfully! Please log in.");
      setIsRegistering(false);
      setPassword("");
      return;
    }

    // Tell the main application that login succeeded.
    onLogin(data.user);

  } catch (error) {
    // Handle connection errors.
    console.error("Authentication error:", error);
    alert("Could not connect to the server.");
  }
};

  return (
    <div className="authPage">
      <h1>StudentAtlas</h1>

      <h2>
        {isRegistering ? "Create an Account" : "Welcome Back"}
      </h2>

      <form onSubmit={handleSubmit} className="authForm">

        {/* Only show the name field when signing up. */}
        {isRegistering && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
        )}

        {/* Let the user enter their email address. */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        {/* Let the user enter their password. */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={isRegistering ? 12 : undefined}
          required
        />

        {/* Submit the login or registration form. */}
        <button type="submit">
          {isRegistering ? "Sign Up" : "Log In"}
        </button>
      </form>

      {/* Switch between login and registration. */}
      <button
        type="button"
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering
          ? "Already have an account? Log In"
          : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
}

export default Auth;