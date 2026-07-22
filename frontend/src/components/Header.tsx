import { useAuthStore } from "@/store/authStore";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useThemeStore } from "@/store/themeStore";
import { ChartColumn, LayoutDashboard, Moon, Plus, Sun } from "lucide-react";

const navItem = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/log", label: "Log Entry", icon: Plus },
  { to: "/stats", label: "Stats", icon: ChartColumn },
];

const Header = () => {
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <header className="border-b bg-background">
      <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
        <nav className="flex gap-1">
          {navItem.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to}>
                <Button
                  variant={location.pathname === item.to ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-1.5"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            onClick={toggleTheme}
            variant={"ghost"}
            size={"icon"}
            className="cursor-pointer"
          >
            {theme == "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button onClick={logout} variant={"outline"} size={"sm"}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
};
export default Header;
