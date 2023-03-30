import { useState, useEffect } from "react";
import { magic } from "./libs/magic";
import Login from "./components/Login";
import "./App.css";
import Loading from "./components/Loading";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Logout from "./components/Logout";
import Footer from "./components/Footer";

export default function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    // check if user logged in
    setUser({ loading: true });

    magic.user
      .isLoggedIn()
      .then((isLoggedIn) => {
        if (isLoggedIn) {
          magic.user.getMetadata().then((userData) => {
            setUser(userData);
          });
        } else {
          setUser({ user: null });
        }
      })
      .catch((err) => {
        console.error(err);
        magic.user.logout().then(console.log);
        setUser({ user: null });
      });
  }, []);

  return (
    <div className="App">
      <Header />

      {user?.loading ? (
        <Loading />
      ) : user?.issuer ? (
        <>
          <Dashboard user={user} />
          <Logout setUser={setUser} />
        </>
      ) : (
        <Login setUser={setUser} />
      )}
      <Footer />
    </div>
  );
}
