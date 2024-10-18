import "./MenuItem.scss";

import React from "react";
import { clsx } from "clsx";

const MenuItem = ({ icon, title, action, isActive = null }) => (
  <button
    className={`menu-item${isActive && isActive() ? " is-active" : ""}`}
    onClick={action}
    title={title}
  >
    <i className={`ri-${icon}`}></i>
  </button>
);

export default MenuItem;
