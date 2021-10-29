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
    <Router>
      <NavbarSection tabletView={tabletView} />
      {/* lazy loading, i think react router already has this in <Switch> */}
      <React.Suspense fallback={<p>Loading</p>}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <div>ABOUT</div>
          </Route>
          <Route path="/users">
            <div>Users</div>
          </Route>
        </Switch>
      </React.Suspense>
    </Router>
  );
};

export default RouterView;
