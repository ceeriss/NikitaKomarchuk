import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";

const ThemeToggle = () => {
  const [dark, setDark] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const handleToggle = () => setDark((prev) => !prev);

  return (
    <button
      onClick={handleToggle}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 32,
        color: dark ? "#fff" : "#222",
        padding: 0,
      }}
      aria-label="Сменить тему"
    >
      <FontAwesomeIcon icon={faCircleHalfStroke} />
    </button>
  );
};

export default ThemeToggle;
