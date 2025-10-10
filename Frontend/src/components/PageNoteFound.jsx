import React from "react";

let images = import.meta.glob('/src/assets/animePack/*.{png,jpg,jpeg,webp}', { eager: true });
images = Object.values(images).map(module => module.default);



const NotFound = () => {
  const randomImage = images[Math.floor(Math.random() * images.length)];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404</h1>
      <p style={styles.text}>Oops! The page you are looking for is missing...</p>
      <div style={styles.imageContainer}>
        <img src={randomImage} alt="cute anime" style={styles.image} />
      </div>
      <a href="/" style={styles.button}>Go Back Home</a>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Baloo 2', cursive",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "85vh",
    backgroundColor: "#ffffffff",
    textAlign: "center",
  },
  heading: {
    fontSize: "2rem",
    color: "#0A1A2F",
  },
  text: {
    fontSize: "1.5rem",
    margin: "1rem 0 2rem",
    color: "#333",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "2rem",
  },
  image: {
    maxWidth: "280px",
    maxHeight: "280px",
    borderRadius: "12px",
    transition: "transform 0.3s",
  },
  button: {
    textDecoration: "none",
    backgroundColor: "#0A1A2F",
    color: "white",
    padding: "0.8rem 1.5rem",
    borderRadius: "8px",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
};

export default NotFound;
