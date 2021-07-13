import React from 'react';
import onlineIcon from '../../icons/onlineIcon.png';

import './InfoBar.css';

const InfoBar = () => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" src={onlineIcon} alt="online icon" />
      <h3 style={{ fontFamily: "serif" }}>CHAT</h3>
    </div>
    <div className="rightInnerContainer">
    </div>
  </div>
);

export default InfoBar;