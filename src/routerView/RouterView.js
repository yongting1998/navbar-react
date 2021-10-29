import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter,
} from "react-router-dom";
import NavbarSection from "../components/navbar/NavbarSection.js";

const Home = React.lazy(() => import("../views/Home.js"));
const RouterView = () => {
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
  return (
    <BrowserRouter>
      <NavbarSection tabletView={tabletView} />
      <React.Suspense fallback={<p>Loading</p>}>
        <Switch>
          <Route path="/about">
            <div>ABOUT</div>
          </Route>
          <Route path="/users">
            <div>Users</div>
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default RouterView;
