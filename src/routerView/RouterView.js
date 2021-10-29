import React from "react";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import NavbarSection from "../components/navbar/NavbarSection.js";

const Home = React.lazy(() => import("../views/Home.js"));
const RouterView = () => {
  return (
    <Router>
      <div>
        <NavbarSection />
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
      </div>
    </Router>
  );
};

export default RouterView;
