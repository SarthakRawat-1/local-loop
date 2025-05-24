import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function PasswordInput(props: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <input
        {...props}
        type={show ? "text" : "password"}
        style={{ paddingRight: "2rem", width: "100%" }}
      />
      <span
        onClick={() => setShow((s) => !s)}
        style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
        }}
        tabIndex={0}
        role="button"
        aria-label={show ? "Hide password" : "Show password"}
      >
        <FontAwesomeIcon icon={show ? faEyeSlash : faEye} size="lg" />
      </span>
    </div>
  );
}