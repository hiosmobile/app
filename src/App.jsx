import React, { useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "../components/ThemeContext";
import { AuthProvider, useAuth } from "./AuthContext";
import { App as CapacitorApp } from "@capacitor/app";

// Layouts
import Layout from "../components/Layout.jsx";
import TopBarWrapper from "../components/TopBarWrapper.jsx";
import {
  Card,
  RippleButton,
  MenuActionBtn,
} from "../components/HiMaterial.jsx";

// Auth Pages
import Gateway from "./pages/Gateway";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword.jsx";

// Pages
import Home from "./pages/Welcome";
import Restaurant from "./pages/Restaurant";
import HiCafe from "./pages/restaurant/HiCafe";
import Breakfast from "./pages/restaurant/Breakfast";
import CafeFiesta from "./pages/restaurant/CafeFiesta";
import Locations from "./pages/restaurant/Locations";
import HotelActivities from "./pages/HotelActivities";
import HiRewards from "./pages/HiRewards.jsx";

import Settings from "./pages/Settings";
import Appearance from "./pages/settings/Appearance";
import Accessibility from "./pages/settings/Accessibility";
import Apps from "./pages/settings/Apps";
import Updates from "./pages/settings/Updates.jsx";
import About from "./pages/settings/About";
import Privacy from "./pages/settings/Privacy";

import Help from "./pages/HelpCenter";
import Tutorial from "./pages/help/Tutorial";
import RestaurantHelp from "./pages/help/Restaurant.jsx";
import HotelHelp from "./pages/help/Hotel.jsx";
import AppFeedback from "./pages/help/AppFeedback.jsx";

import FullscreenViewer from "./pages/FullscreenViewer";

function AppRoutes() {
  const { currentUser, logout } = useAuth();

  // =========================================
  // UNAUTHENTICATED FLOW
  // =========================================
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/" element={<Gateway />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        {/* Redirect any unknown route back to Gateway */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (currentUser && !currentUser.emailVerified) {
    return (
      <main className="container mt-5">
        <Card>
          <div className="top-container">
            <h1 className="blue-h2">
              <span className="material-symbols-rounded titleIcon">
                mark_email_unread
              </span>
              Verify your email
            </h1>
          </div>
        </Card>

        <Card className="mt-2 text-start">
          <h2 className="card-title">
            Please click the link sent to <b>{currentUser.email}</b> to activate
            your HiAccount.
          </h2>
          <p>
            If it's "not there", it is -- just look in your spam folder. Let's
            not be lazy.
          </p>

          <MenuActionBtn
            icon="arrow_back"
            text="Back to log-in page"
            className="full"
            onClick={() => logout()}
          />
        </Card>
      </main>
    );
  }

  // =========================================
  // AUTHENTICATED FLOW (Main App)
  // =========================================
  return (
    <Routes>
      {/* MAIN APP LAYOUT (Nav Rails & FAB) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/restaurant/hicafe" element={<HiCafe />} />
        <Route path="/restaurant/breakfast" element={<Breakfast />} />
        <Route path="/restaurant/cafefiesta" element={<CafeFiesta />} />
        <Route path="/restaurant/locations" element={<Locations />} />
        <Route path="/hotelactivities" element={<HotelActivities />} />
        <Route path="/hirewards" element={<HiRewards />} />
        <Route path="/viewer" element={<FullscreenViewer />} />
      </Route>

      {/* TOP BAR LAYOUT (Settings & Help Center) */}
      <Route
        path="/settings"
        element={
          <TopBarWrapper title="Settings">
            <Settings />
          </TopBarWrapper>
        }
      />
      <Route
        path="/settings/appearance"
        element={
          <TopBarWrapper title="Appearance">
            <Appearance />
          </TopBarWrapper>
        }
      />
      <Route
        path="/settings/accessibility"
        element={
          <TopBarWrapper title="Accessibility">
            <Accessibility />
          </TopBarWrapper>
        }
      />
      <Route
        path="/settings/apps"
        element={
          <TopBarWrapper title="Apps and websites">
            <Apps />
          </TopBarWrapper>
        }
      />
      <Route
        path="/settings/updates"
        element={
          <TopBarWrapper title="Updates">
            <Updates />
          </TopBarWrapper>
        }
      />
      <Route
        path="/settings/about"
        element={
          <TopBarWrapper title="About">
            <About />
          </TopBarWrapper>
        }
      />
      <Route
        path="/settings/privacy"
        element={
          <TopBarWrapper title="Privacy policy">
            <Privacy />
          </TopBarWrapper>
        }
      />
      <Route
        path="/help"
        element={
          <TopBarWrapper title="Help Center">
            <Help />
          </TopBarWrapper>
        }
      />
      <Route
        path="/help/tutorial"
        element={
          <TopBarWrapper title="Tutorial">
            <Tutorial />
          </TopBarWrapper>
        }
      />
      <Route
        path="/help/food"
        element={
          <TopBarWrapper title="Food">
            <RestaurantHelp />
          </TopBarWrapper>
        }
      />
      <Route
        path="/help/hotel"
        element={
          <TopBarWrapper title="Hotel">
            <HotelHelp />
          </TopBarWrapper>
        }
      />
      <Route
        path="/help/feedback"
        element={
          <TopBarWrapper title="Send Feedback">
            <AppFeedback />
          </TopBarWrapper>
        }
      />

      {/* Redirect any unknown route back to the app Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// =========================================
// ANDROID NATIVE BACK BUTTON HANDLER
// =========================================
function NativeBackButtonHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBackButton = CapacitorApp.addListener(
      "backButton",
      ({ canGoBack }) => {
        if (canGoBack) {
          navigate(-1); // Tell React Router to go back one page
        } else {
          CapacitorApp.exitApp(); // If there is no history left, close the app natively
        }
      },
    );

    return () => {
      handleBackButton.then((listener) => listener.remove());
    };
  }, [navigate]);

  return null; // This component renders nothing visually
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <NativeBackButtonHandler />
          <AppRoutes />
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
