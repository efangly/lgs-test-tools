"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("garden");
  
    useEffect(() => {
      if (typeof window !== "undefined") {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
          setTheme(storedTheme);
        }
      }
    }, []);
  
    useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }, [theme]);

  return (
    <label className="flex cursor-pointer items-center gap-2 mx-2">
      <FiSun />
      <input
        type="checkbox"
        checked={theme === "sunset" ? true : false}
        onChange={(e) => setTheme(e.target.checked ? "sunset" : "garden")}
        className="toggle theme-controller" />
      <FiMoon />
    </label>
  );
}