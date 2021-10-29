import "./NavbarTablet.scss";
import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/cloudplus_logo.png";
import { useLocation } from "react-router-dom";
const NavbarMobile = () => {
  const location = useLocation();
  function toggleSideBar() {
    document.getElementById("btn-burger-wrapper").classList.toggle("active");
    document.getElementById("sidebar-wrapper").classList.toggle("active");
  }
  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      toggleSideBar();
    }
  }, [location]);

  return (
    <>
      <nav className="tablet-nav">
        <div className="table-nav__topbar">
          <img src={logo} alt="Logo" className="tablet-nav__topbar__logo" />
          <div
            className="tablet-nav__topbar__toggle-btn"
            id="btn-burger-wrapper"
            onClick={toggleSideBar}
          >
            <div className="btn-burger" />
          </div>
        </div>
        <div className="tablet-nav__sidebar" id="sidebar-wrapper">
          <ul>
            <li>
              <NavLink
                exact={true}
                activeClassName="is-active"
                className="web-nav__routes"
                to="/"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                activeClassName="is-active"
                className="web-nav__routes"
                to="/about"
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                activeClassName="is-active"
                className="web-nav__routes"
                to="/users"
              >
                Users
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavbarMobile;
