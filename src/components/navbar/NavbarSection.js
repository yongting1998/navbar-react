import { useState, useEffect } from "react";
import NavbarTablet from "./navbarTablet/NavbarTablet.js";
import NavBarWeb from "./navbarWeb/NavbarWeb.js";
const NavbarSection = () => {
  const [tabletView, setTabletView] = useState(window.innerWidth < 1200);
  useEffect(() => {
    const handleResize = () => {
      setTabletView(window.innerWidth < 1200);
      console.log("ASD");
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
  return <>{tabletView ? <NavbarTablet /> : <NavBarWeb />}</>;
};

export default NavbarSection;
