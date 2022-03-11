import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faChartColumn,
  faBars,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <div className="the-navbar">
      <div className="navbar-content">
        <div className="content-left">
          <div className="navbar-button">
            <FontAwesomeIcon icon={faBars} />
          </div>
          <div className="navbar-button">
            <FontAwesomeIcon icon={faCircleQuestion} />
          </div>
        </div>
        <div className="content-middle">Wordle</div>
        <div className="content-right">
          <div className="navbar-button">
            <FontAwesomeIcon icon={faChartColumn} />
          </div>
          <div className="navbar-button">
            <FontAwesomeIcon icon={faGear} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
