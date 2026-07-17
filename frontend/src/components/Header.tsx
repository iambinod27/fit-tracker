import { useAuthStore } from "@/store/authStore";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

const navItem = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/log", label: "Log Entry" },
  { to: "/stats", label: "Stats" },
];

const Header = () => {
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  return (
    <header className="border-b bg-background">
      <div className="max-w-2xl mx-auto px-8 py-4 flex items-center justify-between">
        <nav className="flex gap-1">
          {navItem.map((item) => (
            <Link key={item.to} to={item.to}>
              <Button
                variant={location.pathname === item.to ? "default" : "ghost"}
                size={"sm"}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <Button onClick={logout} variant={"outline"} size={"sm"}>
          Log out
        </Button>
      </div>
    </header>
  );
};
export default Header;
