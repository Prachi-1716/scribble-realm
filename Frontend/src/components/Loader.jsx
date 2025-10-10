import React from "react";

export default function Loader({ size = 48, color = "#0A1A2F" }) {
  const loaderStyle = {
    width: `${size}px`,
    height: `${size}px`,
    position: "relative",
  };

  const beforeAfterStyle = `
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: ${size}em;
    height: ${size}em;
    background-image:
      radial-gradient(circle 10px, ${color} 100%, transparent 0),
      radial-gradient(circle 10px, ${color} 100%, transparent 0),
      radial-gradient(circle 10px, ${color} 100%, transparent 0),
      radial-gradient(circle 10px, ${color} 100%, transparent 0),
      radial-gradient(circle 10px, ${color} 100%, transparent 0),
      radial-gradient(circle 10px, ${color} 100%, transparent 0),
      radial-gradient(circle 10px, ${color} 100%, transparent 0),
      radial-gradient(circle 10px, ${color} 100%, transparent 0);
    background-position: 0em -18em, 0em 18em, 18em 0em, -18em 0em,
                         13em -13em, -13em -13em, 13em 13em, -13em 13em;
    background-repeat: no-repeat;
    font-size: 0.5px;
    border-radius: 50%;
    animation: blast 1s ease-in infinite;
  `;

  const afterStyle = `
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 1px;
    background: ${color};
    animation: bounce 1s ease-in infinite;
  `;

  return (
    <div style={loaderStyle} className="loader">
      <style>
        {`
          .loader::before { ${beforeAfterStyle} }
          .loader::after { ${afterStyle} }

          @keyframes bounce {
            0%, 100% { font-size: 0.75px; }
            50% { font-size: 1.5px; }
          }

          @keyframes blast {
            0%, 40% { font-size: 0.5px; }
            70% { opacity: 1; font-size: 4px; }
            100% { font-size: 6px; opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}
