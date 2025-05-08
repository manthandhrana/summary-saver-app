import React from 'react';
import { Link } from 'react-router-dom';
import "./common.css";

export default function Header() {
  return (
    <header>
      <h1>E-Summary</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
    </header>
  );
}
