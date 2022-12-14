import React from 'react';
import './InfoBar.css';

const InfoBar = ({ room, setChatbot }) => (
  <div className="infoBar bg-primary">
    <div className="leftInnerContainer">
      <h3 className='text-white'>{room}</h3>
    </div>
    <div className="rightInnerContainer">
      <div onClick={() => setChatbot && setChatbot(false)} alt="close icon" className='ri-close-line' />
    </div>
  </div>
);

export default InfoBar;