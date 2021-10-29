import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavbarSection from "./components/navbar/NavbarSection.js";
const Home = React.lazy(() => import("./views/Home.js"));

const App = () => {
  const [tabletView, setTabletView] = useState(window.innerWidth < 1200);
  useEffect(() => {
    const handleResize = () => {
      setTabletView(window.innerWidth < 1200);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
  return (
    <Router>
      <NavbarSection tabletView={tabletView} />
      {/* lazy loading, i think react router already has this in <Switch>?? have to check because view is pre imported */}
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

export default App;
