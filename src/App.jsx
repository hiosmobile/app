import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import WrapperPage from "./components/WrapperPage";
import TopBarWrapper from "./components/TopBarWrapper";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={<WrapperPage src="https://thehighlandcafe.github.io/hioswebcore/welcome.html" title="Home" />}
          />
          <Route
            path="restaurant"
            element={<WrapperPage src="https://thehighlandcafe.github.io/hioswebcore/restaurant.html" title="Eat" />}
          />
          <Route
            path="hotel"
            element={<WrapperPage src="https://thehighlandcafe.github.io/hioswebcore/hotelactivities.html" title="Stay" />}
          />
          <Route
            path="roomkey"
            element={<WrapperPage src="https://thehighlandcafe.github.io/hioswebcore/roomkey.html" title="Room Key" />}
          />
        </Route>

        <Route
          path="/settings"
          element={<TopBarWrapper src="https://thehighlandcafe.github.io/hioswebcore/activities/settingsActivity/home.html" title="Settings" />}
        />

        <Route
          path="/help"
          element={<TopBarWrapper src="https://thehighlandcafe.github.io/hioswebcore/activities/helpcenterActivity/home.html" title="Help" />}
        />
      </Routes>
    </HashRouter>
  );
}