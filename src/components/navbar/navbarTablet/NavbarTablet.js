import "./NavbarTablet.scss";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/cloudplus_logo.png";
const NavbarMobile = () => {
  function toggleSideBar() {
    document.getElementById("btn-burger-wrapper").classList.toggle("active");
    document.getElementById("sidebar-wrapper").classList.toggle("active");
  }
  return (
    <>
      <nav className="tablet-nav">
        <div class="table-nav__topbar">
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
