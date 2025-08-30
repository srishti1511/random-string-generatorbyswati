import React from "react";
import RandomStringGenerator from "./RandomStringGenerator";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <div className="content">
        <RandomStringGenerator />
      </div>

       <footer className="footer">
        <p>© {new Date().getFullYear()} Random CAPTCHA/Password Generator | All Rights Reserved</p>
        <p>Made with ❤️ by Swati Patel</p>
      </footer>
    </div>
  );
}

export default App;
