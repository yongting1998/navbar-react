import logo from "../../../assets/cloudplus_logo.png";
import { Link } from "react-router-dom";
import "./NavbarWeb.scss";
const NavbarWeb = () => {
  return (
    <nav className="web-nav">
      <img src={logo} alt="Logo" />
      <div className="web-nav__links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
      </div>
    </nav>
  );
};

export default NavbarWeb;
