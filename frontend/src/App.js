import React from "react";
import { Route, Link, Routes } from "react-router-dom";
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
      <nav className="navbar navbar-expand navbar-light bg-light">
        <a href="/restaurants" className="navbar-brand">Restaurant Reviews</a>

        <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/restaurants"} className="nav-link">
                Resturants
              </Link>
            </li>
             <li className="nav-item">
              { user ? (
                <a href onClick={{ logout }} className="nav-link" style={{ cursor: 'pointer' }}>
                  Logout{user.name}
                </a>
                ) : (
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              )}
            </li>
        </div>

      </nav>
      <div className="container mt-3">
        <Routes>
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
        </Routes>
      </div>
    </div>
  );
}

export default App;
