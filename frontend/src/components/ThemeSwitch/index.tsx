import { useTheme } from "@/contexts/ThemeContext";
import { SwitchEl } from "./styled";

export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <SwitchEl>
      <input
        type="checkbox"
        onChange={toggleTheme}
        checked={theme === "dark"}
      />
      <span />
    </SwitchEl>
  );
}
