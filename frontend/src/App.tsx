import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PublicRoute from "./components/PublicRoute";
import LogEntry from "./pages/LogEntry";
import Header from "./components/Header";
import Stats from "./pages/Stats";
import Register from "./pages/Register";
import Notfound from "./pages/Notfound";
import ThemeInitializer from "./components/ThemeInitializer";

function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeInitializer />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/log" element={<LogEntry />} />
            <Route path="/stats" element={<Stats />} />
          </Route>
        </Route>

        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
