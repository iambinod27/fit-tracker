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
import { Toaster } from "./components/ui/sonner";
import Footer from "./components/Footer";

function AppLayout() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeInitializer />
      <Toaster />
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

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
