import { ref, onMounted } from "vue";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
    const theme = ref<Theme>(
        (localStorage.getItem("theme") as Theme) || "system",
    );

    const setTheme = (newTheme: Theme) => {
        theme.value = newTheme;
        if (newTheme === "system") {
            localStorage.removeItem("theme");
        } else {
            localStorage.setItem("theme", newTheme);
        }
        applyTheme();
    };

    const applyTheme = () => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (theme.value === "system") {
            const systemTheme = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches
                ? "dark"
                : "light";
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme.value);
        }
    };

    onMounted(() => {
        applyTheme();

        // Listen for system theme changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            if (theme.value === "system") {
                applyTheme();
            }
        };

        mediaQuery.addEventListener("change", handleChange);
    });

    return {
        theme,
        setTheme,
    };
}
