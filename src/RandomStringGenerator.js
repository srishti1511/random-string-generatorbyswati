import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";

function RandomStringGenerator() {
  const [randomString, setRandomString] = useState("");
  const [length, setLength] = useState(10);
  const [copied, setCopied] = useState(false);
  const [charset, setCharset] = useState("all");
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(true);
  const [autoRegenerate, setAutoRegenerate] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Generate string
  const generateString = useCallback(() => {
  let characters = "";
  if (charset === "letters") {
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  } else if (charset === "numbers") {
    characters = "0123456789";
  } else if (charset === "special") {
    characters = "!@#$%^&*()_+-=[]{}|;:',.<>/?";
  } else if (charset === "secure") {
    characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>/?";
  } else if (charset === "all") {
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  }

  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // ✅ Ensure at least 1 number if "all"
  if (charset === "all" && !/\d/.test(result)) {
    const pos = Math.floor(Math.random() * result.length);
    const num = "0123456789".charAt(Math.floor(Math.random() * 10));
    result = result.substring(0, pos) + num + result.substring(pos + 1);
  }

  setRandomString(result);
  setCopied(false);
}, [length, charset]);


  useEffect(() => {
    generateString();
  }, [generateString]);

  // Copy
  const copyToClipboard = () => {
    navigator.clipboard.writeText(randomString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);

    if (autoRegenerate) {
      generateString();
    }
  };

  // Strength check
  useEffect(() => {
    if (!randomString) return;

    let score = 0;
    if (randomString.length >= 8) score++;
    if (/[A-Z]/.test(randomString) && /[a-z]/.test(randomString)) score++;
    if (/\d/.test(randomString)) score++;
    if (/[^A-Za-z0-9]/.test(randomString)) score++;

    setStrength(score);
  }, [randomString]);

  const strengthLabel = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
  const strengthColors = ["#e74c3c", "#e67e22", "#f1c40f", "#27ae60", "#2ecc71"];

  return (
    <div className={`container ${darkMode ? "dark" : "light"}`}>
      <motion.div
        className="card"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="header"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h2>🔐 Secure CAPTCHA / Password Generator</h2>
          <motion.button
            className="theme-btn"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </motion.button>
        </motion.div>

        {/* Length Input */}
        <div className="input-box">
          <label>String Length: </label>
          <input
            type="number"
            min="4"
            max="50"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </div>

        {/* Charset */}
        <div className="input-box">
          <label>Allowed Characters: </label>
          <select value={charset} onChange={(e) => setCharset(e.target.value)}>
            <option value="all">Letters + Numbers</option>
            <option value="letters">Only Letters</option>
            <option value="numbers">Only Numbers</option>
            <option value="special">Only Special (!@#$%^&*)</option>
            <option value="secure">Letters + Numbers + Special (Strong)</option>
          </select>
        </div>

        {/* Generated Password */}
        <div className="string-wrapper">
          <motion.p
            key={randomString}
            className="string-box"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {showPassword ? randomString : "•".repeat(randomString.length)}
          </motion.p>
          <button
            className="toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈 Hide" : "👁️ Show"}
          </button>
        </div>

        {/* Strength Bar */}
        <div className={`strength-meter strength-${strength}`}>
          <motion.div
            className="strength-bar"
            initial={{ width: 0 }}
            animate={{ width: `${(strength / 4) * 100}%`, background: strengthColors[strength] }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <motion.p
          className="strength-text"
          animate={{ color: strengthColors[strength] }}
          transition={{ duration: 0.5 }}
        >
          {strengthLabel[strength]}
        </motion.p>

        {/* Auto regenerate checkbox */}
        <div className="input-box checkbox">
          <label>
            <input
              type="checkbox"
              checked={autoRegenerate}
              onChange={() => setAutoRegenerate(!autoRegenerate)}
            />
            Regenerate automatically after copy
          </label>
        </div>

        {/* Buttons */}
        <div className="btn-group">
          <motion.button
            whileHover={{ scale: 1.1, boxShadow: "0 0 12px #3498db" }}
            whileTap={{ scale: 0.9 }}
            onClick={generateString}
          >
            🎲 Generate New
          </motion.button>
          <motion.button
            className="copy-btn"
            whileHover={{ scale: 1.1, boxShadow: "0 0 12px #2ecc71" }}
            whileTap={{ scale: 0.9 }}
            animate={copied ? { scale: [1, 1.2, 1], backgroundColor: "#2ecc71" } : {}}
            transition={{ duration: 0.4 }}
            onClick={copyToClipboard}
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </motion.button>
        </div>
      </motion.div>
      
    



    </div>



  );
}

export default RandomStringGenerator;
