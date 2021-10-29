import NavbarTablet from "./navbarTablet/NavbarTablet.js";
import NavBarWeb from "./navbarWeb/NavbarWeb.js";
const NavbarSection = ({ tabletView }) => {
  return <>{tabletView ? <NavbarTablet /> : <NavBarWeb />}</>;
};

export default NavbarSection;
