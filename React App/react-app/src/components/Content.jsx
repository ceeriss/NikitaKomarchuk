import React from "react";
import "./Content.css";

const Content = () => {
  return (
    <div className="content">
      <div>
        <img src="/imgs/IMAGE.png" alt="Content Image" />
      </div>
      <div>
        <p className = 'podcast'>
          Take your <br /> podcast to the <br /> next <span>level</span>
        </p>
        <div className = 'Socials'>
          <p className = 'Listen'>Listen on</p>
          <div>
            <img src="../../imgs/spotify.png" alt="" />
            <img src="../../imgs/link.png" alt="" />
            <img src="../../imgs/itunes.png" alt="" />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Content;
