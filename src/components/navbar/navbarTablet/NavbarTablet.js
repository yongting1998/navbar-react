import "./NavbarTablet.scss";
import { Link } from "react-router-dom";
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
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavbarMobile;
