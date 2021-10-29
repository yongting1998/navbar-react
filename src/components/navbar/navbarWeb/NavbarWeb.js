import logo from "../../../assets/cloudplus_logo.png";
import { NavLink } from "react-router-dom";
import "./NavbarWeb.scss";
import { NavMenuItems } from "../NavMenuItems";
const NavbarWeb = () => {
  return (
    <nav className="web-nav">
      <img src={logo} alt="Logo" />
      <div className="web-nav__links">
        {/* can use this to tabulate if too many routes */}
        {/* {NavMenuItems.map((item, index) => {
          return (
            <NavLink
              activeClassName="is-active"
              className="web-nav__routes"
              to={item.url}
              key={index}
            >
              {item.title}
            </NavLink>
          );
        })} */}
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
