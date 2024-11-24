import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Make sure you're using react-router-dom
import Dashboard from "./Dashboard/Dashboard";
import ManageStaff from "./Staff/ManageStaff";
import { SnackbarProvider } from 'notistack';

const LazyLogin = React.lazy(() => import("./Login/Login"));
const LazyDashboard = React.lazy(() => import("./Dashboard/Dashboard"));
const LazyManageStaff = React.lazy(() => import("./Staff/ManageStaff"));
const LazySettings = React.lazy(() => import("./Settings/Settings"));
const LazyAnalytics = React.lazy(() => import("./Analytics/Analytics"));
const LazyCompare = React.lazy(() => import("./Analytics/CompareAnalytics"));


//what
export default function App() {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={4000} >
      <Router>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LazyLogin />} />
            <Route path="/dashboard/:username" element={<LazyDashboard />} />
            <Route path="/staff" element={<LazyManageStaff />} />
            <Route path="/settings" element={<LazySettings />} />
            <Route path="/analytics" element={<LazyAnalytics />} />
            <Route path="/compare_analytics" element={<LazyCompare />} />
          </Routes>
        </React.Suspense>
      </Router>
    </SnackbarProvider>
  );
}
