import logo from "../../../assets/cloudplus_logo.png";
import { NavLink } from "react-router-dom";
import "./NavbarWeb.scss";
const NavbarWeb = () => {
  return (
    <nav className="web-nav">
      <img src={logo} alt="Logo" />
      <div className="web-nav__links">
        <NavLink
          exact={true}
          activeClassName="is-active"
          className="web-nav__routes"
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          activeClassName="is-active"
          className="web-nav__routes"
          to="/about"
        >
          About
        </NavLink>
        <NavLink
          activeClassName="is-active"
          className="web-nav__routes"
          to="/users"
        >
          Users
        </NavLink>
      </div>
    </nav>
  );
};

export default NavbarWeb;
