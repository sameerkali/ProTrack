import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound";
import AddTodo from "./Components/AddTodo";
import LogInForm from "./Pages/LogInForm";
import SignUpForm from "./Pages/SignUpForm";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ProfileCode from "./Pages/ProfileCode";
import ComingSoon from "./Pages/ComingSoon";
import Contributers from "./Components/Contributers";
import Globee from "./Charts/Globee";
import ContributionGraph from "./Components/ContributionGraph";
import ShowData from "./Pages/Data fetching group by date demo for learning/ShowData";

const auth = getAuth();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    });

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <span className="loading loading-dots loading-lg" />
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/add"
          element={user ? <AddTodo /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <ProfileCode /> : <Navigate to="/login" />}
        />
        <Route
          path="/comingsoon"
          element={user ? <ComingSoon /> : <Navigate to="/login" />}
        />
        <Route
          path="/contributers"
          element={user ? <Contributers /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<LogInForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/globe" element={<Globee />} />
        <Route
          path="/graph"
          element={user ? <ContributionGraph /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFound />} />
        <Route path="/showData" element={<ShowData />} />
      </Routes>
    </div>
  );
};

export default App;
