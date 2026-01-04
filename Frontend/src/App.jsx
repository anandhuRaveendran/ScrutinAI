import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";

import Home from "./Pages/Home/App";
import Dashboard from "./Pages/Dashboard/App";
import Audit from "./Pages/Audit/App";
import Governance from "./Pages/Governance/App";
import Login from "./Pages/Auth/Login.jsx";
import Register from "./Pages/Auth/Register.jsx";
import OAuthSuccess from "./Pages/Auth/OAuthSuccess";

import ProtectedRoute from "./utils/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import NotFound from "./Pages/NotFound/App.jsx";
import Notifications from "./Components/Nofitication/app.jsx";
import ProfilePage from "./Pages/Profile/ProfilePage.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <AuthProvider>
        <Routes>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/audit"
              element={
                <ProtectedRoute>
                  <Audit />
                </ProtectedRoute>
              }
            />

            <Route
              path="/governance"
              element={
                <ProtectedRoute>
                  <Governance />
                </ProtectedRoute>
              }
            />


            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
          </Route>


          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="*" element={<NotFound />} />

        </Routes>
      </AuthProvider>
    </Router>
  </QueryClientProvider>
);

export default App;
