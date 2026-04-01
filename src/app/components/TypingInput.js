"use client";

import { useEffect, useState } from "react";
import styles from "../(main)/main.module.css";

export default function TypingInput({ className }) {
  const texts = ["Browse Books", "Search novels...", "Find your next read..."];

  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout;

    if (charIndex < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayText((prev) => prev + currentText[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 50);
    } else {
      timeout = setTimeout(() => {
        setDisplayText("");
        setCharIndex(0);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }, 1500);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, textIndex]);

  return (
    <input
      type="text"
      placeholder={displayText}
      className={className}
      readOnly
    />
  );
}
