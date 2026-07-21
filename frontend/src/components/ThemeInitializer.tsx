import { useThemeStore } from "@/store/themeStore"
import { useEffect } from "react";

const ThemeInitializer = () => {
    const theme = useThemeStore((state) => state.theme);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === "dark")
    }, [theme])

  return null
}
export default ThemeInitializer