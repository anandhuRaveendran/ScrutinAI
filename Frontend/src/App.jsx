import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "./Pages/Home/App";
import Dashboard from "./Pages/Dashboard/App";
import Audit from "./Pages/Audit/App";
import Governance from "./Pages/Governance/App";
import Login from "./Pages/Auth/Login/App";
import Register from "./Pages/Auth/Register/App";

import ProtectedRoute from "./utils/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import NotFound from "./Pages/NotFound/App.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <Routes>

        {/* Auth Pages (No Navbar) */}
        <Route element={<AuthLayout />}>
          <Route path="/logout" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Main App Pages (With Navbar) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

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
        </Route>

      </Routes>
    </Router>
  </QueryClientProvider>
);

export default App;
