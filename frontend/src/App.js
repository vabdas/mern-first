import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import RestaurantsList from "./components/restaurants-list";
import AddReview from "./components/add-review";
import Restaurants from "./components/restaurants";
import Login from "./components/login";

function App() {

  const [user, setUser] = React.useState(null);
  async function login(user = null) {
    setUser(user);
  }
  async function logout() {
    setUser(null)
  }
  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="/restaurants">Restaurant Reviews</a>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <Link to={"/restaurants"} class="nav-link">
                Resturants
              </Link>
            </li>
            <li class="nav-item">
              {user ? (
                <a onClick={{ logout }} className="nav-link" style={{ cursor: 'pointer' }}>
                  Logout{user.name}
                </a>) : (
                <Link to={"/login"} class="nav-link">
                  Login
                </Link>
              )}
            </li>


          </ul>

        </div>

      </nav>
      <div class="container mt-3">
        <Switch>
          <Route exact path={["/", "/</Switch>restaurants"]} component={RestaurantsList} />

          <Route
            path="/restaurants/:id/review"
            render={(props) => {
              <AddReview {...props} user={user} />
            }}
          />
          <Route
            path="/restaurants/:id"
            render={(props) => {
              <Restaurants {...props} user={user} />
            }}
          />
          <Route
            path="/login"
            render={(props) => {
              <Login {...props} login={login} />
            }}
          />
        </Switch>
      </div>
    </div>
  );
}

export default App;
