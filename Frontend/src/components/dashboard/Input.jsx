import "./style.css";
function Input({ profileData }) {
  return (
    <>  
      <h6 className="mt-3">Social Links</h6>

      <div className="input d-flex flex-column input social-links">
        <i className="fab fa-facebook-f social-icon"></i>
        <input
          name="facebook"
          type="text"
          defaultValue={profileData.social_links.facebook}
          placeholder="https://facebook.com/username"
        />
      </div>

      <div className="input social-links d-flex flex-column input social-links">
        <i className="fab fa-github social-icon"></i>
        <input
          name="github"
          type="text"
          defaultValue={profileData.social_links.github}
          placeholder="https://github.com/username"
        />
      </div>

      <div className="input social-links d-flex flex-column input social-links">
        <i className="fab fa-instagram social-icon"></i>
        <input
          name="instagram"
          type="text"
          defaultValue={profileData.social_links.instagram}
          placeholder="https://instagram.com/yourusername"
        />
      </div>

      <div className="input social-links d-flex flex-column input social-links">
        <i className="fab fa-twitter social-icon"></i>
        <input
          name="twitter"
          type="text"
          defaultValue={profileData.social_links.twitter}
          placeholder="https://twitter.com/yourusername"
        />
      </div>

      <div className="input social-links d-flex flex-column input social-links">
        <i className="fab fa-youtube social-icon"></i>
        <input
          name="youtube"
          type="text"
          defaultValue={profileData.social_links.youtube}
          placeholder="https://youtube.com/yourchannel"
        />
      </div>

      <div className="input social-links d-flex flex-column input social-links">
        <i className="fas fa-globe social-icon"></i>
        <input
          name="websites"
          type="text"
          defaultValue={profileData.social_links.websites}
          placeholder="https://yourwebsite.com"
        />
      </div>

       <button className="submit-button">Save Changes</button>
    </>
  );
}

export default Input;
